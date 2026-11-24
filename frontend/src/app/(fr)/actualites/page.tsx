import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { getSql } from "@/lib/admin-auth";

export const metadata: Metadata = createPageMetadata("news", "fr", "Actualités | SARC Consulting", "Suivez les actualités de SARC Consulting.");

export default async function NewsPage() {
  let articles: Array<{ slug: string; title_fr: string; excerpt_fr: string; published_at: string }> = [];
  try {
    const sql = getSql();
    articles = (await sql`
      SELECT slug, title_fr, excerpt_fr, published_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC
    `) as unknown as typeof articles;
  } catch {
    articles = [];
  }

  return (
    <InteriorPage pageId="news" locale="fr" eyebrow="Actualités" title="Les informations de SARC Consulting." intro="Retrouvez ici les prochaines actualités, publications et évolutions de nos services.">
      <section className="section container">
        {articles.length ? (
          <div className="news-list">
            {articles.map((article) => (
              <Reveal className="news-card" key={article.slug}>
                <time>{article.published_at ? new Date(article.published_at).toLocaleDateString("fr-FR") : ""}</time>
                <h2 className="serif">{article.title_fr}</h2>
                <p>{article.excerpt_fr}</p>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="page-note">
            <span className="eyebrow">À venir</span>
            <h2 className="serif">Nos prochaines publications seront annoncées ici.</h2>
            <p>Pour toute actualité ou demande de presse, contactez notre équipe à aissata.ba-seck@sarc-consulting.com.</p>
          </Reveal>
        )}
      </section>
    </InteriorPage>
  );
}
