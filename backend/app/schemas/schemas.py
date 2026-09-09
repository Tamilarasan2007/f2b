from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ── Roles ──
VALID_ROLES = ["FARMER", "DRIVER", "BUYER", "COLLECTION_POINT_OPERATOR", "ADMIN"]


# ── Auth ──
class UserRegister(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=4)
    full_name: str = Field(..., min_length=1)
    phone: Optional[str] = None
    role: str = Field(..., description="One of: FARMER, DRIVER, BUYER, COLLECTION_POINT_OPERATOR, ADMIN")


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Farmer ──
class FarmerCreate(BaseModel):
    farm_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class FarmerOut(BaseModel):
    id: int
    user_id: int
    farm_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ── Farm ──
class FarmCreate(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_acres: Optional[float] = None


class FarmOut(BaseModel):
    id: int
    farmer_id: int
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area_acres: Optional[float] = None

    class Config:
        from_attributes = True


# ── Pickup Request ──
class PickupRequestCreate(BaseModel):
    crop_name: str = Field(..., min_length=1)
    quantity_kg: float = Field(..., gt=0)
    unit: str = "kg"
    harvest_date: Optional[date] = None
    preferred_pickup_date: Optional[date] = None
    preferred_pickup_time_start: Optional[str] = None
    preferred_pickup_time_end: Optional[str] = None
    notes: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_id: Optional[int] = None


class PickupRequestUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class PickupRequestOut(BaseModel):
    id: int
    farmer_id: int
    farm_id: Optional[int] = None
    crop_name: str
    quantity_kg: float
    unit: str
    harvest_date: Optional[date] = None
    preferred_pickup_date: Optional[date] = None
    preferred_pickup_time_start: Optional[str] = None
    preferred_pickup_time_end: Optional[str] = None
    notes: Optional[str] = None
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Driver ──
class DriverCreate(BaseModel):
    license_number: Optional[str] = None
    phone: Optional[str] = None


class DriverOut(BaseModel):
    id: int
    user_id: int
    license_number: Optional[str] = None
    phone: Optional[str] = None
    is_available: bool
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ── Vehicle ──
class VehicleCreate(BaseModel):
    vehicle_number: str
    vehicle_type: str
    capacity_kg: float = Field(..., gt=0)
    fuel_type: str = "Diesel"
    mileage_km_per_liter: float = 10.0
    driver_id: Optional[int] = None
    is_available: bool = True
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None


class VehicleUpdate(BaseModel):
    vehicle_type: Optional[str] = None
    capacity_kg: Optional[float] = None
    fuel_type: Optional[str] = None
    mileage_km_per_liter: Optional[float] = None
    driver_id: Optional[int] = None
    is_available: Optional[bool] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None


class VehicleOut(BaseModel):
    id: int
    vehicle_number: str
    vehicle_type: str
    capacity_kg: float
    fuel_type: str
    mileage_km_per_liter: float
    driver_id: Optional[int] = None
    is_available: bool
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    driver: Optional[DriverOut] = None

    class Config:
        from_attributes = True


# ── Buyer ──
class BuyerCreate(BaseModel):
    business_name: Optional[str] = None
    market_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class BuyerOut(BaseModel):
    id: int
    user_id: int
    business_name: Optional[str] = None
    market_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ── Order ──
class OrderCreate(BaseModel):
    crop_name: str
    required_quantity_kg: float = Field(..., gt=0)
    delivery_location: Optional[str] = None
    required_delivery_date: Optional[date] = None
    delivery_time_start: Optional[str] = None
    delivery_time_end: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class OrderOut(BaseModel):
    id: int
    buyer_id: int
    crop_name: str
    required_quantity_kg: float
    delivery_location: Optional[str] = None
    required_delivery_date: Optional[date] = None
    delivery_time_start: Optional[str] = None
    delivery_time_end: Optional[str] = None
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Collection Point ──
class CollectionPointCreate(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CollectionPointOut(BaseModel):
    id: int
    name: str
    operator_user_id: Optional[int] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True


# ── Route ──
class RouteStopOut(BaseModel):
    id: int
    sequence: int
    stop_type: str
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    quantity_kg: Optional[float] = None
    crop_name: Optional[str] = None
    farmer_name: Optional[str] = None
    status: str
    pickup_request_id: Optional[int] = None
    arrived_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RouteOut(BaseModel):
    id: int
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    destination_name: Optional[str] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None
    total_distance_km: Optional[float] = None
    estimated_duration_minutes: Optional[float] = None
    total_load_kg: Optional[float] = None
    vehicle_capacity_kg: Optional[float] = None
    estimated_cost: Optional[float] = None
    fuel_cost: Optional[float] = None
    driver_cost: Optional[float] = None
    other_cost: Optional[float] = None
    route_geometry: Optional[dict] = None
    status: str
    is_fallback_route: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    stops: List[RouteStopOut] = []
    vehicle: Optional[VehicleOut] = None
    driver: Optional[DriverOut] = None

    class Config:
        from_attributes = True


class OptimizeRouteRequest(BaseModel):
    pickup_request_ids: List[int] = Field(..., min_length=1)
    vehicle_id: int
    destination_name: str
    destination_lat: float
    destination_lng: float
    driver_id: Optional[int] = None
    collection_point_id: Optional[int] = None


# ── Location Update ──
class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    timestamp: Optional[str] = None


# ── Notification ──
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Dashboard ──
class DashboardStats(BaseModel):
    total_farmers: Optional[int] = 0
    active_vehicles: Optional[int] = 0
    pending_pickups: Optional[int] = 0
    active_routes: Optional[int] = 0
    completed_deliveries: Optional[int] = 0
    total_crop_quantity_kg: Optional[float] = 0
    estimated_cost_saved: Optional[float] = 0
    total_distance_km: Optional[float] = 0
    avg_delivery_time_min: Optional[float] = 0


# ── Generic Response ──
class MessageResponse(BaseModel):
    success: bool = True
    message: str
    error_code: Optional[str] = None
