import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";

export async function POST() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${backendUrl}/api/admin/logout`, {
      method: "POST",
      cache: "no-store",
    });
    const body = await backendResponse.json().catch(() => ({ ok: true }));
    const response = NextResponse.json(body, { status: backendResponse.status });
    const setCookie = backendResponse.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
    return response;
  } catch {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(adminCookieName);
    return response;
  }
}
