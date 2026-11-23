import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { images } from "@/config/images";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata("cabinet", "fr", "Le cabinet | SARC Consulting", site.cabinet.pageIntro);

export default function CabinetPage() {
  const page = site.pages.cabinet;
  return (
    <InteriorPage pageId="cabinet" locale="fr" eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
      <section className="section container page-columns">
        <Reveal className="page-copy">
          <span className="eyebrow">{page.missionEyebrow}</span>
          <h2 className="serif">{site.cabinet.missionTitle}</h2>
          <p>{site.cabinet.missionText}</p>
        </Reveal>
        <Reveal className="page-image">
          <Image src={images.hero.src} alt={images.hero.alt} fill sizes="(max-width:760px) 100vw,48vw" />
        </Reveal>
      </section>
      <section className="section page-soft">
        <div className="container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.eyebrow}</span>
            <h2 className="serif">{page.principlesTitle}</h2>
          </Reveal>
          <div className="page-card-grid">
            {site.cabinet.principles.map(([title,text],index)=>(
              <Reveal className="page-card" key={title}>
                <span className="page-card-number">{String(index+1).padStart(2,"0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </InteriorPage>
  );
}
