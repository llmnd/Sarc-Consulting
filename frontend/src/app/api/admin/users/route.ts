import { NextResponse } from "next/server";
import { getAdminSession, getSql } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  const sql = getSql();
  const users = await sql`
    SELECT id::text, name, email, role, active, created_at
    FROM admin_users
    ORDER BY created_at DESC
  `;
  return NextResponse.json({ sessionName: session.name, users });
}
