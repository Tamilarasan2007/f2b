from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import get_db
from app.models.user import User
from app.models.farmer import Farmer
from app.models.pickup import PickupRequest
from app.models.vehicle import Vehicle, Driver
from app.models.route import Route, RouteStop
from app.models.order import Order
from app.models.notification import Notification
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import DashboardStats, NotificationOut
from typing import List

router = APIRouter(prefix="/api", tags=["Dashboard & Notifications"])


@router.get("/dashboard/admin", response_model=DashboardStats)
async def admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"])),
):
    farmers = (await db.execute(select(func.count(Farmer.id)))).scalar() or 0
    active_vehicles = (await db.execute(
        select(func.count(Vehicle.id)).where(Vehicle.is_available == False)
    )).scalar() or 0
    pending = (await db.execute(
        select(func.count(PickupRequest.id)).where(PickupRequest.status == "PENDING")
    )).scalar() or 0
    active_routes = (await db.execute(
        select(func.count(Route.id)).where(Route.status.in_(["STARTED", "IN_PROGRESS", "PLANNED"]))
    )).scalar() or 0
    completed = (await db.execute(
        select(func.count(Route.id)).where(Route.status == "COMPLETED")
    )).scalar() or 0
    total_qty = (await db.execute(
        select(func.sum(PickupRequest.quantity_kg))
    )).scalar() or 0
    total_dist = (await db.execute(
        select(func.sum(Route.total_distance_km)).where(Route.status == "COMPLETED")
    )).scalar() or 0
    avg_dur = (await db.execute(
        select(func.avg(Route.estimated_duration_minutes)).where(Route.status == "COMPLETED")
    )).scalar() or 0

    return DashboardStats(
        total_farmers=farmers,
        active_vehicles=active_vehicles,
        pending_pickups=pending,
        active_routes=active_routes,
        completed_deliveries=completed,
        total_crop_quantity_kg=round(total_qty, 2),
        total_distance_km=round(total_dist, 2),
        avg_delivery_time_min=round(avg_dur, 2),
    )


@router.get("/dashboard/farmer", response_model=DashboardStats)
async def farmer_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["FARMER"])),
):
    farmer_result = await db.execute(select(Farmer).where(Farmer.user_id == current_user.id))
    farmer = farmer_result.scalar_one_or_none()
    if not farmer:
        return DashboardStats()

    pending = (await db.execute(
        select(func.count(PickupRequest.id)).where(
            PickupRequest.farmer_id == farmer.id,
            PickupRequest.status == "PENDING",
        )
    )).scalar() or 0
    completed = (await db.execute(
        select(func.count(PickupRequest.id)).where(
            PickupRequest.farmer_id == farmer.id,
            PickupRequest.status == "DELIVERED",
        )
    )).scalar() or 0
    total_qty = (await db.execute(
        select(func.sum(PickupRequest.quantity_kg)).where(
            PickupRequest.farmer_id == farmer.id,
        )
    )).scalar() or 0

    return DashboardStats(
        pending_pickups=pending,
        completed_deliveries=completed,
        total_crop_quantity_kg=round(total_qty, 2),
    )


@router.get("/dashboard/operator", response_model=DashboardStats)
async def operator_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["COLLECTION_POINT_OPERATOR", "ADMIN"])),
):
    pending = (await db.execute(
        select(func.count(PickupRequest.id)).where(PickupRequest.status == "PENDING")
    )).scalar() or 0
    active_routes = (await db.execute(
        select(func.count(Route.id)).where(Route.status.in_(["STARTED", "IN_PROGRESS", "PLANNED"]))
    )).scalar() or 0
    available_vehicles = (await db.execute(
        select(func.count(Vehicle.id)).where(Vehicle.is_available == True)
    )).scalar() or 0
    total_qty = (await db.execute(
        select(func.sum(PickupRequest.quantity_kg)).where(PickupRequest.status == "PENDING")
    )).scalar() or 0

    return DashboardStats(
        pending_pickups=pending,
        active_routes=active_routes,
        active_vehicles=available_vehicles,
        total_crop_quantity_kg=round(total_qty, 2),
    )


@router.get("/dashboard/driver", response_model=DashboardStats)
async def driver_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER"])),
):
    driver_result = await db.execute(select(Driver).where(Driver.user_id == current_user.id))
    driver = driver_result.scalar_one_or_none()
    if not driver:
        return DashboardStats()

    active_routes = (await db.execute(
        select(func.count(Route.id)).where(
            Route.driver_id == driver.id,
            Route.status.in_(["STARTED", "PLANNED"]),
        )
    )).scalar() or 0
    completed = (await db.execute(
        select(func.count(Route.id)).where(
            Route.driver_id == driver.id,
            Route.status == "COMPLETED",
        )
    )).scalar() or 0

    return DashboardStats(
        active_routes=active_routes,
        completed_deliveries=completed,
    )


@router.get("/dashboard/buyer", response_model=DashboardStats)
async def buyer_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["BUYER"])),
):
    from app.models.buyer import Buyer
    buyer_result = await db.execute(select(Buyer).where(Buyer.user_id == current_user.id))
    buyer = buyer_result.scalar_one_or_none()
    if not buyer:
        return DashboardStats()

    pending_orders = (await db.execute(
        select(func.count(Order.id)).where(
            Order.buyer_id == buyer.id,
            Order.status == "PENDING",
        )
    )).scalar() or 0
    completed_orders = (await db.execute(
        select(func.count(Order.id)).where(
            Order.buyer_id == buyer.id,
            Order.status == "DELIVERED",
        )
    )).scalar() or 0

    return DashboardStats(
        pending_pickups=pending_orders,
        completed_deliveries=completed_orders,
    )


# ── Notifications ──
@router.get("/notifications", response_model=List[NotificationOut])
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    notifications = result.scalars().all()
    return [NotificationOut.model_validate(n) for n in notifications]


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notif = result.scalar_one_or_none()
    if notif:
        notif.is_read = True
        await db.commit()
    return {"success": True}


# ── Collection Points ──
@router.get("/collection-points")
async def list_collection_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.collection_point import CollectionPoint
    result = await db.execute(select(CollectionPoint))
    points = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "address": p.address,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "operator_user_id": p.operator_user_id,
        }
        for p in points
    ]
