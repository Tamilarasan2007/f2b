from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Index
from app.database.base import Base, TimestampMixin


class PickupRequest(Base, TimestampMixin):
    __tablename__ = "pickup_requests"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    crop_name = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    unit = Column(String(10), default="kg")  # kg, ton
    harvest_date = Column(Date, nullable=True)
    preferred_pickup_date = Column(Date, nullable=True)
    preferred_pickup_time_start = Column(String(10), nullable=True)  # "08:00"
    preferred_pickup_time_end = Column(String(10), nullable=True)  # "11:00"
    notes = Column(String(500), nullable=True)
    status = Column(String(20), default="PENDING")
    # PENDING, ASSIGNED, PICKUP_STARTED, PICKED_UP, DELIVERED, CANCELLED
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    __table_args__ = (
        Index("ix_pickup_status", "status"),
        Index("ix_pickup_farmer", "farmer_id"),
    )
