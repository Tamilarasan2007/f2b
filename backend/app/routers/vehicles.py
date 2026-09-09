from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.vehicle import Driver, Vehicle, VehicleLocation
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import (
    DriverCreate, DriverOut, VehicleCreate, VehicleUpdate, VehicleOut,
    LocationUpdate, MessageResponse
)

router = APIRouter(prefix="/api", tags=["Vehicles & Drivers"])


# ── Drivers ──
@router.get("/drivers", response_model=List[DriverOut])
async def list_drivers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    result = await db.execute(select(Driver))
    drivers = result.scalars().all()
    out = []
    for d in drivers:
        driver_out = DriverOut.model_validate(d)
        # Load user info
        user_result = await db.execute(select(User).where(User.id == d.user_id))
        user = user_result.scalar_one_or_none()
        if user:
            from app.schemas.schemas import UserOut
            driver_out.user = UserOut.model_validate(user)
        out.append(driver_out)
    return out


@router.get("/drivers/{driver_id}", response_model=DriverOut)
async def get_driver(
    driver_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return DriverOut.model_validate(driver)


@router.put("/drivers/{driver_id}", response_model=DriverOut)
async def update_driver(
    driver_id: int,
    data: DriverCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(driver, key, value)
    await db.commit()
    await db.refresh(driver)
    return DriverOut.model_validate(driver)


@router.post("/drivers/location", response_model=MessageResponse)
async def update_driver_location(
    data: LocationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["DRIVER"])),
):
    driver_result = await db.execute(
        select(Driver).where(Driver.user_id == current_user.id)
    )
    driver = driver_result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    # Update vehicle location if assigned
    vehicle_result = await db.execute(
        select(Vehicle).where(Vehicle.driver_id == driver.id)
    )
    vehicle = vehicle_result.scalar_one_or_none()

    if vehicle:
        vehicle.current_lat = data.latitude
        vehicle.current_lng = data.longitude

        location = VehicleLocation(
            vehicle_id=vehicle.id,
            driver_id=driver.id,
            latitude=data.latitude,
            longitude=data.longitude,
            timestamp=data.timestamp or "",
        )
        db.add(location)

    await db.commit()
    return MessageResponse(success=True, message="Location updated")


# ── Vehicles ──
@router.get("/vehicles", response_model=List[VehicleOut])
async def list_vehicles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Vehicle))
    vehicles = result.scalars().all()
    return [VehicleOut.model_validate(v) for v in vehicles]


@router.post("/vehicles", response_model=VehicleOut, status_code=201)
async def create_vehicle(
    data: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    vehicle = Vehicle(**data.model_dump())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return VehicleOut.model_validate(vehicle)


@router.put("/vehicles/{vehicle_id}", response_model=VehicleOut)
async def update_vehicle(
    vehicle_id: int,
    data: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(vehicle, key, value)
    await db.commit()
    await db.refresh(vehicle)
    return VehicleOut.model_validate(vehicle)
