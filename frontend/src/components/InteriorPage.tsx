import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  locale: Locale;
  showContactCta?: boolean;
};

export default function InteriorPage({
  eyebrow,
  title,
  intro,
  children,
  locale,
  showContactCta = true,
}: InteriorPageProps) {
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  const contactPath = locale === "en" ? "/en/contact" : "/contact";
  return (
    <>
      <a className="skip-link" href="#main">{copy.skipLink}</a>
      <Header locale={locale} />
      <main id="main" tabIndex={-1}>
        <section className="interior-hero">
          <div className="interior-hero-content">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="serif">{title}</h1>
            <p>{intro}</p>
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
              <Link className="button" href={contactPath}>{site.pageCta.button} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
