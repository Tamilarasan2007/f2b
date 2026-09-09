from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class Driver(Base, TimestampMixin):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    license_number = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)
    is_available = Column(Boolean, default=True)

    user = relationship("User", backref="driver_profile")


class Vehicle(Base, TimestampMixin):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String(20), unique=True, nullable=False)
    vehicle_type = Column(String(50), nullable=False)  # Mini Truck, Pickup, Truck
    capacity_kg = Column(Float, nullable=False)
    fuel_type = Column(String(20), default="Diesel")
    mileage_km_per_liter = Column(Float, default=10.0)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    is_available = Column(Boolean, default=True)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)

    driver = relationship("Driver", backref="vehicle")

    __table_args__ = (
        Index("ix_vehicles_available", "is_available"),
    )


class VehicleLocation(Base):
    __tablename__ = "vehicle_locations"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(String(50), nullable=False)

    vehicle = relationship("Vehicle", backref="locations")
