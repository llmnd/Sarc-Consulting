import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";
import { localizedRoutes, siteUrl, type SeoPage } from "@/config/seo";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  heroActions?: ReactNode;
  children: ReactNode;
  locale: Locale;
  pageId: SeoPage;
  showContactCta?: boolean;
};

export default function InteriorPage({
  eyebrow,
  title,
  intro,
  heroActions,
  children,
  locale,
  pageId,
  showContactCta = true,
}: InteriorPageProps) {
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  const contactPath = locale === "en" ? "/en/contact" : "/contact";
  const homePath = localizedRoutes.home[locale];
  const pagePath = localizedRoutes[pageId][locale];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : "Accueil",
        item: `${siteUrl}${homePath}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: eyebrow,
        item: `${siteUrl}${pagePath}`,
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />
      <a className="skip-link" href="#main">
        {copy.skipLink}
      </a>
      <Header locale={locale} />
      <main id="main" tabIndex={-1}>
        <section
          className={`interior-hero interior-hero-${pageId}`}
          aria-labelledby="interior-page-title"
          aria-describedby="interior-page-intro"
        >
          <div className="interior-hero-content">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="serif" id="interior-page-title">
              {title}
            </h1>
            <p id="interior-page-intro">{intro}</p>
            {heroActions && <div className="interior-hero-actions">{heroActions}</div>}
          </div>
          <span className="interior-hero-mark" aria-hidden="true">S</span>
        </section>
        {children}
        {showContactCta && (
          <section className="page-cta">
            <div className="page-cta-content">
              <span className="eyebrow">{copy.interiorCtaEyebrow}</span>
              <h2 className="serif">{site.pageCta.title}</h2>
              <p>{site.pageCta.text}</p>
              <Link className="button" href={contactPath}>
                {site.pageCta.button}
                <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
