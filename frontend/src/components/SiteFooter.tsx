import Link from "next/link";

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
        <Link href="/">Retour à l’accueil ↑</Link>
      </div>
    </footer>
  );
}
