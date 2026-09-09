from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.database.base import Base, TimestampMixin


class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("buyers.id"), nullable=False)
    crop_name = Column(String(100), nullable=False)
    required_quantity_kg = Column(Float, nullable=False)
    delivery_location = Column(String(500), nullable=True)
    required_delivery_date = Column(Date, nullable=True)
    delivery_time_start = Column(String(10), nullable=True)
    delivery_time_end = Column(String(10), nullable=True)
    status = Column(String(20), default="PENDING")
    # PENDING, ACCEPTED, IN_TRANSIT, DELIVERED, CANCELLED
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    from sqlalchemy.orm import relationship
    buyer = relationship("Buyer", back_populates="orders")
