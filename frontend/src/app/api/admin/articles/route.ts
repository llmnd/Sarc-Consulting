import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getSql } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  let body: {
    slug?: string;
    titleFr?: string;
    excerptFr?: string;
    contentFr?: string;
    titleEn?: string;
    excerptEn?: string;
    contentEn?: string;
    status?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }

  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const titleFr = body.titleFr?.trim();
  const excerptFr = body.excerptFr?.trim();
  const contentFr = body.contentFr?.trim();
  if (!slug || !titleFr || !excerptFr || !contentFr) {
    return NextResponse.json({ detail: "Titre, résumé et contenu français requis." }, { status: 400 });
  }

  try {
    const sql = getSql();
    const status = body.status === "published" ? "published" : "draft";
    await sql`
      INSERT INTO articles (
        slug, title_fr, excerpt_fr, content_fr,
        title_en, excerpt_en, content_en, status,
        published_at
      )
      VALUES (
        ${slug}, ${titleFr}, ${excerptFr}, ${contentFr},
        ${body.titleEn?.trim() || null},
        ${body.excerptEn?.trim() || null},
        ${body.contentEn?.trim() || null},
        ${status},
        ${status === "published" ? new Date() : null}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error && error.message.includes("duplicate") ? "Cette URL existe déjà." : "Création impossible.";
    return NextResponse.json({ detail }, { status: 409 });
  }
}
