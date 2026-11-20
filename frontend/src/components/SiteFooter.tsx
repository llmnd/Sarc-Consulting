import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { ui, type Locale } from "@/content/ui";

export default function SiteFooter({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const homePath = locale === "en" ? "/en" : "/";
  const commitmentsPath = locale === "en" ? "/en/commitments" : "/engagements";
  const contactPath = locale === "en" ? "/en/contact" : "/contact";
  return (
    <footer className="container site-footer">
      <Link className="brand" href={homePath} aria-label={copy.footer.brandHome}>
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">SARC <small>CONSULTING</small></span>
      </Link>
      <span>© {new Date().getFullYear()} SARC Consulting</span>
      <div className="footer-links">
        <Link href={commitmentsPath}>{copy.footer.commitments}</Link>
        <Link href={contactPath}>{copy.footer.contact}</Link>
        <Link href={homePath}>{copy.footer.home} <ArrowUp className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
      </div>
    </footer>
  );
}
