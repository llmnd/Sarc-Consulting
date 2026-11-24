import { NextResponse } from "next/server";
import { getAdminSession, getSql } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  const sql = getSql();
  const articles = await sql`
    SELECT id::text, slug, title_fr, excerpt_fr, content_fr,
           title_en, excerpt_en, content_en, status, published_at, created_at
    FROM articles
    ORDER BY created_at DESC
  `;
  return NextResponse.json({ sessionName: session.name, articles });
}
