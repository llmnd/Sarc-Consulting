import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { ui, type Locale } from "@/content/ui";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const site = locale === "en" ? siteEn : siteFr;
  const homePath = locale === "en" ? "/en" : "/";
  const commitmentsPath = locale === "en" ? "/en/commitments" : "/engagements";
  const contactPath = locale === "en" ? "/en/contact" : "/contact";
  return (
    <footer className="container site-footer">
      <div className="footer-grid">
        <div>
          <Link className="brand" href={homePath} aria-label={copy.footer.brandHome}>
            <Image className="brand-logo brand-logo-light" src="/images/sarc-logo-light.png" alt="" width={268} height={75} />
          </Link>
          <p>{locale === "en" ? "Operational excellence in service of your success." : "L'excellence opérationnelle au service de vos réussites."}</p>
        </div>
        <div>
          <strong>{locale === "en" ? "Company" : "Entreprise"}</strong>
          <Link href={locale === "en" ? "/en/about" : "/a-propos"}>{locale === "en" ? "Who we are" : "Qui sommes-nous"}</Link>
          <Link href={locale === "en" ? "/en/about" : "/a-propos"}>{locale === "en" ? "Our history" : "Notre histoire"}</Link>
          <Link href={locale === "en" ? "/en/about" : "/a-propos"}>{locale === "en" ? "Our values" : "Notre ADN"}</Link>
        </div>
        <div>
          <strong>{locale === "en" ? "Services" : "Offres"}</strong>
          <Link href={locale === "en" ? "/en/expertise" : "/prestations"}>{locale === "en" ? "Compliance" : "Conformité"}</Link>
          <Link href={locale === "en" ? "/en/expertise" : "/prestations"}>{locale === "en" ? "Legal" : "Juridique"}</Link>
          <Link href={locale === "en" ? "/en/expertise" : "/prestations"}>{locale === "en" ? "Operational excellence" : "Excellence opérationnelle"}</Link>
          <Link href={locale === "en" ? "/en/ai-automation" : "/ia-automatisation"}>{locale === "en" ? "AI & automation" : "IA & automatisation"}</Link>
        </div>
        <div>
          <strong>Contact</strong>
          <span>{site.address}</span>
          <span>{site.location}</span>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {locale === "fr" ? site.legalName : site.name} · RCCM {site.rccm}</span>
        <div className="footer-links">
          <Link href={commitmentsPath}>{copy.footer.commitments}</Link>
          <Link href={contactPath}>{copy.footer.contact}</Link>
          <Link href={homePath}>{copy.footer.home} <ArrowUp className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
        </div>
      </div>
    </footer>
  );
}
