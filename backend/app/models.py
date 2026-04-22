from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    preparing = "preparing"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"


class CartItem(BaseModel):
    menu_item_id: int
    name: str
    price: float
    quantity: int
    veg: bool


class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    payment_method: str = "cod"  # cod | upi_on_delivery
    items: List[CartItem]
    total: float


class OrderOut(BaseModel):
    order_id: str
    customer_name: str
    phone: str
    address: str
    payment_method: str
    items: List[CartItem]
    total: float
    status: OrderStatus = OrderStatus.pending
    created_at: datetime

    model_config = {"use_enum_values": True}


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class ContactCreate(BaseModel):
    name: str
    email: str
    message: str


class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime
