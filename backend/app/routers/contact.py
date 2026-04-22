from fastapi import APIRouter, Depends
from ..database import get_db
from ..models import ContactCreate
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", status_code=201)
async def submit_contact(payload: ContactCreate, db=Depends(get_db)):
    doc = payload.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    result = await db.contacts.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc
