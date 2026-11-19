import smtplib
from email.message import EmailMessage
import httpx
from app.core.config import settings

async def send_contact_email(payload) -> None:
    body = f"""Nouveau message depuis le site SARC Consulting

Nom: {payload.name}
E-mail: {payload.email}
Organisation: {payload.organization or "Non renseignée"}
Sujet: {payload.subject}

Message:
{payload.message}
"""
    if settings.resend_api_key:
        async with httpx.AsyncClient(timeout=8) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={"from": settings.resend_from_email, "to": [settings.contact_email], "reply_to": str(payload.email), "subject": f"[SARC] {payload.subject}", "text": body},
            )
            response.raise_for_status()
        return
    if settings.smtp_host and settings.contact_email:
        message = EmailMessage()
        message["Subject"] = f"[SARC] {payload.subject}"
        message["From"] = settings.smtp_from_email or settings.smtp_user
        message["To"] = settings.contact_email
        message["Reply-To"] = str(payload.email)
        message.set_content(body)
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=8) as smtp:
            smtp.starttls()
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
        return
    raise RuntimeError("Aucun service d’e-mail configuré")
