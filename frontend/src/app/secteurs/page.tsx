import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("sectors", "fr", "Secteurs | SARC Consulting", site.pages.sectors.intro);

export default function SectorsPage() {
  const page = site.pages.sectors;
  return (
    <InteriorPage locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
      <section className="section container">
        <Reveal className="section-heading">
          <span className="eyebrow">{page.eyebrow}</span>
          <h2 className="serif">{page.sectionTitle}</h2>
        </Reveal>
        <div className="page-card-grid sector-card-grid">
          {site.sectors.map((sector,index)=>(
            <Reveal className="page-card" key={sector}>
              <span className="page-card-number">{String(index+1).padStart(2,"0")}</span>
              <h3>{sector}</h3>
              <p>{site.sectorDetails[index]}</p>
            </Reveal>
          ))}
        </div>
        <p className="page-footnote">{page.note}</p>
      </section>
    </InteriorPage>
  );
}
