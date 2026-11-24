import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${backendUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const body = await backendResponse.json().catch(() => ({ detail: "Connexion impossible." }));
    const response = NextResponse.json(body, { status: backendResponse.status });
    const setCookie = backendResponse.headers.get("set-cookie");
    if (setCookie) response.headers.set("set-cookie", setCookie);
    return response;
  } catch {
    return NextResponse.json({ detail: "Backend d'administration indisponible." }, { status: 503 });
  }
}
