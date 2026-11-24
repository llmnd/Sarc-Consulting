import Header from "@/components/Header";
import Reveal from "@/components/Reveal";
import SectorExplorer from "@/components/SectorExplorer";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { images } from "@/config/images";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

export default function HomePage({ locale }: { locale: Locale }) {
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  const home = copy.home;
  const serviceBasePath = locale === "en" ? "/en/expertise" : "/prestations";
  const methodPath = locale === "en" ? "/en/approach" : "/methode";
  const servicePaths = [
    serviceBasePath,
    serviceBasePath,
    serviceBasePath,
    locale === "en" ? "/en/ai-automation" : "/ia-automatisation",
  ];

  return (
    <>
      <a className="skip-link" href="#main">{copy.skipLink}</a>
      <Header locale={locale} />
      <main id="main" tabIndex={-1}>
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <span className="eyebrow">{site.hero.eyebrow}</span>
            <h1 className="serif">{home.heroTitleFirst}{" "}<br /><span>{home.heroTitleSecond}</span></h1>
            <p>{site.hero.subtitle}</p>
            <div className="hero-actions">
              <a className="button" href={locale === "en" ? "/en/contact" : "/contact"}>{home.contact} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></a>
              <a className="button button-outline" href="#expertises">{home.discoverExpertise}</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo-frame">
              <div className="hero-photo">
                <Image src={images.hero.src} alt={home.teamPhotoAlt} fill priority quality={90} sizes="(max-width:760px) 100vw,50vw" />
              </div>
              <div className="hero-photo-caption">
                <span className="hero-photo-caption-mark" aria-hidden="true">S</span>
                <span><strong>SARC CONSULTING</strong><small>{locale === "en" ? "A pan-African ambition" : "Une ambition panafricaine"}</small></span>
              </div>
            </div>
          </div>
          <a className="hero-scroll" href="#cabinet">{home.scroll}</a>
        </section>
        <section className="home-about" id="cabinet">
          <div className="section container cabinet">
            <Reveal className="cabinet-aside">
              <span className="eyebrow">{home.cabinet}</span>
              <h2 className="serif">{site.cabinet.title}</h2>
            </Reveal>
            <Reveal className="cabinet-copy">
              <p>{site.cabinet.text}</p>
            </Reveal>
          </div>
          <div className="stats container">
            {site.stats.map((stat) => (
              <div className="stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}{stat.note && <small>{stat.note}</small>}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="section container expertise" id="expertises">
          <Reveal className="section-heading home-offers-heading">
            <div><span className="eyebrow">{home.expertise}</span><h2 className="serif">{home.expertiseTitle}</h2></div>
            <a className="text-link" href={serviceBasePath}>{home.allServices}<ArrowUpRight className="action-icon" size={14} aria-hidden="true" /></a>
          </Reveal>
          <div className="expertise-grid">
            {site.expertises.map(([title, text], i) => (
              <Reveal className="expertise-card" key={title}>
                <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="expertise-card-link" href={servicePaths[i]}>{home.learnMore}<ArrowUpRight className="action-icon" size={14} aria-hidden="true" /></a>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section container gains-section" id="gains">
          <Reveal className="section-heading"><span className="eyebrow">{locale === "en" ? "What you gain" : "Ce que vous gagnez"}</span><h2 className="serif">{home.gainsTitle}</h2></Reveal>
          <div className="gains-grid">
            {site.homeGains.map(([title, text]) => (
              <Reveal className="gain-card" key={title}><h3>{title}</h3><p>{text}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="section container home-method" id="approche">
          <Reveal className="section-heading method-heading">
            <span className="eyebrow">{home.approach}</span>
            <h2 className="serif">{home.approachTitle}</h2>
            <p>{home.approachIntro}</p>
            <a className="button button-outline method-link" href={methodPath}>{home.discoverMethod}</a>
          </Reveal>
          <div className="steps">
            {site.homeMethod.map(([title, text], i) => (
              <Reveal className="step" key={title}>
                <span className="step-num">{i + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="section container home-sectors" id="secteurs">
          <div className="sector-section-heading">
            <span className="eyebrow">{home.sectors}</span>
          </div>
          <SectorExplorer
            sectors={site.sectors}
            descriptions={site.sectorDetails}
            headings={home.sectorHeadings}
            locale={locale}
            historicalExpertiseLabel={home.historicalSector}
          />
        </section>
        <section className="home-final-cta">
          <Reveal className="home-final-cta-content">
            <h2 className="serif">{home.finalCtaTitle}</h2>
            <p>{home.finalCtaText}</p>
            <div className="home-final-cta-actions">
              <a className="button" href={locale === "en" ? "/en/contact" : "/contact"}>{home.bookMeeting}<ArrowUpRight className="action-icon" size={14} aria-hidden="true" /></a>
              <a className="button button-outline" href="/maquette/Maquette_site_SARC_Consulting.pdf" download>
                {home.downloadBrochure}<ArrowDownToLine className="action-icon" size={14} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
