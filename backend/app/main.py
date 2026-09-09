from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import auth, farmers, pickups, vehicles, buyers, routes, dashboard

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically initialize tables and seed data if database is connected
    try:
        from app.database.seed_data import init_db
        await init_db()
    except Exception as e:
        print(f"[!] Database init notice: {e}")
    yield


app = FastAPI(
    title="F2B — Farmer to Buyer",
    description="Smart Routes. Stronger Harvests. — AgriRoute AI for SIH 2026",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(farmers.router)
app.include_router(pickups.router)
app.include_router(vehicles.router)
app.include_router(buyers.router)
app.include_router(routes.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {
        "name": "F2B — Farmer to Buyer",
        "tagline": "Smart Routes. Stronger Harvests.",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
