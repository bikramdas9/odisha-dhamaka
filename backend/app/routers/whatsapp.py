from fastapi import APIRouter, Request, Depends, Response
from fastapi.responses import PlainTextResponse
from ..database import get_db
from ..seed import MENU_ITEMS
from ..routers.orders import generate_order_id
from datetime import datetime, timezone

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

# ── Menu helpers ──────────────────────────────────────────────────────────────

def menu_text():
    lines = ["🍛 *Odisha Dhamaka Menu*\n"]
    for item in MENU_ITEMS:
        badge = "🟢" if item["veg"] else "🔴"
        lines.append(f"{item['id']}. {badge} {item['emoji']} *{item['name']}* — ₹{item['price']}")
        lines.append(f"   _{item['desc']}_\n")
    lines.append("Reply with item numbers separated by commas.\nExample: *1, 3, 6*")
    return "\n".join(lines)


def cart_text(cart):
    lines = ["🛒 *Your Cart:*"]
    total = 0
    for entry in cart:
        subtotal = entry["price"] * entry["qty"]
        total += subtotal
        lines.append(f"• {entry['name']} × {entry['qty']} = ₹{subtotal}")
    lines.append(f"\n💰 *Total: ₹{total}*")
    return "\n".join(lines), total


# ── Session state helpers ─────────────────────────────────────────────────────

async def get_session(db, phone: str):
    return await db.whatsapp_sessions.find_one({"phone": phone})


async def set_session(db, phone: str, data: dict):
    await db.whatsapp_sessions.update_one(
        {"phone": phone},
        {"$set": {**data, "phone": phone, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )


async def clear_session(db, phone: str):
    await db.whatsapp_sessions.delete_one({"phone": phone})


# ── Webhook ───────────────────────────────────────────────────────────────────

@router.post("/webhook")
async def whatsapp_webhook(request: Request, db=Depends(get_db)):
    form = await request.form()
    incoming = (form.get("Body") or "").strip()
    phone = (form.get("From") or "").replace("whatsapp:", "")
    msg_lower = incoming.lower()

    session = await get_session(db, phone) or {}
    step = session.get("step", "start")

    reply = await handle_message(db, phone, incoming, msg_lower, step, session)

    # Twilio expects TwiML XML response
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply}</Message>
</Response>"""
    return Response(content=twiml, media_type="application/xml")


async def handle_message(db, phone, incoming, msg_lower, step, session):

    # ── Always allow reset ────────────────────────────────────────────────────
    if msg_lower in ("hi", "hello", "start", "menu", "restart", "helo", "hey"):
        await set_session(db, phone, {"step": "menu", "cart": []})
        return (
            "👋 *Welcome to Odisha Dhamaka!*\n"
            "Authentic Odia cloud kitchen 🍛\n\n"
            + menu_text()
        )

    # ── Step: choosing items ──────────────────────────────────────────────────
    if step == "menu":
        ids = [x.strip() for x in incoming.replace("،", ",").split(",")]
        valid_ids = {str(i["id"]) for i in MENU_ITEMS}
        chosen = []
        errors = []
        for raw in ids:
            if raw in valid_ids:
                item = next(i for i in MENU_ITEMS if str(i["id"]) == raw)
                # merge duplicates
                existing = next((c for c in chosen if c["id"] == item["id"]), None)
                if existing:
                    existing["qty"] += 1
                else:
                    chosen.append({"id": item["id"], "name": item["name"],
                                   "price": item["price"], "veg": item["veg"], "qty": 1})
            else:
                errors.append(raw)

        if not chosen:
            return (
                "❌ I didn't recognise those numbers.\n\n"
                + menu_text()
            )

        cart_summary, total = cart_text(chosen)
        await set_session(db, phone, {"step": "ask_name", "cart": chosen, "total": total})

        error_note = ""
        if errors:
            error_note = f"\n\n⚠️ Skipped unrecognised items: {', '.join(errors)}"

        return (
            f"{cart_summary}{error_note}\n\n"
            "Looks good? 😊\n"
            "Please reply with your *full name*:"
        )

    # ── Step: ask name ────────────────────────────────────────────────────────
    if step == "ask_name":
        if len(incoming) < 2:
            return "Please enter your full name:"
        await set_session(db, phone, {**session, "step": "ask_address", "name": incoming})
        return f"Thanks, *{incoming}*! 🙏\n\nNow please share your *delivery address*\n(include area & city):"

    # ── Step: ask address ─────────────────────────────────────────────────────
    if step == "ask_address":
        if len(incoming) < 5:
            return "Please enter a complete delivery address:"
        await set_session(db, phone, {**session, "step": "ask_payment", "address": incoming})
        return (
            "Choose payment method:\n\n"
            "1️⃣ *COD* — Cash on Delivery\n"
            "2️⃣ *UPI* — UPI on Delivery\n\n"
            "Reply *1* or *2*"
        )

    # ── Step: ask payment ─────────────────────────────────────────────────────
    if step == "ask_payment":
        if incoming in ("1", "cod", "cash"):
            payment = "cod"
        elif incoming in ("2", "upi"):
            payment = "upi_on_delivery"
        else:
            return "Please reply *1* for Cash on Delivery or *2* for UPI on Delivery:"

        await set_session(db, phone, {**session, "step": "confirm", "payment": payment})

        cart_summary, _ = cart_text(session.get("cart", []))
        payment_label = "Cash on Delivery" if payment == "cod" else "UPI on Delivery"
        return (
            f"📋 *Order Summary*\n\n"
            f"{cart_summary}\n\n"
            f"👤 Name: {session.get('name')}\n"
            f"📍 Address: {session.get('address')}\n"
            f"💳 Payment: {payment_label}\n\n"
            "Reply *YES* to confirm or *NO* to cancel."
        )

    # ── Step: confirm ─────────────────────────────────────────────────────────
    if step == "confirm":
        if msg_lower in ("yes", "y", "confirm", "ok", "okay", "haan", "ha"):
            cart = session.get("cart", [])
            total = session.get("total", 0)
            order = {
                "order_id": generate_order_id(),
                "customer_name": session.get("name"),
                "phone": phone,
                "address": session.get("address"),
                "payment_method": session.get("payment", "cod"),
                "items": [
                    {
                        "menu_item_id": c["id"],
                        "name": c["name"],
                        "price": c["price"],
                        "quantity": c["qty"],
                        "veg": c["veg"],
                    }
                    for c in cart
                ],
                "total": total,
                "status": "pending",
                "source": "whatsapp",
                "created_at": datetime.now(timezone.utc),
            }
            await db.orders.insert_one(order)
            await clear_session(db, phone)

            return (
                f"✅ *Order Confirmed!*\n\n"
                f"🆔 Order ID: *{order['order_id']}*\n"
                f"🛵 Expected delivery: *30–45 minutes*\n\n"
                f"We'll call you on {phone} if needed.\n\n"
                f"Type *menu* anytime to order again!\n"
                f"📱 Track your order: https://odisha-dhamaka.vercel.app"
            )

        elif msg_lower in ("no", "n", "cancel", "nahi"):
            await clear_session(db, phone)
            return "❌ Order cancelled.\n\nType *menu* to start a new order."

        else:
            cart_summary, _ = cart_text(session.get("cart", []))
            return f"Please reply *YES* to confirm or *NO* to cancel.\n\n{cart_summary}"

    # ── Fallback ──────────────────────────────────────────────────────────────
    return (
        "👋 Type *menu* to see our menu and place an order!\n\n"
        "Odisha Dhamaka — Authentic Odia Cloud Kitchen 🍛"
    )
