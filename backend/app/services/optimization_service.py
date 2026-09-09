"""
VRP/CVRP Optimization Engine

Implements a capacity-aware Vehicle Routing Problem solver:
1. Build distance matrix via routing service
2. Apply nearest-neighbor heuristic for initial solution
3. Apply 2-opt improvement
4. Enforce vehicle capacity constraints
5. Return optimized route with stop sequences

Designed to be replaceable — all optimization logic is contained here.
"""

from typing import List, Dict, Any, Tuple, Optional
from app.services.routing_service import get_distance_matrix, get_osrm_route


async def optimize_route(
    pickup_points: List[Dict[str, Any]],
    vehicle_capacity_kg: float,
    destination: Dict[str, Any],
    start_point: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Optimize route for a single vehicle visiting multiple pickup points and
    delivering to a destination.

    Args:
        pickup_points: List of dicts with keys:
            id, latitude, longitude, quantity_kg, crop_name, farmer_name, location_name
        vehicle_capacity_kg: Maximum vehicle capacity in kg
        destination: Dict with latitude, longitude, name
        start_point: Optional starting point (collection point). Defaults to first pickup.

    Returns:
        Dict with optimized_stops, total_distance_km, estimated_duration_minutes,
        total_load_kg, route_geometry, is_fallback
    """
    if not pickup_points:
        return {
            "optimized_stops": [],
            "total_distance_km": 0,
            "estimated_duration_minutes": 0,
            "total_load_kg": 0,
            "route_geometry": None,
            "is_fallback": False,
        }

    # Check total load vs capacity
    total_load = sum(p["quantity_kg"] for p in pickup_points)
    if total_load > vehicle_capacity_kg:
        # Return error info — caller should handle
        return {
            "error": "INSUFFICIENT_CAPACITY",
            "message": f"Total load ({total_load} kg) exceeds vehicle capacity ({vehicle_capacity_kg} kg)",
            "total_load_kg": total_load,
            "vehicle_capacity_kg": vehicle_capacity_kg,
        }

    # Build list of all locations:
    # Index 0 = start (collection point or first pickup)
    # Indices 1..N = pickup points
    # Last index = destination
    locations: List[Tuple[float, float]] = []

    if start_point:
        locations.append((start_point["latitude"], start_point["longitude"]))
    else:
        # Use first pickup as start
        locations.append((pickup_points[0]["latitude"], pickup_points[0]["longitude"]))

    for p in pickup_points:
        locations.append((p["latitude"], p["longitude"]))

    locations.append((destination["latitude"], destination["longitude"]))

    # Get distance matrix
    matrix_result = await get_distance_matrix(locations)
    dist_matrix = matrix_result["distances"]
    dur_matrix = matrix_result["durations"]
    is_fallback = matrix_result["is_fallback"]

    n_pickups = len(pickup_points)
    start_idx = 0
    dest_idx = len(locations) - 1
    pickup_indices = list(range(1, n_pickups + 1))

    # ── Nearest Neighbor Heuristic ──
    ordered_pickups = _nearest_neighbor(pickup_indices, start_idx, dist_matrix)

    # ── 2-opt Improvement ──
    ordered_pickups = _two_opt_improve(ordered_pickups, start_idx, dest_idx, dist_matrix)

    # Build ordered stops
    optimized_stops = []
    seq = 1
    for idx in ordered_pickups:
        p = pickup_points[idx - 1]  # pickup_indices are 1-based
        optimized_stops.append({
            "sequence": seq,
            "stop_type": "pickup",
            "pickup_request_id": p.get("id"),
            "location_name": p.get("location_name", f"Farm {seq}"),
            "latitude": p["latitude"],
            "longitude": p["longitude"],
            "quantity_kg": p["quantity_kg"],
            "crop_name": p.get("crop_name", ""),
            "farmer_name": p.get("farmer_name", ""),
        })
        seq += 1

    # Add destination as final stop
    optimized_stops.append({
        "sequence": seq,
        "stop_type": "delivery",
        "pickup_request_id": None,
        "location_name": destination.get("name", "Market"),
        "latitude": destination["latitude"],
        "longitude": destination["longitude"],
        "quantity_kg": total_load,
        "crop_name": "",
        "farmer_name": "",
    })

    # Calculate total distance and duration along the optimized path
    total_distance = 0
    total_duration = 0
    path = [start_idx] + ordered_pickups + [dest_idx]
    for i in range(len(path) - 1):
        total_distance += dist_matrix[path[i]][path[i + 1]]
        total_duration += dur_matrix[path[i]][path[i + 1]]

    # Get route geometry for the optimized path
    waypoints = [(locations[idx][0], locations[idx][1]) for idx in ordered_pickups]
    route_result = await get_osrm_route(
        origin=locations[start_idx],
        destination=locations[dest_idx],
        waypoints=waypoints if waypoints else None,
    )

    return {
        "optimized_stops": optimized_stops,
        "total_distance_km": round(route_result.get("distance_km", total_distance), 2),
        "estimated_duration_minutes": round(route_result.get("duration_minutes", total_duration), 2),
        "total_load_kg": round(total_load, 2),
        "route_geometry": route_result.get("geometry"),
        "is_fallback": is_fallback or route_result.get("is_fallback", False),
    }


def _nearest_neighbor(
    pickup_indices: List[int],
    start_idx: int,
    dist_matrix: List[List[float]],
) -> List[int]:
    """Nearest-neighbor heuristic to order pickup points."""
    unvisited = set(pickup_indices)
    ordered = []
    current = start_idx

    while unvisited:
        nearest = min(unvisited, key=lambda x: dist_matrix[current][x])
        ordered.append(nearest)
        unvisited.remove(nearest)
        current = nearest

    return ordered


def _two_opt_improve(
    route: List[int],
    start_idx: int,
    dest_idx: int,
    dist_matrix: List[List[float]],
) -> List[int]:
    """2-opt local search improvement."""
    if len(route) < 3:
        return route

    def total_distance(r):
        full = [start_idx] + r + [dest_idx]
        return sum(dist_matrix[full[i]][full[i + 1]] for i in range(len(full) - 1))

    best = route[:]
    best_dist = total_distance(best)
    improved = True

    while improved:
        improved = False
        for i in range(len(best) - 1):
            for j in range(i + 1, len(best)):
                new_route = best[:i] + best[i:j + 1][::-1] + best[j + 1:]
                new_dist = total_distance(new_route)
                if new_dist < best_dist:
                    best = new_route
                    best_dist = new_dist
                    improved = True

    return best
