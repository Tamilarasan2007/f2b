from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.farmer import Farmer
from app.models.pickup import PickupRequest
from app.models.vehicle import Vehicle, Driver
from app.models.route import Route, RouteStop
from app.models.notification import Notification
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import (
    RouteOut, RouteStopOut, OptimizeRouteRequest, MessageResponse
)
from app.services.optimization_service import optimize_route
from app.services.cost_service import calculate_transportation_cost

router = APIRouter(prefix="/api/routes", tags=["Routes"])


@router.post("/optimize", response_model=RouteOut, status_code=201)
async def optimize_and_create_route(
    data: OptimizeRouteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    # Validate vehicle
    veh_result = await db.execute(select(Vehicle).where(Vehicle.id == data.vehicle_id))
    vehicle = veh_result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if not vehicle.is_available:
        raise HTTPException(status_code=400, detail="Vehicle is not available")

    # Validate and load pickup requests
    pickup_points = []
    for pid in data.pickup_request_ids:
        pr_result = await db.execute(select(PickupRequest).where(PickupRequest.id == pid))
        pr = pr_result.scalar_one_or_none()
        if not pr:
            raise HTTPException(status_code=404, detail=f"Pickup request {pid} not found")
        if pr.status not in ["PENDING", "ASSIGNED"]:
            raise HTTPException(
                status_code=400,
                detail=f"Pickup request {pid} has status '{pr.status}' and cannot be assigned to a route",
            )

        # Get farmer name
        farmer_result = await db.execute(select(Farmer).where(Farmer.id == pr.farmer_id))
        farmer = farmer_result.scalar_one_or_none()
        farmer_name = ""
        if farmer:
            user_result = await db.execute(select(User).where(User.id == farmer.user_id))
            user = user_result.scalar_one_or_none()
            farmer_name = user.full_name if user else ""

        pickup_points.append({
            "id": pr.id,
            "latitude": pr.latitude or 11.0 + len(pickup_points) * 0.05,
            "longitude": pr.longitude or 77.0 + len(pickup_points) * 0.05,
            "quantity_kg": pr.quantity_kg,
            "crop_name": pr.crop_name,
            "farmer_name": farmer_name,
            "location_name": f"Farm - {farmer_name}" if farmer_name else f"Farm {pr.id}",
        })

    # Check capacity
    total_load = sum(p["quantity_kg"] for p in pickup_points)
    if total_load > vehicle.capacity_kg:
        raise HTTPException(
            status_code=400,
            detail=f"Total load ({total_load} kg) exceeds vehicle capacity ({vehicle.capacity_kg} kg)",
        )

    destination = {
        "latitude": data.destination_lat,
        "longitude": data.destination_lng,
        "name": data.destination_name,
    }

    # Run optimization
    result = await optimize_route(
        pickup_points=pickup_points,
        vehicle_capacity_kg=vehicle.capacity_kg,
        destination=destination,
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["message"])

    # Calculate cost
    cost = calculate_transportation_cost(
        distance_km=result["total_distance_km"],
        vehicle_mileage_km_per_liter=vehicle.mileage_km_per_liter,
    )

    # Create route
    route = Route(
        vehicle_id=vehicle.id,
        driver_id=data.driver_id,
        collection_point_id=data.collection_point_id,
        destination_name=data.destination_name,
        destination_lat=data.destination_lat,
        destination_lng=data.destination_lng,
        total_distance_km=result["total_distance_km"],
        estimated_duration_minutes=result["estimated_duration_minutes"],
        total_load_kg=result["total_load_kg"],
        vehicle_capacity_kg=vehicle.capacity_kg,
        estimated_cost=cost["total_cost"],
        fuel_cost=cost["fuel_cost"],
        driver_cost=cost["driver_cost"],
        other_cost=cost["loading_cost"],
        route_geometry=result.get("route_geometry"),
        status="PLANNED",
        is_fallback_route="true" if result.get("is_fallback") else "false",
    )
    db.add(route)
    await db.flush()

    # Create route stops
    for stop_data in result["optimized_stops"]:
        stop = RouteStop(
            route_id=route.id,
            pickup_request_id=stop_data.get("pickup_request_id"),
            sequence=stop_data["sequence"],
            stop_type=stop_data["stop_type"],
            location_name=stop_data.get("location_name"),
            latitude=stop_data["latitude"],
            longitude=stop_data["longitude"],
            quantity_kg=stop_data.get("quantity_kg"),
            crop_name=stop_data.get("crop_name"),
            farmer_name=stop_data.get("farmer_name"),
            status="PENDING",
        )
        db.add(stop)

    # Update pickup statuses
    for pid in data.pickup_request_ids:
        pr_result = await db.execute(select(PickupRequest).where(PickupRequest.id == pid))
        pr = pr_result.scalar_one_or_none()
        if pr:
            pr.status = "ASSIGNED"

    # Mark vehicle as unavailable
    vehicle.is_available = False

    await db.commit()
    await db.refresh(route)

    # Reload stops
    stops_result = await db.execute(
        select(RouteStop).where(RouteStop.route_id == route.id).order_by(RouteStop.sequence)
    )
    route_stops = stops_result.scalars().all()

    route_out = RouteOut.model_validate(route)
    route_out.stops = [RouteStopOut.model_validate(s) for s in route_stops]
    return route_out


@router.get("/", response_model=List[RouteOut])
async def list_routes(
    status_filter: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Route)

    if current_user.role == "DRIVER":
        driver_result = await db.execute(
            select(Driver).where(Driver.user_id == current_user.id)
        )
        driver = driver_result.scalar_one_or_none()
        if driver:
            query = query.where(Route.driver_id == driver.id)
        else:
            return []

    if status_filter:
        query = query.where(Route.status == status_filter)

    query = query.order_by(Route.created_at.desc())
    result = await db.execute(query)
    routes = result.scalars().all()

    out = []
    for r in routes:
        stops_result = await db.execute(
            select(RouteStop).where(RouteStop.route_id == r.id).order_by(RouteStop.sequence)
        )
        stops = stops_result.scalars().all()
        route_out = RouteOut.model_validate(r)
        route_out.stops = [RouteStopOut.model_validate(s) for s in stops]
        out.append(route_out)
    return out


@router.get("/{route_id}", response_model=RouteOut)
async def get_route(
    route_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Route).where(Route.id == route_id))
    route = result.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    stops_result = await db.execute(
        select(RouteStop).where(RouteStop.route_id == route.id).order_by(RouteStop.sequence)
    )
    stops = stops_result.scalars().all()

    route_out = RouteOut.model_validate(route)
    route_out.stops = [RouteStopOut.model_validate(s) for s in stops]
    return route_out


@router.post("/{route_id}/start", response_model=MessageResponse)
async def start_route(
    route_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER", "ADMIN"])),
):
    result = await db.execute(select(Route).where(Route.id == route_id))
    route = result.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    if route.status == "COMPLETED":
        raise HTTPException(status_code=400, detail="Completed route cannot be started again")
    if route.status not in ["PLANNED"]:
        raise HTTPException(status_code=400, detail=f"Route with status '{route.status}' cannot be started")

    route.status = "STARTED"
    route.started_at = datetime.now(timezone.utc)

    # Update pickup statuses
    stops_result = await db.execute(
        select(RouteStop).where(RouteStop.route_id == route.id)
    )
    for stop in stops_result.scalars().all():
        if stop.pickup_request_id:
            pr_result = await db.execute(
                select(PickupRequest).where(PickupRequest.id == stop.pickup_request_id)
            )
            pr = pr_result.scalar_one_or_none()
            if pr:
                pr.status = "PICKUP_STARTED"

    await db.commit()
    return MessageResponse(success=True, message="Route started")


@router.post("/{route_id}/stops/{stop_id}/arrive", response_model=MessageResponse)
async def arrive_at_stop(
    route_id: int,
    stop_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER", "ADMIN"])),
):
    result = await db.execute(
        select(RouteStop).where(RouteStop.id == stop_id, RouteStop.route_id == route_id)
    )
    stop = result.scalar_one_or_none()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    stop.status = "ARRIVED"
    stop.arrived_at = datetime.now(timezone.utc)
    await db.commit()
    return MessageResponse(success=True, message="Arrived at stop")


@router.post("/{route_id}/stops/{stop_id}/complete", response_model=MessageResponse)
async def complete_stop(
    route_id: int,
    stop_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER", "ADMIN"])),
):
    result = await db.execute(
        select(RouteStop).where(RouteStop.id == stop_id, RouteStop.route_id == route_id)
    )
    stop = result.scalar_one_or_none()
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    stop.status = "COMPLETED"
    stop.completed_at = datetime.now(timezone.utc)

    # Update pickup request status
    if stop.pickup_request_id and stop.stop_type == "pickup":
        pr_result = await db.execute(
            select(PickupRequest).where(PickupRequest.id == stop.pickup_request_id)
        )
        pr = pr_result.scalar_one_or_none()
        if pr:
            pr.status = "PICKED_UP"

            # Notify farmer
            farmer_result = await db.execute(select(Farmer).where(Farmer.id == pr.farmer_id))
            farmer = farmer_result.scalar_one_or_none()
            if farmer:
                notif = Notification(
                    user_id=farmer.user_id,
                    title="Crop Picked Up",
                    message=f"Your {pr.crop_name} ({pr.quantity_kg} kg) has been picked up.",
                )
                db.add(notif)

    await db.commit()
    return MessageResponse(success=True, message="Stop completed")


@router.post("/{route_id}/complete", response_model=MessageResponse)
async def complete_route(
    route_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER", "ADMIN"])),
):
    result = await db.execute(select(Route).where(Route.id == route_id))
    route = result.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")

    # Check all pickup stops are completed
    stops_result = await db.execute(
        select(RouteStop).where(
            RouteStop.route_id == route.id,
            RouteStop.stop_type == "pickup",
            RouteStop.status != "COMPLETED",
        )
    )
    incomplete = stops_result.scalars().all()
    if incomplete:
        raise HTTPException(
            status_code=400,
            detail="Cannot complete route: not all pickup stops are completed",
        )

    route.status = "COMPLETED"
    route.completed_at = datetime.now(timezone.utc)

    # Mark vehicle available again
    if route.vehicle_id:
        veh_result = await db.execute(select(Vehicle).where(Vehicle.id == route.vehicle_id))
        vehicle = veh_result.scalar_one_or_none()
        if vehicle:
            vehicle.is_available = True

    # Update all associated pickup requests to DELIVERED
    all_stops = await db.execute(
        select(RouteStop).where(RouteStop.route_id == route.id)
    )
    for stop in all_stops.scalars().all():
        if stop.stop_type == "delivery":
            stop.status = "COMPLETED"
            stop.completed_at = datetime.now(timezone.utc)
        if stop.pickup_request_id:
            pr_result = await db.execute(
                select(PickupRequest).where(PickupRequest.id == stop.pickup_request_id)
            )
            pr = pr_result.scalar_one_or_none()
            if pr:
                pr.status = "DELIVERED"
                # Notify farmer
                farmer_result = await db.execute(select(Farmer).where(Farmer.id == pr.farmer_id))
                farmer = farmer_result.scalar_one_or_none()
                if farmer:
                    notif = Notification(
                        user_id=farmer.user_id,
                        title="Crop Delivered",
                        message=f"Your {pr.crop_name} has been delivered to {route.destination_name}.",
                    )
                    db.add(notif)

    await db.commit()
    return MessageResponse(success=True, message="Route completed — delivery confirmed")
