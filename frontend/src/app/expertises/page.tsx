import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { images } from "@/config/images";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Expertises | SARC Consulting",
  description: site.expertiseIntro,
};

export default function ExpertisesPage() {
  const page = site.pages.expertises;
  return (
    <InteriorPage locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
      <section className="section container">
        <Reveal className="section-heading">
          <span className="eyebrow">{page.eyebrow}</span>
          <h2 className="serif">{page.sectionTitle}</h2>
        </Reveal>
        <Reveal className="expertise-figure">
          <Image src={images.expertises.src} alt={images.expertises.alt} width={768} height={1024} sizes="(max-width:760px) 100vw,86vw" />
        </Reveal>
        <div className="page-card-grid">
          {site.expertises.map(([title,summary],index)=>(
            <Reveal className="page-card" key={title}>
              <span className="page-card-number">{String(index+1).padStart(2,"0")}</span>
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
