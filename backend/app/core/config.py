from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://f2b_user:f2b_password@localhost:5432/f2b_db"

    # JWT
    JWT_SECRET: str = "your-super-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours

    # OSRM
    OSRM_BASE_URL: str = "http://router.project-osrm.org"

    # Frontend
    FRONTEND_URL: str = "http://localhost:5173"

    # Cost Configuration
    FUEL_PRICE_PER_LITER: float = 100.0
    DEFAULT_DRIVER_COST_PER_KM: float = 5.0
    DEFAULT_LOADING_COST: float = 200.0

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
