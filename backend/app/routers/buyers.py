from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database.session import get_db
from app.models.user import User
from app.models.buyer import Buyer
from app.models.order import Order
from app.core.dependencies import get_current_user, require_role
from app.schemas.schemas import BuyerCreate, BuyerOut, OrderCreate, OrderOut

router = APIRouter(prefix="/api", tags=["Buyers & Orders"])


# ── Buyers ──
@router.get("/buyers", response_model=List[BuyerOut])
async def list_buyers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN", "COLLECTION_POINT_OPERATOR"])),
):
    result = await db.execute(select(Buyer))
    buyers = result.scalars().all()
    return [BuyerOut.model_validate(b) for b in buyers]


@router.post("/buyers", response_model=BuyerOut, status_code=201)
async def create_buyer(
    data: BuyerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["ADMIN"])),
):
    buyer_result = await db.execute(
        select(Buyer).where(Buyer.user_id == current_user.id)
    )
    existing = buyer_result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Buyer profile already exists")

    buyer = Buyer(user_id=current_user.id, **data.model_dump())
    db.add(buyer)
    await db.commit()
    await db.refresh(buyer)
    return BuyerOut.model_validate(buyer)


# ── Orders ──
@router.get("/orders", response_model=List[OrderOut])
async def list_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "BUYER":
        buyer_result = await db.execute(
            select(Buyer).where(Buyer.user_id == current_user.id)
        )
        buyer = buyer_result.scalar_one_or_none()
        if not buyer:
            return []
        result = await db.execute(
            select(Order).where(Order.buyer_id == buyer.id).order_by(Order.created_at.desc())
        )
    else:
        result = await db.execute(select(Order).order_by(Order.created_at.desc()))
    orders = result.scalars().all()
    return [OrderOut.model_validate(o) for o in orders]


@router.post("/orders", response_model=OrderOut, status_code=201)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["BUYER", "ADMIN"])),
):
    buyer_result = await db.execute(
        select(Buyer).where(Buyer.user_id == current_user.id)
    )
    buyer = buyer_result.scalar_one_or_none()
    buyer_id = buyer.id if buyer else 1

    order = Order(
        buyer_id=buyer_id,
        crop_name=data.crop_name,
        required_quantity_kg=data.required_quantity_kg,
        delivery_location=data.delivery_location,
        required_delivery_date=data.required_delivery_date,
        delivery_time_start=data.delivery_time_start,
        delivery_time_end=data.delivery_time_end,
        latitude=data.latitude,
        longitude=data.longitude,
        status="PENDING",
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return OrderOut.model_validate(order)


@router.put("/orders/{order_id}", response_model=OrderOut)
async def update_order(
    order_id: int,
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(order, key, value)
    await db.commit()
    await db.refresh(order)
    return OrderOut.model_validate(order)
