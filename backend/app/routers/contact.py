from fastapi import APIRouter, Header, HTTPException, Request, status
from app.schemas.contact import ContactRequest
from app.services.email import send_contact_email
from app.services.rate_limit import allowed

router = APIRouter(prefix="/api")

@router.post("/contact", status_code=status.HTTP_202_ACCEPTED)
async def contact(payload: ContactRequest, request: Request, x_forwarded_for: str | None = Header(default=None)):
    if payload.website:
        return {"ok": True}
    ip = (x_forwarded_for or request.client.host if request.client else "unknown").split(",")[0].strip()
    if not await allowed(ip):
        raise HTTPException(status_code=429, detail="Trop de demandes. Réessayez dans une heure.")
    try:
        await send_contact_email(payload)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Le service d’e-mail est temporairement indisponible.") from exc
    return {"ok": True, "message": "Votre message a bien été envoyé."}
