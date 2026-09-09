import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_and_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        assert res.json() == {"status": "healthy"}

        root_res = await client.get("/")
        assert root_res.status_code == 200
        data = root_res.json()
        assert data["name"] == "F2B — Farmer to Buyer"


@pytest.mark.asyncio
async def test_login_and_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Test farmer login via phone number
        res = await client.post("/api/auth/login", json={
            "email": "9876543210",
            "password": "password123"
        })
        assert res.status_code == 200
        token_data = res.json()
        assert "access_token" in token_data
        assert token_data["user"]["role"] == "FARMER"

        token = token_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test authenticated /me
        me_res = await client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200
        assert me_res.json()["phone"] == "9876543210"


@pytest.mark.asyncio
async def test_admin_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/auth/login", json={
            "email": "admin@f2b.com",
            "password": "admin123"
        })
        assert res.status_code == 200
        assert res.json()["user"]["role"] == "ADMIN"
