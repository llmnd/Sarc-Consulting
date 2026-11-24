import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("approach", "fr", "Notre méthode | SARC Consulting", site.approachIntro);

export default function MethodPage() {
  return (
    <InteriorPage pageId="approach" locale="fr" eyebrow="Notre méthode" title="La qualité n'est pas une option, c'est notre méthode." intro="Double regard sur chaque dossier, engagements suivis chaque mois, binômes formés et modes opératoires écrits.">
      <section className="section container">
        <div className="process-grid">
          {[
            ["1", "Diagnostic", "Cartographie de vos processus, volumes et risques."],
            ["2", "Transition", "Reprise encadrée, procédures et accès mis en place."],
            ["3", "Production", "Traitement courant selon les engagements convenus."],
            ["4", "Optimisation", "Bilan périodique, gains partagés et automatisation."],
          ].map(([number, title, text]) => (
            <Reveal className="process-card" key={number}><span className="page-card-number">{number}</span><h3>{title}</h3><p>{text}</p></Reveal>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
