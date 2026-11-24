import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, getSql } from "@/lib/admin-auth";

type ArticleBody = {
  id?: string;
  slug?: string;
  titleFr?: string;
  excerptFr?: string;
  contentFr?: string;
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  status?: string;
};

function readArticleBody(body: ArticleBody) {
  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const titleFr = body.titleFr?.trim();
  const excerptFr = body.excerptFr?.trim();
  const contentFr = body.contentFr?.trim();
  const status = body.status === "published" ? "published" : "draft";
  return {
    slug,
    titleFr,
    excerptFr,
    contentFr,
    titleEn: body.titleEn?.trim() || null,
    excerptEn: body.excerptEn?.trim() || null,
    contentEn: body.contentEn?.trim() || null,
    status,
  };
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  let body: ArticleBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }

  const article = readArticleBody(body);
  if (!article.slug || !article.titleFr || !article.excerptFr || !article.contentFr) {
    return NextResponse.json({ detail: "Titre, résumé et contenu français requis." }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO articles (
        slug, title_fr, excerpt_fr, content_fr,
        title_en, excerpt_en, content_en, status, published_at
      )
      VALUES (
        ${article.slug}, ${article.titleFr}, ${article.excerptFr}, ${article.contentFr},
        ${article.titleEn}, ${article.excerptEn}, ${article.contentEn},
        ${article.status}, ${article.status === "published" ? new Date() : null}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error && error.message.includes("duplicate") ? "Cette URL existe déjà." : "Création impossible.";
    return NextResponse.json({ detail }, { status: 409 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  let body: ArticleBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }

  const id = body.id?.trim();
  const article = readArticleBody(body);
  if (!id || !article.slug || !article.titleFr || !article.excerptFr || !article.contentFr) {
    return NextResponse.json({ detail: "Identifiant, titre, résumé et contenu français requis." }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql`
      UPDATE articles
      SET slug = ${article.slug},
          title_fr = ${article.titleFr},
          excerpt_fr = ${article.excerptFr},
          content_fr = ${article.contentFr},
          title_en = ${article.titleEn},
          excerpt_en = ${article.excerptEn},
          content_en = ${article.contentEn},
          status = ${article.status},
          published_at = CASE
            WHEN ${article.status} = 'published' AND published_at IS NULL THEN now()
            WHEN ${article.status} = 'draft' THEN NULL
            ELSE published_at
          END,
          updated_at = now()
      WHERE id = ${id}::uuid
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const detail = error instanceof Error && error.message.includes("duplicate") ? "Cette URL existe déjà." : "Modification impossible.";
    return NextResponse.json({ detail }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ detail: "Non autorisé." }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ detail: "Identifiant requis." }, { status: 400 });

  const sql = getSql();
  await sql`DELETE FROM articles WHERE id = ${id}::uuid`;
  return NextResponse.json({ ok: true });
}
