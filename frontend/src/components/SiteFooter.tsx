import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="container site-footer">
      <Link className="brand" href="/" aria-label="SARC Consulting, retour à l’accueil">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">SARC <small>CONSULTING</small></span>
      </Link>
      <span>© {new Date().getFullYear()} SARC Consulting</span>
      <div className="footer-links">
        <Link href="/engagements">Engagements</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/">Retour à l’accueil <ArrowUp className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></Link>
      </div>
    </footer>
  );
}
