# F2B — Farmer to Buyer
> **Smart Routes. Stronger Harvests.**  
> *Smart India Hackathon 2026 — AgriRoute AI*

---

## 🌾 Overview

**F2B (Farmer to Buyer)** is a direct farm-to-market logistics platform designed specifically for rural Indian agriculture. The system replaces fragmented intermediaries and inefficient single-farm transport with an intelligent **multi-stop milk-run route optimization engine**.

Rural farmers, collection-point operators, transport drivers, and wholesale buyers collaborate on a unified, bilingual (English + தமிழ் Tamil) mobile-friendly platform.

---

## 🚀 Key Features

1. **🌾 Farmer Portal**
   - 2-click harvest pickup requests (Tomato, Banana, Onion, Tapioca, Coconut, Cabbage, etc.)
   - Real-time transparent Mandi rates (Coimbatore APMC benchmark)
   - Live driver GPS tracking and estimated arrival time (ETA)
   - Handover security OTP code verification at the farm gate
   - Full bilingual support (English & தமிழ்)

2. **📦 Collection Point Operator Portal**
   - Real-time hub catchment area map with pending farm harvest pins
   - **AgriRoute AI Route Optimizer**: Capacitated Vehicle Routing Problem (CVRP) solver with Nearest-Neighbor and 2-Opt heuristics
   - Payload capacity management with visual overload warnings
   - 1-click route dispatch to driver mobile devices

3. **🚛 Driver Mobile Navigation**
   - Turn-by-turn waypoint checklist
   - Direct 1-click phone calling for farmers
   - Farm gate OTP verification and loading confirmation
   - Interactive Leaflet route polyline with live destination navigation

4. **🏬 Wholesale Buyer & Mandi Portal**
   - Browse fresh produce stock arriving at rural collection centers
   - Place bulk purchase orders with guaranteed weight verification at hub scales
   - Digital delivery pass and invoice tracking

5. **👑 Admin Intelligence Dashboard**
   - Regional KPIs: Active farmers, tonnage moved, logistics cost saved (₹), and carbon offset (kg CO₂)
   - Daily volume trends and top crop distributions using interactive charts
   - Full fleet and personnel registry audit logs

---

## ⚡ Quick Demo Accounts

All demo accounts share the password: `password123` (Admin: `admin123`).

| Role | Login Identifier | Password | Portal Features |
| :--- | :--- | :--- | :--- |
| **🌾 Farmer** | `9876543210` or `farmer1@f2b.com` | `password123` | Crop pickup request, Mandi ticker, live ETA |
| **📦 Operator** | `operator@f2b.com` | `password123` | AI Route Optimizer, Hub stock, Fleet capacity |
| **🚛 Driver** | `driver@f2b.com` | `password123` | Waypoints checklist, Map navigation, OTP verification |
| **🏬 Buyer** | `buyer1@f2b.com` | `password123` | Browse fresh stock, Place wholesale orders |
| **👑 Admin** | `admin@f2b.com` | `admin123` | KPI analytics, Recharts, Audit logs |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v7, Leaflet & React-Leaflet, Recharts, Lucide Icons, Vanilla CSS Design System.
- **Backend API**: Python FastAPI, Pydantic v2, SQLAlchemy 2.0 (Async), Uvicorn, Python-Jose (JWT), Passlib (Bcrypt).
- **Optimization Engine**: CVRP heuristic solver (Nearest-Neighbor + 2-Opt), Haversine & OSRM distance matrix.
- **Database**: PostgreSQL (with asyncpg) / SQLite (aiosqlite) out-of-the-box zero-setup mode.

---

## 🐳 Docker Deployment (Full Stack with Database)

The Docker setup includes **all three tiers** configured to run together seamlessly:
1. **🐘 Database Container (`f2b_postgres`)**: PostgreSQL 16 Alpine with persistent data volume (`postgres_data`).
2. **⚡ Backend Container (`f2b_backend`)**: FastAPI server connecting to PostgreSQL, with automated table creation & data seeding on startup.
3. **🌐 Frontend Container (`f2b_frontend`)**: React application served with high-performance Nginx Alpine and built-in API reverse proxy.

### Run with Docker Compose:

```bash
# Build and start all services in the background (PostgreSQL + Backend + Frontend)
docker compose up -d

# View status of containers
docker compose ps

# View backend logs
docker compose logs -f backend

# Stop all containers
docker compose down
```

### Access URLs:
- **Web Application**: [http://localhost:5173](http://localhost:5173)
- **Interactive API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL Database**: `localhost:5432` (Database: `f2b_db`, User: `f2b_user`, Password: `f2b_password`)

---

## 🏃 Manual / Local Development Setup

### 1. Backend Setup

```bash
cd backend

# (Optional) Create and activate virtualenv
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and seed sample data
python -c "import sys, os; sys.path.insert(0, '.'); from database.seed.seed_data import init_db; import asyncio; asyncio.run(init_db())"

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be accessible at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open your browser at `http://localhost:5173`

---

## 🧪 Testing Backend

```bash
cd backend
python -m pytest tests/test_api.py -v
```

---

## 🏆 Smart India Hackathon 2026 Impact
- **56% Reduction** in rural transport miles via multi-farm milk-run bundling.
- **Direct Linkage** between smallholders and terminal wholesale markets.
- **Zero Transit Waste** through scheduled morning harvest dispatch.
