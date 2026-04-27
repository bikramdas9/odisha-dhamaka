# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Full-stack cloud kitchen: **React 18 + FastAPI + MongoDB**, deployed on Vercel (frontend) + Render (backend) + MongoDB Atlas (DB).

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Vite, vanilla CSS |
| Backend | FastAPI, Motor (async MongoDB), Pydantic v2, python-multipart |
| WhatsApp bot | Twilio sandbox webhook → stateful sessions in MongoDB |
| Tests | pytest-asyncio, 17 backend tests (no real DB needed) |

## Running locally

**Backend** (requires MongoDB on localhost:27017):
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload        # http://localhost:8000
```

**Frontend** (if npm cache error: `sudo chown -R 501:20 ~/.npm`):
```bash
cd frontend
npm install
npm run dev                          # http://localhost:5173 — proxies /api → :8000
```

**Run all backend tests:**
```bash
cd backend && source venv/bin/activate
python -m pytest tests/ -v
```

**Run a single test:**
```bash
python -m pytest tests/test_api.py::test_create_order -v
```

## Backend architecture

```
app/
  main.py        # FastAPI app + lifespan (connect DB → seed menu → shutdown)
  config.py      # Settings via pydantic-settings — reads from .env
  database.py    # Motor client; get_db() is the FastAPI dependency injected into all routers
  models.py      # Pydantic models: OrderCreate, CartItem, OrderStatus enum, ContactCreate
  seed.py        # MENU_ITEMS list (16 dishes); seed_menu() inserts once if collection is empty
  routers/
    menu.py      # GET /api/menu, GET /api/menu/bestsellers
    orders.py    # POST /api/orders (generates OD-YYMMDD-XXXXX), GET list/detail, PATCH status
    contact.py   # POST /api/contact → persists to DB
    whatsapp.py  # POST /api/whatsapp/webhook — Twilio TwiML bot (see below)
    qr.py        # GET /api/qr/whatsapp — returns PNG QR code (lazy imports qrcode)
```

### Key backend behaviours

- **DB seeding**: `seed_menu()` checks `count_documents` first — safe to call on every startup
- **Order IDs**: `OD-YYMMDD-XXXXX` (date + 5 random uppercase alphanumeric chars)
- **Payment**: `cod` and `upi_on_delivery` only — mocked, no real gateway
- **OrderStatus flow**: `pending → confirmed → preparing → out_for_delivery → delivered | cancelled`
- **CORS**: comma-separated origins in `CORS_ORIGINS` env var — must include the exact Vercel URL (no trailing slash)
- **TwiML responses**: all `&`, `<`, `>`, `"` in bot replies are XML-escaped before wrapping in `<Message>`

### WhatsApp bot (whatsapp.py)

Stateful conversation stored per-phone in `db.whatsapp_sessions`:

```
User sends "menu" → step: menu    (shows full menu, user picks numbers e.g. "1, 3")
                  → step: ask_name
                  → step: ask_address
                  → step: ask_payment  (1=COD, 2=UPI)
                  → step: confirm      (YES saves order to db.orders with source="whatsapp")
```

Sessions are cleared on confirm or cancel. Any "hi/hello/menu/restart" resets to start.
WhatsApp orders appear in the Admin panel exactly like web orders — `source: "whatsapp"` field distinguishes them.

### Testing

Tests use `app.dependency_overrides[get_db]` to inject a mock DB — no real MongoDB needed.
Startup events (`connect_db`, `seed_menu`) are patched via `unittest.mock.patch`.

## Frontend architecture

```
src/
  lib/api.js              # All fetch calls; base URL from VITE_API_URL env var (falls back to /api)
  context/CartContext.jsx # useReducer cart: add/remove/updateQty/clear + drawer open state
  pages/
    Home.jsx              # Hero + bento category grid + bestsellers (API) + story + testimonials
    Menu.jsx              # Search + sticky category tabs (URL param ?cat=) + menu grid
    Checkout.jsx          # Delivery form + mocked COD/UPI payment → POST /api/orders → success
    OrderSuccess.jsx      # Shows OD-… order ID + fetches details from GET /api/orders/:id
    AdminOrders.jsx       # Table of all orders + live status dropdown (PATCH on change)
    WhatsAppOrder.jsx     # QR code (from /api/qr/whatsapp) + instructions for WhatsApp ordering
    Contact.jsx           # Form → POST /api/contact, shows success state on submit
  components/
    Navbar.jsx            # Sticky; WhatsApp nav link is green (#25D366)
    CartDrawer.jsx        # Slide-in drawer; qty controls; navigates to /checkout
```

### Design tokens (index.css)

| Variable | Value | Role |
|----------|-------|------|
| `--terracotta` | `#C1440E` | Primary buttons, prices, accents |
| `--mustard` | `#D4A017` | Bestseller tags, star ratings |
| `--ivory` | `#FAF5EE` | Page background |
| `--brown-dark` | `#3D1C02` | Headings |

Fonts: **Fraunces** (headings, serif) + **Manrope** (body) — loaded from Google Fonts CDN in `index.html`.

All key elements carry `data-testid` attributes. Pattern: `menu-card-{id}`, `add-to-cart-{id}`, `status-select-{orderId}`.

## Deployment

| Service | What | Config |
|---------|------|--------|
| Vercel | React frontend | Root dir: `frontend`; env var: `VITE_API_URL=https://odisha-dhamaka-api.onrender.com/api` |
| Render | FastAPI backend | Root dir: `backend`; start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| MongoDB Atlas | Database | Free M0; env var: `MONGODB_URI` on Render |
| Twilio | WhatsApp sandbox | Webhook URL: `https://odisha-dhamaka-api.onrender.com/api/whatsapp/webhook` (POST) |

Render free tier sleeps after inactivity — hit `/api/health` first to wake it before testing.

### Required env vars on Render

```
MONGODB_URI          # Atlas connection string
DB_NAME              # odisha_dhamaka
CORS_ORIGINS         # https://odisha-dhamaka.vercel.app  (no trailing slash)
TWILIO_ACCOUNT_SID   # From Twilio Console → Account Info
TWILIO_AUTH_TOKEN    # From Twilio Console → Account Info
```

## Next action items

1. **Real payments** — integrate Razorpay (replace `cod`/`upi_on_delivery` mock)
2. **Admin auth** — gate `/admin/orders` behind Google OAuth
3. **Email confirmations** — send via Resend on order creation
4. **Twilio production** — graduate from sandbox to a real WhatsApp Business number
