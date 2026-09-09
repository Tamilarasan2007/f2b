from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.farmer import Farmer
from app.models.pickup import PickupRequest
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import (
    PickupRequestCreate, PickupRequestUpdate, PickupRequestOut, MessageResponse
)

router = APIRouter(prefix="/api/pickups", tags=["Pickup Requests"])


@router.get("/", response_model=List[PickupRequestOut])
async def list_pickups(
    status_filter: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(PickupRequest)

    if current_user.role == "FARMER":
        farmer_result = await db.execute(
            select(Farmer).where(Farmer.user_id == current_user.id)
        )
        farmer = farmer_result.scalar_one_or_none()
        if not farmer:
            return []
        query = query.where(PickupRequest.farmer_id == farmer.id)

    if status_filter:
        query = query.where(PickupRequest.status == status_filter)

    query = query.order_by(PickupRequest.created_at.desc())
    result = await db.execute(query)
    pickups = result.scalars().all()
    return [PickupRequestOut.model_validate(p) for p in pickups]


@router.post("/", response_model=PickupRequestOut, status_code=201)
async def create_pickup(
    data: PickupRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["FARMER", "ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    if data.quantity_kg <= 0:
        raise HTTPException(status_code=400, detail="Crop quantity must be greater than zero")

    farmer_result = await db.execute(
        select(Farmer).where(Farmer.user_id == current_user.id)
    )
    farmer = farmer_result.scalar_one_or_none()

    # If admin/operator creating on behalf, farmer_id can be set differently
    farmer_id = farmer.id if farmer else 1

    pickup = PickupRequest(
        farmer_id=farmer_id,
        farm_id=data.farm_id,
        crop_name=data.crop_name,
        quantity_kg=data.quantity_kg,
        unit=data.unit,
        harvest_date=data.harvest_date,
        preferred_pickup_date=data.preferred_pickup_date,
        preferred_pickup_time_start=data.preferred_pickup_time_start,
        preferred_pickup_time_end=data.preferred_pickup_time_end,
        notes=data.notes,
        latitude=data.latitude,
        longitude=data.longitude,
        status="PENDING",
    )
    db.add(pickup)
    await db.commit()
    await db.refresh(pickup)
    return PickupRequestOut.model_validate(pickup)


@router.get("/{pickup_id}", response_model=PickupRequestOut)
async def get_pickup(
    pickup_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PickupRequest).where(PickupRequest.id == pickup_id)
    )
    pickup = result.scalar_one_or_none()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup request not found")
    return PickupRequestOut.model_validate(pickup)


@router.put("/{pickup_id}", response_model=PickupRequestOut)
async def update_pickup(
    pickup_id: int,
    data: PickupRequestUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PickupRequest).where(PickupRequest.id == pickup_id)
    )
    pickup = result.scalar_one_or_none()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup request not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(pickup, key, value)
    await db.commit()
    await db.refresh(pickup)
    return PickupRequestOut.model_validate(pickup)


@router.post("/{pickup_id}/cancel", response_model=MessageResponse)
async def cancel_pickup(
    pickup_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(PickupRequest).where(PickupRequest.id == pickup_id)
    )
    pickup = result.scalar_one_or_none()
    if not pickup:
        raise HTTPException(status_code=404, detail="Pickup request not found")

    if pickup.status in ["DELIVERED", "PICKED_UP"]:
        raise HTTPException(
            status_code=400,
            detail="Completed pickup cannot be cancelled",
        )

    pickup.status = "CANCELLED"
    await db.commit()
    return MessageResponse(success=True, message="Pickup request cancelled")
