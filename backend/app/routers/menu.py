from fastapi import APIRouter, Depends
from ..database import get_db

router = APIRouter(prefix="/api/menu", tags=["menu"])


@router.get("")
async def get_menu(db=Depends(get_db)):
    items = await db.menu_items.find({}, {"_id": 0}).to_list(100)
    return items


@router.get("/bestsellers")
async def get_bestsellers(db=Depends(get_db)):
    items = await db.menu_items.find({"bestseller": True}, {"_id": 0}).to_list(20)
    return items
