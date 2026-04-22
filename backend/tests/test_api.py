import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timezone

pytestmark = pytest.mark.asyncio


# ── helpers ──────────────────────────────────────────────────────────────────

SAMPLE_ITEMS = [
    {"id": 1, "name": "Dalma", "category": "curry", "price": 149, "veg": True,
     "desc": "Lentil curry", "emoji": "🍲", "bestseller": True},
    {"id": 2, "name": "Macha Besara", "category": "curry", "price": 219, "veg": False,
     "desc": "Fish curry", "emoji": "🐟", "bestseller": True},
]

SAMPLE_ORDER_PAYLOAD = {
    "customer_name": "Rabi Panda",
    "phone": "9876543210",
    "address": "Patia, Bhubaneswar",
    "payment_method": "cod",
    "items": [
        {"menu_item_id": 1, "name": "Dalma", "price": 149, "quantity": 2, "veg": True}
    ],
    "total": 298.0,
}

SAVED_ORDER = {
    **SAMPLE_ORDER_PAYLOAD,
    "order_id": "OD-260422-ABCDE",
    "status": "pending",
    "created_at": datetime.now(timezone.utc),
}


# ── health ────────────────────────────────────────────────────────────────────

async def test_health(client):
    ac, _ = client
    r = await ac.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


# ── menu ──────────────────────────────────────────────────────────────────────

async def test_get_menu_returns_list(client):
    ac, db = client
    cursor = MagicMock()
    cursor.to_list = AsyncMock(return_value=SAMPLE_ITEMS)
    db.menu_items.find = MagicMock(return_value=cursor)

    r = await ac.get("/api/menu")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


async def test_get_menu_empty(client):
    ac, db = client
    cursor = MagicMock()
    cursor.to_list = AsyncMock(return_value=[])
    db.menu_items.find = MagicMock(return_value=cursor)

    r = await ac.get("/api/menu")
    assert r.status_code == 200
    assert r.json() == []


async def test_get_bestsellers(client):
    ac, db = client
    bestsellers = [i for i in SAMPLE_ITEMS if i["bestseller"]]
    cursor = MagicMock()
    cursor.to_list = AsyncMock(return_value=bestsellers)
    db.menu_items.find = MagicMock(return_value=cursor)

    r = await ac.get("/api/menu/bestsellers")
    assert r.status_code == 200
    data = r.json()
    assert all(item["bestseller"] for item in data)


async def test_menu_item_has_required_fields(client):
    ac, db = client
    cursor = MagicMock()
    cursor.to_list = AsyncMock(return_value=SAMPLE_ITEMS)
    db.menu_items.find = MagicMock(return_value=cursor)

    r = await ac.get("/api/menu")
    items = r.json()
    if items:
        for field in ("id", "name", "price", "veg", "category"):
            assert field in items[0]


# ── orders ────────────────────────────────────────────────────────────────────

async def test_create_order(client):
    ac, db = client
    db.orders.insert_one = AsyncMock(return_value=MagicMock(inserted_id="xyz"))

    r = await ac.post("/api/orders", json=SAMPLE_ORDER_PAYLOAD)
    assert r.status_code == 201
    data = r.json()
    assert data["order_id"].startswith("OD-")
    assert data["status"] == "pending"
    assert data["customer_name"] == "Rabi Panda"


async def test_order_id_format(client):
    ac, db = client
    db.orders.insert_one = AsyncMock(return_value=MagicMock(inserted_id="xyz"))

    r = await ac.post("/api/orders", json=SAMPLE_ORDER_PAYLOAD)
    order_id = r.json()["order_id"]
    parts = order_id.split("-")
    assert len(parts) == 3
    assert parts[0] == "OD"
    assert len(parts[1]) == 6   # YYMMDD
    assert len(parts[2]) == 5   # random suffix


async def test_create_order_missing_fields(client):
    ac, _ = client
    r = await ac.post("/api/orders", json={"customer_name": "X"})
    assert r.status_code == 422


async def test_list_orders(client):
    ac, db = client
    cursor = MagicMock()
    cursor.sort = MagicMock(return_value=cursor)
    cursor.to_list = AsyncMock(return_value=[SAVED_ORDER])
    db.orders.find = MagicMock(return_value=cursor)

    r = await ac.get("/api/orders")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


async def test_get_order_not_found(client):
    ac, db = client
    db.orders.find_one = AsyncMock(return_value=None)

    r = await ac.get("/api/orders/OD-999999-XXXXX")
    assert r.status_code == 404


async def test_get_order_found(client):
    ac, db = client
    saved = {**SAVED_ORDER, "created_at": SAVED_ORDER["created_at"].isoformat()}
    db.orders.find_one = AsyncMock(return_value=saved)

    r = await ac.get("/api/orders/OD-260422-ABCDE")
    assert r.status_code == 200
    assert r.json()["order_id"] == "OD-260422-ABCDE"


async def test_update_order_status(client):
    ac, db = client
    db.orders.update_one = AsyncMock(return_value=MagicMock(matched_count=1))

    r = await ac.patch("/api/orders/OD-260422-ABCDE/status", json={"status": "confirmed"})
    assert r.status_code == 200
    assert r.json()["status"] == "confirmed"


async def test_update_order_status_not_found(client):
    ac, db = client
    db.orders.update_one = AsyncMock(return_value=MagicMock(matched_count=0))

    r = await ac.patch("/api/orders/OD-NOPE-XXXXX/status", json={"status": "confirmed"})
    assert r.status_code == 404


async def test_update_order_invalid_status(client):
    ac, _ = client
    r = await ac.patch("/api/orders/OD-260422-ABCDE/status", json={"status": "flying"})
    assert r.status_code == 422


# ── contact ───────────────────────────────────────────────────────────────────

async def test_submit_contact(client):
    ac, db = client
    from bson import ObjectId
    db.contacts.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId()))

    payload = {"name": "Priya", "email": "priya@example.com", "message": "Love the food!"}
    r = await ac.post("/api/contact", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data["name"] == "Priya"
    assert "id" in data


async def test_submit_contact_missing_email(client):
    ac, _ = client
    r = await ac.post("/api/contact", json={"name": "X", "message": "Hi"})
    assert r.status_code == 422


async def test_submit_contact_missing_message(client):
    ac, _ = client
    r = await ac.post("/api/contact", json={"name": "X", "email": "x@x.com"})
    assert r.status_code == 422
