import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("commitments", "fr", "Nos engagements | SARC Consulting", site.pages.commitments.intro);

export default function CommitmentsPage() {
  const page = site.pages.commitments;
  return (
    <InteriorPage pageId="commitments" locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
      <section className="section container">
        <Reveal className="section-heading">
          <span className="eyebrow">{page.eyebrow}</span>
          <h2 className="serif">{page.sectionTitle}</h2>
        </Reveal>
        <div className="commitment-page-grid">
          {site.commitments.map(([title,summary],index)=>(
            <Reveal className="commitment-page-card" key={title}>
              <span>{String(index+1).padStart(2,"0")}</span>
              <h3 className="serif">{title}</h3>
              <p>{site.commitmentDetails[index]}</p>
              <small>{summary}</small>
            </Reveal>
          ))}
        </div>
      </section>
    </InteriorPage>
  );
}
