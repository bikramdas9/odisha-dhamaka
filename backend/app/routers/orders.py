from fastapi import APIRouter, Depends, HTTPException
from ..database import get_db
from ..models import OrderCreate, OrderStatusUpdate
from datetime import datetime, timezone
import random
import string

router = APIRouter(prefix="/api/orders", tags=["orders"])


def generate_order_id():
    today = datetime.now(timezone.utc).strftime("%y%m%d")
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"OD-{today}-{suffix}"


@router.post("", status_code=201)
async def create_order(payload: OrderCreate, db=Depends(get_db)):
    order = payload.model_dump()
    order["order_id"] = generate_order_id()
    order["status"] = "pending"
    order["created_at"] = datetime.now(timezone.utc)
    await db.orders.insert_one(order)
    order.pop("_id", None)
    return order


@router.get("")
async def list_orders(db=Depends(get_db)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return orders


@router.get("/{order_id}")
async def get_order(order_id: str, db=Depends(get_db)):
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    return order


@router.patch("/{order_id}/status")
async def update_status(order_id: str, payload: OrderStatusUpdate, db=Depends(get_db)):
    result = await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": payload.status.value}}
    )
    if result.matched_count == 0:
        raise HTTPException(404, "Order not found")
    return {"order_id": order_id, "status": payload.status.value}
