"""
Database initialization and seed script for F2B.
Creates all SQLAlchemy tables and inserts realistic seed data if empty.
"""

import asyncio
from datetime import date, timedelta
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import AsyncSessionLocal, engine
from app.database.base import Base
from app.models import (
    User, Farmer, Farm, Buyer, Driver, Vehicle,
    CollectionPoint, PickupRequest, Order, Notification,
)
from app.core.security import hash_password


async def create_tables():
    """Create all tables from models."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] PostgreSQL Tables created successfully")


async def seed_data():
    """Insert realistic demo data."""
    async with AsyncSessionLocal() as db:
        # Check if data exists
        result = await db.execute(select(User))
        if result.scalar_one_or_none():
            print("[!] Database already seeded, skipping.")
            return

        # ── Users ──
        password = hash_password("password123")
        admin_password = hash_password("admin123")

        admin = User(email="admin@f2b.com", full_name="System Admin", password_hash=admin_password, role="ADMIN", phone="9000000000")
        admin_in = User(email="admin@f2b.in", full_name="Admin", password_hash=password, role="ADMIN", phone="9000000009")
        farmer1_user = User(email="farmer1@f2b.com", full_name="Murugan K (விவசாயி)", password_hash=password, role="FARMER", phone="9876543210")
        farmer2_user = User(email="kumar@f2b.in", full_name="Palanisamy V", password_hash=password, role="FARMER", phone="9876543211")
        farmer3_user = User(email="selvi@f2b.in", full_name="Ramu S", password_hash=password, role="FARMER", phone="9876543212")
        farmer4_user = User(email="meena@f2b.in", full_name="Selvam R", password_hash=password, role="FARMER", phone="9876543213")
        farmer5_user = User(email="murugan@f2b.in", full_name="Karthik N", password_hash=password, role="FARMER", phone="9876543214")
        driver1_user = User(email="driver@f2b.com", full_name="Suresh Kumar", password_hash=password, role="DRIVER", phone="9876543220")
        driver2_user = User(email="driver2@f2b.in", full_name="Muthu Vel", password_hash=password, role="DRIVER", phone="9876543221")
        buyer1_user = User(email="buyer1@f2b.com", full_name="Coimbatore Mandi Traders", password_hash=password, role="BUYER", phone="9876543230")
        buyer2_user = User(email="buyer2@f2b.in", full_name="Nilgiris Wholesale", password_hash=password, role="BUYER", phone="9876543231")
        operator_user = User(email="operator@f2b.com", full_name="Operator Raj", password_hash=password, role="COLLECTION_POINT_OPERATOR", phone="9876543240")

        users = [admin, admin_in, farmer1_user, farmer2_user, farmer3_user, farmer4_user, farmer5_user,
                 driver1_user, driver2_user, buyer1_user, buyer2_user, operator_user]
        db.add_all(users)
        await db.flush()

        # ── Farmers ──
        farmer1 = Farmer(user_id=farmer1_user.id, farm_name="Ravi's Farm", address="Pollachi, Tamil Nadu", latitude=10.6600, longitude=77.0050)
        farmer2 = Farmer(user_id=farmer2_user.id, farm_name="Kumar's Farm", address="Udumalpet, Tamil Nadu", latitude=10.5880, longitude=77.2480)
        farmer3 = Farmer(user_id=farmer3_user.id, farm_name="Selvi's Farm", address="Palladam, Tamil Nadu", latitude=10.9920, longitude=77.2860)
        farmer4 = Farmer(user_id=farmer4_user.id, farm_name="Meena's Farm", address="Tirupur, Tamil Nadu", latitude=11.1085, longitude=77.3411)
        farmer5 = Farmer(user_id=farmer5_user.id, farm_name="Murugan's Farm", address="Dharapuram, Tamil Nadu", latitude=10.7362, longitude=77.5322)

        farmers = [farmer1, farmer2, farmer3, farmer4, farmer5]
        db.add_all(farmers)
        await db.flush()

        # ── Farms ──
        farm1 = Farm(farmer_id=farmer1.id, name="Ravi's Tomato Field", address="Pollachi", latitude=10.6600, longitude=77.0050, area_acres=5)
        farm2 = Farm(farmer_id=farmer2.id, name="Kumar's Onion Field", address="Udumalpet", latitude=10.5880, longitude=77.2480, area_acres=3)
        farm3 = Farm(farmer_id=farmer3.id, name="Selvi's Tomato Field", address="Palladam", latitude=10.9920, longitude=77.2860, area_acres=4)
        farm4 = Farm(farmer_id=farmer4.id, name="Meena's Banana Garden", address="Tirupur", latitude=11.1085, longitude=77.3411, area_acres=6)
        farm5 = Farm(farmer_id=farmer5.id, name="Murugan's Paddy Field", address="Dharapuram", latitude=10.7362, longitude=77.5322, area_acres=8)

        db.add_all([farm1, farm2, farm3, farm4, farm5])
        await db.flush()

        # ── Drivers ──
        driver1 = Driver(user_id=driver1_user.id, license_number="TN3820190001234", phone="9200000001", is_available=True)
        driver2 = Driver(user_id=driver2_user.id, license_number="TN3820200005678", phone="9200000002", is_available=True)
        db.add_all([driver1, driver2])
        await db.flush()

        # ── Vehicles ──
        v1 = Vehicle(vehicle_number="TN38AB1234", vehicle_type="Mini Truck", capacity_kg=2000, fuel_type="Diesel", mileage_km_per_liter=12, driver_id=driver1.id, is_available=True, current_lat=10.9, current_lng=77.1)
        v2 = Vehicle(vehicle_number="TN38CD5678", vehicle_type="Pickup", capacity_kg=1500, fuel_type="Diesel", mileage_km_per_liter=14, driver_id=driver2.id, is_available=True, current_lat=10.8, current_lng=77.2)
        v3 = Vehicle(vehicle_number="TN39EF9012", vehicle_type="Truck", capacity_kg=3000, fuel_type="Diesel", mileage_km_per_liter=8, driver_id=None, is_available=True, current_lat=11.0, current_lng=77.3)
        db.add_all([v1, v2, v3])
        await db.flush()

        # ── Buyers ──
        buyer1 = Buyer(user_id=buyer1_user.id, business_name="Chennai Traders", market_name="Chennai Wholesale Market", address="Chennai", latitude=13.0827, longitude=80.2707)
        buyer2 = Buyer(user_id=buyer2_user.id, business_name="Koyambedu Wholesale", market_name="Koyambedu Market", address="Chennai", latitude=13.0694, longitude=80.1948)
        db.add_all([buyer1, buyer2])
        await db.flush()

        # ── Collection Points ──
        cp1 = CollectionPoint(name="Village Collection Center A", operator_user_id=operator_user.id, address="Pollachi Road", latitude=10.7500, longitude=77.1500)
        cp2 = CollectionPoint(name="Village Collection Center B", operator_user_id=operator_user.id, address="Udumalpet Road", latitude=10.6500, longitude=77.2000)
        cp3 = CollectionPoint(name="FPO Center", operator_user_id=operator_user.id, address="Tirupur", latitude=11.0000, longitude=77.3000)
        db.add_all([cp1, cp2, cp3])
        await db.flush()

        # ── Pickup Requests ──
        tomorrow = date.today() + timedelta(days=1)
        day_after = date.today() + timedelta(days=2)

        pickups = [
            PickupRequest(farmer_id=farmer1.id, farm_id=farm1.id, crop_name="Tomato", quantity_kg=500, unit="kg",
                         harvest_date=date.today(), preferred_pickup_date=tomorrow,
                         preferred_pickup_time_start="08:00", preferred_pickup_time_end="11:00",
                         latitude=10.6600, longitude=77.0050, status="PENDING"),
            PickupRequest(farmer_id=farmer2.id, farm_id=farm2.id, crop_name="Onion", quantity_kg=700, unit="kg",
                         harvest_date=date.today(), preferred_pickup_date=tomorrow,
                         preferred_pickup_time_start="07:00", preferred_pickup_time_end="10:00",
                         latitude=10.5880, longitude=77.2480, status="PENDING"),
            PickupRequest(farmer_id=farmer3.id, farm_id=farm3.id, crop_name="Tomato", quantity_kg=650, unit="kg",
                         harvest_date=date.today(), preferred_pickup_date=tomorrow,
                         preferred_pickup_time_start="09:00", preferred_pickup_time_end="12:00",
                         latitude=10.9920, longitude=77.2860, status="PENDING"),
            PickupRequest(farmer_id=farmer4.id, farm_id=farm4.id, crop_name="Banana", quantity_kg=800, unit="kg",
                         harvest_date=date.today(), preferred_pickup_date=day_after,
                         preferred_pickup_time_start="06:00", preferred_pickup_time_end="09:00",
                         latitude=11.1085, longitude=77.3411, status="PENDING"),
            PickupRequest(farmer_id=farmer5.id, farm_id=farm5.id, crop_name="Paddy", quantity_kg=1200, unit="kg",
                         harvest_date=date.today(), preferred_pickup_date=day_after,
                         preferred_pickup_time_start="08:00", preferred_pickup_time_end="11:00",
                         latitude=10.7362, longitude=77.5322, status="PENDING"),
        ]
        db.add_all(pickups)

        # ── Orders ──
        order1 = Order(buyer_id=buyer1.id, crop_name="Tomato", required_quantity_kg=2000,
                      delivery_location="Chennai Wholesale Market", required_delivery_date=day_after,
                      delivery_time_start="14:00", delivery_time_end="17:00",
                      latitude=13.0827, longitude=80.2707, status="PENDING")
        order2 = Order(buyer_id=buyer2.id, crop_name="Onion", required_quantity_kg=1500,
                      delivery_location="Koyambedu Market", required_delivery_date=day_after,
                      delivery_time_start="13:00", delivery_time_end="16:00",
                      latitude=13.0694, longitude=80.1948, status="PENDING")
        db.add_all([order1, order2])

        await db.commit()
        print("[OK] Database seed data inserted successfully")


async def init_db():
    """Create tables and seed data."""
    await create_tables()
    await seed_data()


if __name__ == "__main__":
    asyncio.run(init_db())
