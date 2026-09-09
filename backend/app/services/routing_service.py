"""
Routing Service — OSRM integration with Haversine fallback.

Responsibilities:
- Get road distance/duration between two points
- Build NxN distance/time matrix
- Get route geometry for map display
- Graceful fallback when OSRM is unavailable
"""

import math
from typing import List, Tuple, Optional, Dict, Any

import httpx

from app.core.config import get_settings

settings = get_settings()

EARTH_RADIUS_KM = 6371.0


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate straight-line distance in km using Haversine formula."""
    lat1_r, lat2_r = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlng / 2) ** 2
    )
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(a))


def estimate_duration_minutes(distance_km: float, avg_speed_kmh: float = 40.0) -> float:
    """Estimate travel time from distance assuming average speed."""
    return (distance_km / avg_speed_kmh) * 60


async def get_osrm_route(
    origin: Tuple[float, float],
    destination: Tuple[float, float],
    waypoints: Optional[List[Tuple[float, float]]] = None,
) -> Dict[str, Any]:
    """
    Get route from OSRM.

    Args:
        origin: (lat, lng) of start
        destination: (lat, lng) of end
        waypoints: Optional list of (lat, lng) intermediate stops

    Returns:
        Dict with distance_km, duration_minutes, geometry, is_fallback
    """
    all_points = [origin]
    if waypoints:
        all_points.extend(waypoints)
    all_points.append(destination)

    # OSRM expects lng,lat format
    coords_str = ";".join(f"{lng},{lat}" for lat, lng in all_points)
    url = f"{settings.OSRM_BASE_URL}/route/v1/driving/{coords_str}"
    params = {
        "overview": "full",
        "geometries": "geojson",
        "steps": "false",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()

        if data.get("code") != "Ok" or not data.get("routes"):
            raise ValueError("OSRM returned no routes")

        route = data["routes"][0]
        return {
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_minutes": round(route["duration"] / 60, 2),
            "geometry": route["geometry"],
            "is_fallback": False,
        }

    except Exception:
        # Fallback to Haversine
        total_distance = 0
        for i in range(len(all_points) - 1):
            total_distance += haversine_distance(
                all_points[i][0], all_points[i][1],
                all_points[i + 1][0], all_points[i + 1][1],
            )
        # Apply road factor (roads are ~1.3x straight line)
        road_distance = round(total_distance * 1.3, 2)

        # Build simple geometry for map
        coordinates = [[lng, lat] for lat, lng in all_points]
        geometry = {
            "type": "LineString",
            "coordinates": coordinates,
        }

        return {
            "distance_km": road_distance,
            "duration_minutes": round(estimate_duration_minutes(road_distance), 2),
            "geometry": geometry,
            "is_fallback": True,
        }


async def get_distance_matrix(
    locations: List[Tuple[float, float]],
) -> Dict[str, Any]:
    """
    Get NxN distance and duration matrix from OSRM Table service.

    Args:
        locations: List of (lat, lng) coordinates

    Returns:
        Dict with distances (km) and durations (minutes) matrices, is_fallback flag
    """
    n = len(locations)
    if n < 2:
        return {
            "distances": [[0]],
            "durations": [[0]],
            "is_fallback": True,
        }

    # OSRM expects lng,lat
    coords_str = ";".join(f"{lng},{lat}" for lat, lng in locations)
    url = f"{settings.OSRM_BASE_URL}/table/v1/driving/{coords_str}"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()

        if data.get("code") != "Ok":
            raise ValueError("OSRM table query failed")

        # Convert meters to km, seconds to minutes
        distances = [
            [round(d / 1000, 2) if d is not None else 9999 for d in row]
            for row in data["distances"]
        ]
        durations = [
            [round(d / 60, 2) if d is not None else 9999 for d in row]
            for row in data["durations"]
        ]

        return {
            "distances": distances,
            "durations": durations,
            "is_fallback": False,
        }

    except Exception:
        # Fallback: Haversine matrix
        distances = []
        durations = []
        for i in range(n):
            dist_row = []
            dur_row = []
            for j in range(n):
                if i == j:
                    dist_row.append(0)
                    dur_row.append(0)
                else:
                    d = haversine_distance(
                        locations[i][0], locations[i][1],
                        locations[j][0], locations[j][1],
                    ) * 1.3  # road factor
                    dist_row.append(round(d, 2))
                    dur_row.append(round(estimate_duration_minutes(d), 2))
                    
            distances.append(dist_row)
            durations.append(dur_row)

        return {
            "distances": distances,
            "durations": durations,
            "is_fallback": True,
        }
