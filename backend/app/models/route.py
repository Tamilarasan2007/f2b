from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class Route(Base, TimestampMixin):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    collection_point_id = Column(Integer, ForeignKey("collection_points.id"), nullable=True)
    destination_name = Column(String(255), nullable=True)
    destination_lat = Column(Float, nullable=True)
    destination_lng = Column(Float, nullable=True)
    total_distance_km = Column(Float, nullable=True)
    estimated_duration_minutes = Column(Float, nullable=True)
    total_load_kg = Column(Float, nullable=True)
    vehicle_capacity_kg = Column(Float, nullable=True)
    estimated_cost = Column(Float, nullable=True)
    fuel_cost = Column(Float, nullable=True)
    driver_cost = Column(Float, nullable=True)
    other_cost = Column(Float, nullable=True)
    route_geometry = Column(JSON, nullable=True)  # GeoJSON polyline
    status = Column(String(20), default="PLANNED")
    # PLANNED, STARTED, IN_PROGRESS, COMPLETED, CANCELLED
    is_fallback_route = Column(String(5), default="false")
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    stops = relationship("RouteStop", back_populates="route", order_by="RouteStop.sequence")
    vehicle = relationship("Vehicle", backref="routes")
    driver = relationship("Driver", backref="routes")

    __table_args__ = (
        Index("ix_route_status", "status"),
        Index("ix_route_driver", "driver_id"),
        Index("ix_route_vehicle", "vehicle_id"),
    )


class RouteStop(Base, TimestampMixin):
    __tablename__ = "route_stops"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    pickup_request_id = Column(Integer, ForeignKey("pickup_requests.id"), nullable=True)
    sequence = Column(Integer, nullable=False)
    stop_type = Column(String(20), nullable=False)  # pickup, delivery
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    quantity_kg = Column(Float, nullable=True)
    crop_name = Column(String(100), nullable=True)
    farmer_name = Column(String(255), nullable=True)
    status = Column(String(20), default="PENDING")
    # PENDING, ARRIVED, COMPLETED
    arrived_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    route = relationship("Route", back_populates="stops")
