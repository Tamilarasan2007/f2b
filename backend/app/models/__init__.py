# Import all models so Alembic and Base.metadata can discover them
from app.models.user import User
from app.models.farmer import Farmer, Farm
from app.models.buyer import Buyer
from app.models.vehicle import Driver, Vehicle, VehicleLocation
from app.models.collection_point import CollectionPoint
from app.models.pickup import PickupRequest
from app.models.order import Order
from app.models.route import Route, RouteStop
from app.models.notification import Notification

__all__ = [
    "User",
    "Farmer",
    "Farm",
    "Buyer",
    "Driver",
    "Vehicle",
    "VehicleLocation",
    "CollectionPoint",
    "PickupRequest",
    "Order",
    "Route",
    "RouteStop",
    "Notification",
]
