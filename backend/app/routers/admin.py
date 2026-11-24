from datetime import datetime, timedelta, timezone
from typing import Any

import asyncpg
import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, Response, status

from app.core.config import settings
from app.schemas.admin import AdminLoginRequest, AdminSetupRequest

router = APIRouter(prefix="/api/admin")
COOKIE_NAME = "sarc_admin_session"


async def connect() -> asyncpg.Connection:
    if not settings.database_url:
        raise HTTPException(status_code=503, detail="DATABASE_URL is not configured.")
    return await asyncpg.connect(settings.database_url)


def session_secret() -> str:
    if not settings.admin_session_secret:
        raise HTTPException(status_code=503, detail="ADMIN_SESSION_SECRET is not configured.")
    return settings.admin_session_secret


@router.post("/setup")
async def setup(payload: AdminSetupRequest):
    if payload.website:
        raise HTTPException(status_code=400, detail="Request rejected.")

    connection = await connect()
    try:
        count = await connection.fetchval("SELECT count(*)::int FROM admin_users")
        if count:
            raise HTTPException(status_code=409, detail="Le compte administrateur existe déjà.")

        password_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")
        await connection.execute(
            """
            INSERT INTO admin_users (name, email, password_hash, role, active)
            VALUES ($1, $2, $3, 'admin', true)
            """,
            payload.name.strip(),
            str(payload.email).lower(),
            password_hash,
        )
        return {"ok": True}
    finally:
        await connection.close()


@router.post("/login")
async def login(payload: AdminLoginRequest, response: Response):
    if payload.website:
        raise HTTPException(status_code=400, detail="Request rejected.")

    connection = await connect()
    try:
        user: Any = await connection.fetchrow(
            """
            SELECT id::text, name, email, password_hash, role
            FROM admin_users
            WHERE lower(email) = $1 AND active = true
            LIMIT 1
            """,
            str(payload.email).lower(),
        )
    finally:
        await connection.close()

    if not user or not bcrypt.checkpw(payload.password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Identifiants incorrects.")

    now = datetime.now(timezone.utc)
    token = jwt.encode(
        {
            "sub": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": "editor" if user["role"] == "editor" else "admin",
            "iat": now,
            "exp": now + timedelta(hours=8),
        },
        session_secret(),
        algorithm="HS256",
    )
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=28800,
        path="/",
    )
    return {"ok": True}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}


@router.get("/setup/status")
async def setup_status():
    connection = await connect()
    try:
        count = await connection.fetchval("SELECT count(*)::int FROM admin_users")
        return {"configured": bool(count)}
    finally:
        await connection.close()
