import httpx
from app.core.config import settings

async def allowed(ip: str) -> bool:
    if not settings.upstash_rest_url or not settings.upstash_rest_token:
        return True
    key = f"sarc:contact:{ip}"
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            response = await client.post(
                f"{settings.upstash_rest_url}/eval",
                headers={"Authorization": f"Bearer {settings.upstash_rest_token}"},
                json=["local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],3600) end; if n>5 then return 0 end; return 1", "1", key],
            )
            response.raise_for_status()
            data = response.json()
            return bool(data.get("result", 1))
    except Exception:
        return True
