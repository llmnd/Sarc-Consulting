import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getSql } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  const sql = getSql();
  const requests = await sql`
    SELECT id::text, name, email, organization, subject, message, status, created_at
    FROM contact_requests
    ORDER BY created_at DESC
  `;
  return NextResponse.json({ sessionName: session.name, requests });
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }
  if (!body.id || !["new", "in_progress", "closed"].includes(body.status ?? "")) {
    return NextResponse.json({ detail: "Paramètres invalides." }, { status: 400 });
  }

  const sql = getSql();
  await sql`
    UPDATE contact_requests
    SET status = ${body.status}
    WHERE id = ${body.id}::uuid
  `;
  return NextResponse.json({ ok: true });
}
