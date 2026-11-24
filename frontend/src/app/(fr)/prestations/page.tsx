import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("expertises", "fr", "Prestations | SARC Consulting", "Conformité, juridique, excellence opérationnelle et automatisation pour les entreprises.");

export default function ServicesPage() {
  return (
    <InteriorPage pageId="expertises" locale="fr" eyebrow="Nos offres" title="Une offre complète, à la carte." intro="Toutes nos prestations sont adaptées à la taille, à l'organisation et aux obligations de votre structure.">
      <section className="section container">
        <div className="page-card-grid">
          {site.expertises.map(([title, summary], index) => (
            <Reveal className="page-card" key={title}>
              <span className="page-card-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{summary}</p>
              <p>{site.expertiseDetails[index]}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
