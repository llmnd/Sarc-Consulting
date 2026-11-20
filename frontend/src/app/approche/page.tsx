import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Notre approche | SARC Consulting",
  description: site.approachIntro,
};

export default function ApproachPage() {
  const page = site.pages.approach;
  return (
    <InteriorPage locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
      <section className="section container">
        <Reveal className="section-heading">
          <span className="eyebrow">{page.eyebrow}</span>
          <h2 className="serif">{page.sectionTitle}</h2>
        </Reveal>
        <div className="process-grid">
          {site.approach.map(([phase,title,summary],index)=>(
            <Reveal className="process-card" key={phase}>
              <span className="page-card-number">{String(index+1).padStart(2,"0")}</span>
              <p className="process-phase">{phase}</p>
              <h3>{title}</h3>
              <p>{site.approachDetails[index]}</p>
              <small>{summary}</small>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section page-soft">
        <Reveal className="container page-note">
          <span className="eyebrow">Sur mesure</span>
          <h2 className="serif">{page.noteTitle}</h2>
          <p>{page.noteText}</p>
        </Reveal>
      </section>
    </InteriorPage>
  );
}
