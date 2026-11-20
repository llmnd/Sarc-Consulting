import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import InteriorPage from "@/components/InteriorPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact | SARC Consulting",
  description: site.pages.contact.intro,
};

export default function ContactPage() {
  const page = site.pages.contact;
  return (
    <InteriorPage locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro} showContactCta={false}>
      <section className="section container contact contact-page">
        <Reveal className="contact-copy">
          <span className="eyebrow">Dakar, Sénégal</span>
          <h2 className="serif">Commençons par vous écouter.</h2>
          <p>Quelques éléments suffisent pour ouvrir la conversation. Votre message sera transmis à notre équipe.</p>
          <div className="contact-detail"><div><small>Nous trouver</small>{site.location}</div></div>
          <div className="contact-detail"><div><small>Nous écrire</small>{site.email}</div></div>
        </Reveal>
        <Reveal><ContactForm locale="fr" /></Reveal>
      </section>
    </InteriorPage>
  );
}
