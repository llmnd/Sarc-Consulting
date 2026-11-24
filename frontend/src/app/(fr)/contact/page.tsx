import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("contact", "fr", "Contact | SARC Consulting", site.pages.contact.intro);

export default function ContactPage() {
  const page = site.pages.contact;
  return (
    <InteriorPage pageId="contact" locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro} showContactCta={false}>
      <section className="section container contact contact-page">
        <Reveal className="contact-copy">
          <span className="eyebrow">Dakar, Sénégal</span>
          <h2 className="serif">Commençons par vous écouter.</h2>
          <p>Parlons de vos dossiers. Un premier échange de 30 minutes suffit pour identifier ce que SARC peut reprendre ou améliorer.</p>
          <div className="contact-detail"><div><small>Nous trouver</small>{site.address}, {site.location}</div></div>
          <div className="contact-detail"><div><small>Nous écrire</small><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
          <div className="contact-detail"><div><small>Nous appeler</small><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phoneDisplay}</a></div></div>
        </Reveal>
        <Reveal><ContactForm locale="fr" /></Reveal>
      </section>
    </InteriorPage>
  );
}
