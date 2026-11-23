import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import InteriorPage from "@/components/InteriorPage";
import { images } from "@/config/images";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

export type InteriorPageId = keyof typeof siteFr.pages;

export default function LocalizedInteriorPage({ pageId, locale }: { pageId: InteriorPageId; locale: Locale }) {
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  let pageContent: ReactNode;

  switch (pageId) {
    case "cabinet": {
      const page = site.pages.cabinet;
      pageContent = (
        <>
          <section className="section container page-columns">
            <Reveal className="page-copy">
              <span className="eyebrow">{page.missionEyebrow}</span>
              <h2 className="serif">{site.cabinet.missionTitle}</h2>
              <p>{site.cabinet.missionText}</p>
            </Reveal>
            <Reveal className="page-image">
              <Image src={images.hero.src} alt={copy.home.teamPhotoAlt} fill sizes="(max-width:760px) 100vw,48vw" />
            </Reveal>
          </section>
          <section className="section page-soft">
            <div className="container">
              <Reveal className="section-heading">
                <span className="eyebrow">{page.eyebrow}</span>
                <h2 className="serif">{page.principlesTitle}</h2>
              </Reveal>
              <div className="page-card-grid">
                {site.cabinet.principles.map(([title, text], index) => (
                  <Reveal className="page-card" key={title}>
                    <span className="page-card-number">{String(index + 1).padStart(2, "0")}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      );
      break;
    }
    case "expertises": {
      const page = site.pages.expertises;
      pageContent = (
        <section className="section container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.eyebrow}</span>
            <h2 className="serif">{page.sectionTitle}</h2>
          </Reveal>
          <Reveal className="expertise-figure">
            <Image src={images.expertises.src} alt={copy.home.expertiseImageAlt} width={768} height={1024} sizes="(max-width:760px) 100vw,86vw" />
          </Reveal>
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
      );
      break;
    }
    case "approach": {
      const page = site.pages.approach;
      pageContent = (
        <>
          <section className="section container">
            <Reveal className="section-heading">
              <span className="eyebrow">{page.eyebrow}</span>
              <h2 className="serif">{page.sectionTitle}</h2>
            </Reveal>
            <div className="process-grid">
              {site.approach.map(([phase, title, summary], index) => (
                <Reveal className="process-card" key={phase}>
                  <span className="page-card-number">{String(index + 1).padStart(2, "0")}</span>
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
              <span className="eyebrow">{locale === "en" ? "Tailored support" : "Sur mesure"}</span>
              <h2 className="serif">{page.noteTitle}</h2>
              <p>{page.noteText}</p>
            </Reveal>
          </section>
        </>
      );
      break;
    }
    case "sectors": {
      const page = site.pages.sectors;
      pageContent = (
        <section className="section container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.eyebrow}</span>
            <h2 className="serif">{page.sectionTitle}</h2>
          </Reveal>
          <div className="page-card-grid sector-card-grid">
            {site.sectors.map((sector, index) => (
              <Reveal className="page-card" key={sector}>
                <span className="page-card-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{sector}</h3>
                <p>{site.sectorDetails[index]}</p>
              </Reveal>
            ))}
          </div>
          <p className="page-footnote">{page.note}</p>
        </section>
      );
      break;
    }
    case "commitments": {
      const page = site.pages.commitments;
      pageContent = (
        <section className="section container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.eyebrow}</span>
            <h2 className="serif">{page.sectionTitle}</h2>
          </Reveal>
          <div className="commitment-page-grid">
            {site.commitments.map(([title, summary], index) => (
              <Reveal className="commitment-page-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="serif">{title}</h3>
                <p>{site.commitmentDetails[index]}</p>
                <small>{summary}</small>
              </Reveal>
            ))}
          </div>
        </section>
      );
      break;
    }
    case "contact": {
      const page = site.pages.contact;
      pageContent = (
        <section className="section container contact contact-page">
          <Reveal className="contact-copy">
            <span className="eyebrow">{site.location}</span>
            <h2 className="serif">{locale === "en" ? "Let's start by listening." : "Commençons par vous écouter."}</h2>
            <p>{locale === "en" ? "A few details are enough to start the conversation. Your message will be sent to our team." : "Quelques éléments suffisent pour ouvrir la conversation. Votre message sera transmis à notre équipe."}</p>
            <div className="contact-detail"><div><small>{copy.home.findUs}</small>{site.location}</div></div>
            <div className="contact-detail"><div><small>{copy.home.emailUs}</small>{site.email}</div></div>
          </Reveal>
          <Reveal><ContactForm locale={locale} /></Reveal>
        </section>
      );
      break;
    }
  }

  const page = site.pages[pageId];
  return (
    <InteriorPage pageId={pageId} locale={locale} eyebrow={page.eyebrow} title={page.title} intro={page.intro} showContactCta={pageId !== "contact"}>
      {pageContent}
    </InteriorPage>
  );
}
