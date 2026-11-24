import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
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
          <section className="section container page-columns about-president-section">
            <Reveal className="president-portrait">
              <span className="president-monogram" aria-hidden="true">AB</span>
              <span className="president-portrait-label">{page.portraitLabel}</span>
            </Reveal>
            <Reveal className="page-copy president-copy">
              <span className="eyebrow">{page.missionEyebrow}</span>
              <blockquote className="president-quote serif">
                <span className="president-quote-mark" aria-hidden="true">“</span>
                <span>{site.cabinet.president.quote}</span>
              </blockquote>
              {site.cabinet.president.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="president-attribution"><strong>{site.cabinet.president.name}</strong>, {site.cabinet.president.role}</p>
            </Reveal>
          </section>
          <section className="section page-soft">
            <div className="container">
              <Reveal className="section-heading">
                <span className="eyebrow">{page.historyEyebrow}</span>
                <h2 className="serif">{page.historyTitle}</h2>
                <p className="history-intro">{site.cabinet.history.intro}</p>
              </Reveal>
              <div className="history-grid">
                {site.cabinet.history.milestones.map((milestone) => (
                  <Reveal className="history-card" key={`${milestone.date}-${milestone.title}`}>
                    <time>{milestone.date}</time>
                    <h3>{milestone.title}</h3>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
          <section className="section about-values">
            <div className="container">
              <Reveal className="section-heading">
                <span className="eyebrow">{page.principlesEyebrow}</span>
                <h2 className="serif">{page.principlesTitle}</h2>
              </Reveal>
              <div className="about-values-grid">
                {site.cabinet.principles.map(([title, text]) => (
                  <Reveal className="about-value" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
          <section className="section page-soft">
            <div className="container">
              <Reveal className="section-heading">
                <span className="eyebrow">{page.modelsEyebrow}</span>
                <h2 className="serif">{page.modelsTitle}</h2>
              </Reveal>
              <div className="about-model-grid">
                {site.cabinet.interventionModels.map(([title, text]) => (
                  <Reveal className="about-model-card" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
          <section className="section team-section">
            <div className="container">
              <Reveal className="team-heading">
                <span className="eyebrow">{copy.home.team}</span>
                <h2 className="serif">{copy.home.teamTitle}</h2>
                <p>{copy.home.teamIntro}</p>
              </Reveal>
              <div className="team-grid about-team-grid">
                {site.teamMembers.map((member) => {
                  const initials = member.name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("");

                  return (
                    <Reveal className="team-card-wrap" key={member.name}>
                      <details className="team-card">
                        <summary>
                          <span className="team-profile-visual">
                            {member.portrait ? (
                              <Image
                                className="team-avatar"
                                src={member.portrait}
                                alt={`${copy.home.portraitAlt} ${member.name}`}
                                width={160}
                                height={160}
                                sizes="(max-width:760px) 96px,160px"
                              />
                            ) : (
                              <span className="team-avatar team-avatar-placeholder team-profile-monogram" aria-hidden="true">
                                {initials}
                              </span>
                            )}
                            <span className="team-profile-overlay" aria-hidden="true">
                              <span className="team-profile-name">{member.name}</span>
                              <span className="team-profile-role">{member.role}</span>
                            </span>
                          </span>
                          <span className="team-profile-accessible-name">{member.name}</span>
                          <span className="team-profile-accessible-role">{member.role}</span>
                          <span className="team-more">
                            <span>{copy.home.learnMore}</span>
                            <span className="team-more-icon" aria-hidden="true">+</span>
                          </span>
                        </summary>
                        <div className="team-bio"><p>{member.bio}</p></div>
                      </details>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
          <section className="page-cta">
            <div className="page-cta-content">
              <span className="eyebrow">{copy.interiorCtaEyebrow}</span>
              <h2 className="serif">{copy.home.finalCtaTitle}</h2>
              <p>{copy.home.finalCtaText}</p>
              <div className="page-cta-actions">
                <Link className="button" href={locale === "en" ? "/en/contact" : "/contact"}>
                  {copy.home.bookMeeting}<ArrowUpRight className="action-icon" size={14} aria-hidden="true" />
                </Link>
                <a className="button button-outline" href="/maquette/Maquette_site_SARC_Consulting.pdf" download>
                  {copy.home.downloadBrochure}<ArrowDownToLine className="action-icon" size={14} aria-hidden="true" />
                </a>
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
    <InteriorPage pageId={pageId} locale={locale} eyebrow={page.eyebrow} title={page.title} intro={page.intro} showContactCta={pageId !== "contact" && pageId !== "cabinet"}>
      {pageContent}
    </InteriorPage>
  );
}
