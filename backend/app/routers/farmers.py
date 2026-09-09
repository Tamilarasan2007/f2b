from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.farmer import Farmer, Farm
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import FarmerOut, FarmerCreate, FarmCreate, FarmOut

router = APIRouter(prefix="/api", tags=["Farmers & Farms"])


# ── Farmers ──
@router.get("/farmers", response_model=List[FarmerOut])
async def list_farmers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    result = await db.execute(select(Farmer))
    farmers = result.scalars().all()
    return [FarmerOut.model_validate(f) for f in farmers]


@router.get("/farmers/{farmer_id}", response_model=FarmerOut)
async def get_farmer(
    farmer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return FarmerOut.model_validate(farmer)


@router.put("/farmers/{farmer_id}", response_model=FarmerOut)
async def update_farmer(
    farmer_id: int,
    data: FarmerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Farmer).where(Farmer.id == farmer_id))
    farmer = result.scalar_one_or_none()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(farmer, key, value)
    await db.commit()
    await db.refresh(farmer)
    return FarmerOut.model_validate(farmer)


# ── Farms ──
@router.get("/farms", response_model=List[FarmOut])
async def list_farms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "FARMER":
        farmer_result = await db.execute(
            select(Farmer).where(Farmer.user_id == current_user.id)
        )
        farmer = farmer_result.scalar_one_or_none()
        if not farmer:
            return []
        result = await db.execute(select(Farm).where(Farm.farmer_id == farmer.id))
    else:
        result = await db.execute(select(Farm))
    farms = result.scalars().all()
    return [FarmOut.model_validate(f) for f in farms]


@router.post("/farms", response_model=FarmOut, status_code=201)
async def create_farm(
    data: FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["FARMER", "ADMIN"])),
):
    farmer_result = await db.execute(
        select(Farmer).where(Farmer.user_id == current_user.id)
    )
    farmer = farmer_result.scalar_one_or_none()
    if not farmer and current_user.role == "FARMER":
        raise HTTPException(status_code=400, detail="Farmer profile not found")

    farm = Farm(
        farmer_id=farmer.id if farmer else 1,
        name=data.name,
        address=data.address,
        latitude=data.latitude,
        longitude=data.longitude,
        area_acres=data.area_acres,
    )
    db.add(farm)
    await db.commit()
    await db.refresh(farm)
    return FarmOut.model_validate(farm)


@router.put("/farms/{farm_id}", response_model=FarmOut)
async def update_farm(
    farm_id: int,
    data: FarmCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Farm).where(Farm.id == farm_id))
    farm = result.scalar_one_or_none()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(farm, key, value)
    await db.commit()
    await db.refresh(farm)
    return FarmOut.model_validate(farm)
