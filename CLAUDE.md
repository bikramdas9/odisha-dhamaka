# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Full-stack cloud kitchen app: **React + FastAPI + MongoDB**

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Vite, vanilla CSS |
| Backend | FastAPI, Motor (async MongoDB driver), Pydantic v2 |
| Database | MongoDB (auto-seeded on startup) |
| Tests | pytest-asyncio (backend, 17 tests) |

## Running locally

**Backend** (requires MongoDB running on localhost:27017):
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API at http://localhost:8000
```

**Frontend** (fix npm cache if needed: `sudo chown -R 501:20 ~/.npm`):
```bash
cd frontend
npm install
npm run dev
# UI at http://localhost:5173 — proxies /api → :8000
```

**Backend tests:**
```bash
cd backend && source venv/bin/activate
python -m pytest tests/ -v
```

## Architecture

### Backend (`backend/`)

```
app/
  main.py       # FastAPI app, lifespan (connect DB + seed)
  config.py     # Settings via pydantic-settings (.env)
  database.py   # Motor client, get_db() dependency
  models.py     # Pydantic models: OrderCreate, OrderOut, ContactCreate…
  seed.py       # MENU_ITEMS list; seed_menu() inserts if collection empty
  routers/
    menu.py     # GET /api/menu, GET /api/menu/bestsellers
    orders.py   # POST/GET /api/orders, GET /:id, PATCH /:id/status
    contact.py  # POST /api/contact (persists to DB)
```

- Orders use generated IDs: `OD-YYMMDD-XXXXX`
- Payment methods are **mocked** (`cod`, `upi_on_delivery`) — no real gateway
- `OrderStatus` enum: pending → confirmed → preparing → out_for_delivery → delivered | cancelled

### Frontend (`frontend/src/`)

```
context/CartContext.jsx   # useReducer cart (add/remove/updateQty/clear), drawer open state
lib/api.js                # Thin fetch wrapper for all API calls
pages/
  Home.jsx        # Hero + bento categories + bestsellers + story + testimonials
  Menu.jsx        # Search + sticky category tabs + full menu grid
  Checkout.jsx    # Form → POST /api/orders → navigate to success
  OrderSuccess.jsx# Displays order ID (OD-…) + details from GET /api/orders/:id
  About.jsx       # Static brand story
  Contact.jsx     # Form → POST /api/contact, success state
  AdminOrders.jsx # Lists all orders + live status dropdown (PATCH /:id/status)
components/
  Navbar.jsx / CartDrawer.jsx / MenuCard.jsx / Footer.jsx
```

### Design tokens (index.css)

| Variable | Value | Use |
|----------|-------|-----|
| `--terracotta` | `#C1440E` | Primary CTAs, prices, accents |
| `--mustard` | `#D4A017` | Bestseller tags, stars |
| `--ivory` | `#FAF5EE` | Page background |
| `--brown-dark` | `#3D1C02` | Headings |
| Fonts | Fraunces (headings) + Manrope (body) | Google Fonts CDN |

### Testing approach

Backend tests mock the DB via `app.dependency_overrides[get_db]` — no real MongoDB needed.
All test assertions follow real HTTP status codes (201 for create, 404 for not found, 422 for validation).

### data-testid coverage

Every interactive and key display element has `data-testid` for e2e testing readiness.
Pattern: `menu-card-{id}`, `add-to-cart-{id}`, `status-select-{orderId}`, etc.

## Next action items

1. **Real payments** — integrate Razorpay when ready (replace `payment_method` mock)
2. **Admin auth** — gate `/admin/orders` behind Google OAuth (Emergent Auth recommended)
3. **Email confirmations** — send via Resend on order creation
