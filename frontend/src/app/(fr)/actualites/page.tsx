import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata("news", "fr", "Actualités | SARC Consulting", "Suivez les actualités de SARC Consulting.");

export default function NewsPage() {
  return (
    <InteriorPage pageId="news" locale="fr" eyebrow="Actualités" title="Les informations de SARC Consulting." intro="Retrouvez ici les prochaines actualités, publications et évolutions de nos services.">
      <section className="section container">
        <Reveal className="page-note">
          <span className="eyebrow">À venir</span>
          <h2 className="serif">Nos prochaines publications seront annoncées ici.</h2>
          <p>Pour toute actualité ou demande de presse, contactez notre équipe à aissata.ba-seck@sarc-consulting.com.</p>
        </Reveal>
      </section>
    </InteriorPage>
  );
}
