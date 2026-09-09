"""
Cost Calculation Service

Calculates estimated transportation costs:
- Fuel cost = (distance / mileage) * fuel_price
- Driver cost = distance * driver_rate
- Loading/unloading cost = flat rate
- Total = fuel + driver + loading

All values configurable via settings.
"""

from app.core.config import get_settings

settings = get_settings()


def calculate_transportation_cost(
    distance_km: float,
    vehicle_mileage_km_per_liter: float = 10.0,
    fuel_price_per_liter: float = None,
    driver_cost_per_km: float = None,
    loading_cost: float = None,
) -> dict:
    """
    Calculate estimated transportation cost.

    Returns dict with fuel_cost, driver_cost, loading_cost, total_cost (all in ₹).
    """
    fuel_price = fuel_price_per_liter or settings.FUEL_PRICE_PER_LITER
    driver_rate = driver_cost_per_km or settings.DEFAULT_DRIVER_COST_PER_KM
    load_cost = loading_cost or settings.DEFAULT_LOADING_COST

    fuel_consumption = distance_km / max(vehicle_mileage_km_per_liter, 1)
    fuel_cost = round(fuel_consumption * fuel_price, 2)
    d_cost = round(distance_km * driver_rate, 2)
    total = round(fuel_cost + d_cost + load_cost, 2)

    return {
        "fuel_cost": fuel_cost,
        "driver_cost": d_cost,
        "loading_cost": load_cost,
        "total_cost": total,
    }
