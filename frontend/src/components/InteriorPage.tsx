import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/content/site";

type InteriorPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  showContactCta?: boolean;
};

export default function InteriorPage({
  eyebrow,
  title,
  intro,
  children,
  showContactCta = true,
}: InteriorPageProps) {
  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu</a>
      <Header />
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
              <span className="eyebrow">SARC Consulting · Dakar</span>
              <h2 className="serif">{site.pageCta.title}</h2>
              <p>{site.pageCta.text}</p>
              <Link className="button" href="/contact">{site.pageCta.button} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
