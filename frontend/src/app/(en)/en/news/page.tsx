import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { getSql } from "@/lib/admin-auth";

export const metadata: Metadata = createPageMetadata(
  "news",
  "en",
  "News | SARC Consulting",
  "Read the latest news and updates from SARC Consulting.",
);

export default async function NewsPage() {
  let articles: Array<{ slug: string; title_en: string | null; excerpt_en: string | null; title_fr: string; excerpt_fr: string; published_at: string }> = [];
  try {
    const sql = getSql();
    articles = (await sql`
      SELECT slug, title_en, excerpt_en, title_fr, excerpt_fr, published_at
      FROM articles
      WHERE status = 'published'
      ORDER BY published_at DESC
    `) as unknown as typeof articles;
  } catch {
    articles = [];
  }

  return (
    <InteriorPage
      pageId="news"
      locale="en"
      eyebrow="News"
      title="Updates from SARC Consulting."
      intro="Find upcoming news, publications and updates to our services here."
    >
      <section className="section container">
        {articles.length ? (
          <div className="news-list">
            {articles.map((article) => (
              <Reveal className="news-card" key={article.slug}>
                <time>{article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB") : ""}</time>
                <h2 className="serif">{article.title_en || article.title_fr}</h2>
                <p>{article.excerpt_en || article.excerpt_fr}</p>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="page-note">
            <span className="eyebrow">Coming soon</span>
            <h2 className="serif">Our next publications will be announced here.</h2>
            <p>
              For press enquiries, contact our team at{" "}
              <a href="mailto:aissata.ba-seck@sarc-consulting.com">
                aissata.ba-seck@sarc-consulting.com
              </a>.
            </p>
          </Reveal>
        )}
      </section>
    </InteriorPage>
  );
}
