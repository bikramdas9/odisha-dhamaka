from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..config import settings
import io

router = APIRouter(prefix="/api/qr", tags=["qr"])

SANDBOX_NUMBER = settings.twilio_whatsapp_from.replace("whatsapp:", "")


@router.get("/whatsapp")
async def get_whatsapp_qr():
    try:
        import qrcode
    except ImportError:
        raise HTTPException(500, "qrcode package not installed")

    wa_url = f"https://wa.me/{SANDBOX_NUMBER.lstrip('+').replace(' ', '')}?text=menu"
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(wa_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#C1440E", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
