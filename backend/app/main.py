from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import connect_db, close_db
from .seed import seed_menu
from .routers import menu, orders, contact, whatsapp, qr
from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    from .database import db
    await seed_menu(db)
    yield
    await close_db()


app = FastAPI(title="Odisha Dhamaka API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(contact.router)
app.include_router(whatsapp.router)
app.include_router(qr.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
