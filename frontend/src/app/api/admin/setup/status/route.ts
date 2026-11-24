import { NextResponse } from "next/server";
export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${backendUrl}/api/admin/setup/status`, { cache: "no-store" });
    const body = await backendResponse.json().catch(() => ({ configured: false }));
    return NextResponse.json(body, { status: backendResponse.status });
  } catch {
    return NextResponse.json({ configured: false }, { status: 503 });
  }
}
