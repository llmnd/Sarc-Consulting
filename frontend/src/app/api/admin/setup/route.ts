import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${backendUrl}/api/admin/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const body = await backendResponse.json().catch(() => ({ detail: "Création impossible." }));
    return NextResponse.json(body, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ detail: "Backend d'administration indisponible." }, { status: 503 });
  }
}
