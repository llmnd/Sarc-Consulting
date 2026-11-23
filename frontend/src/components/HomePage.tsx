import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { images } from "@/config/images";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

export default function HomePage({ locale }: { locale: Locale }) {
  const site = locale === "en" ? siteEn : siteFr;
  const copy = ui[locale];
  const home = copy.home;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SARC Consulting",
    address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
    areaServed: "SN",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip-link" href="#main">{copy.skipLink}</a>
      <Header locale={locale} />
      <main id="main" tabIndex={-1}>
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <span className="eyebrow">{site.hero.eyebrow}</span>
            <h1 className="serif">{home.heroTitleFirst}{" "}<br /><span>{home.heroTitleSecond}</span></h1>
            <p>{site.hero.subtitle}</p>
            <div className="hero-actions">
              <a className="button" href="#expertises">{home.discoverExpertise} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></a>
              <a className="button button-outline" href="#contact">{home.contact}</a>
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
        <div className="stats container">
          {site.stats.map((stat) => (
            <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small> — {stat.note}</small></div>
          ))}
        </div>
        <section className="section container cabinet" id="cabinet">
          <Reveal className="cabinet-aside">
            <span className="eyebrow">{home.cabinet}</span>
            <div className="cabinet-visual" aria-hidden="true">
              <span className="cabinet-visual-ring" />
              <svg viewBox="0 0 220 220" fill="none">
                <rect x="54" y="30" width="112" height="148" rx="5" stroke="currentColor" strokeWidth="2" />
                <path d="M78 66h64M78 88h48M78 110h34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="151" cy="151" r="37" fill="#f2b632" />
                <path d="m135 151 11 11 22-25" stroke="#0b1f3a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="cabinet-visual-caption">{home.cabinetCaptionFirst} <i /> {home.cabinetCaptionSecond}</span>
              <span className="cabinet-visual-index">01</span>
            </div>
          </Reveal>
          <Reveal className="cabinet-copy">
            <h2 className="serif">{site.cabinet.title}</h2>
            <p>{site.cabinet.text}</p>
            <a className="text-link" href="#approche">{home.cabinetLink} <ArrowUpRight className="action-icon" size={14} strokeWidth={1.8} aria-hidden="true" /></a>
          </Reveal>
        </section>
        <section className="section team-section" id="equipe">
          <div className="container">
            <Reveal className="team-heading">
              <span className="eyebrow">{home.team}</span>
              <h2 className="serif">{home.teamTitle}</h2>
              <p>{home.teamIntro}</p>
            </Reveal>
            <div className="team-grid">
              {site.teamMembers.map((member, index) => (
                <Reveal className="team-card-wrap" key={member.name}>
                  <details className="team-card">
                    <summary>
                      <span className="team-profile-visual">
                        {member.portrait ? (
                          <Image className="team-avatar" src={member.portrait} alt={`${home.portraitAlt} ${member.name}`} width={160} height={160} sizes="(max-width:760px) 152px,160px" />
                        ) : (
                          <span className="team-avatar team-avatar-placeholder" role="img" aria-label={`${home.portraitPending} ${member.name}`}>
                            <svg aria-hidden="true" viewBox="0 0 160 160" className="team-avatar-placeholder-art">
                              <circle cx="80" cy="58" r="27" fill="#dfb6a6" />
                              <path d="M53 58c0-23 12-37 27-37 17 0 30 15 30 38-7-4-13-10-17-18-8 10-21 16-40 17Z" fill="#6e4a3d" />
                              <path d="M54 61c1 21 11 34 26 34 16 0 26-13 27-34-5 8-15 14-27 14-12 0-21-5-26-14Z" fill="#dfb6a6" />
                              <circle cx="69" cy="61" r="1.5" fill="#30343a" />
                              <circle cx="91" cy="61" r="1.5" fill="#30343a" />
                              <path d="M71 75c5 5 13 5 18 0" fill="none" stroke="#b66c63" strokeWidth="2" strokeLinecap="round" />
                              <path d="M30 160c3-34 21-54 50-54s47 20 50 54Z" fill="#173f6b" />
                              <path d="M62 107l18 20 18-20" fill="#fff" opacity=".9" />
                            </svg>
                          </span>
                        )}
                        <span className="team-profile-overlay" aria-hidden="true">
                          <span className="team-profile-name">{member.name}</span>
                          <span className="team-profile-role">{member.role}</span>
                        </span>
                      </span>
                      <h3 className="team-profile-accessible-name">{member.name}</h3>
                      <span className="team-profile-accessible-role">{member.role}</span>
                      <span className="team-more"><span>{home.learnMore}</span><span className="team-more-icon" aria-hidden="true">+</span></span>
                    </summary>
                    <div className="team-bio"><p>{member.bio}</p></div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="section container expertise" id="expertises">
          <Reveal className="section-heading"><span className="eyebrow">{home.expertise}</span><h2 className="serif">{home.expertiseTitle}</h2><p>{home.expertiseIntro}</p></Reveal>
          <Reveal className="expertise-symbol">
            <div className="expertise-symbol-art" aria-hidden="true">
              <span className="expertise-symbol-orbit" />
              <svg viewBox="0 0 240 240" fill="none">
                <path d="M120 25 181 48v51c0 47-26 82-61 103-35-21-61-56-61-103V48l61-23Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="M92 91h56M92 111h35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="151" cy="151" r="31" fill="#f2b632" />
                <path d="m137 151 10 10 19-22" stroke="#0b1f3a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="expertise-symbol-index">02</span>
              <span className="expertise-symbol-caption">{home.principles.split(" · ").map((label, index) => <span key={label}>{index > 0 && <i />} {label}</span>)}</span>
            </div>
          </Reveal>
          <div className="expertise-grid">
            {site.expertises.map(([title, text], i) => (
              <Reveal className="expertise-card" key={title}><span className="card-num">{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="section container" id="approche">
          <Reveal className="section-heading"><span className="eyebrow">{home.approach}</span><h2 className="serif">{home.approachTitle}</h2><p>{home.approachIntro}</p></Reveal>
          <div className="steps">
            {site.approach.map(([title, subtitle, text], i) => (
              <Reveal className="step" key={title}><span className="step-num">{String(i + 1).padStart(2, "0")} / {title}</span><h3>{subtitle}</h3><p>{text}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="section container commitments" id="engagements">
          <Reveal><span className="eyebrow">{home.commitments}</span><h2 className="serif">{home.commitmentsTitle}</h2><p>{home.commitmentsIntro}</p></Reveal>
          <div className="commitment-grid">
            {site.commitments.map(([title, text], i) => <Reveal className="commitment" key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
          </div>
        </section>
        <section className="section container" id="secteurs">
          <Reveal className="section-heading"><span className="eyebrow">{home.sectors}</span><h2 className="serif">{home.sectorsTitle}</h2><p>{home.sectorsIntro}</p></Reveal>
          <div className="sector-grid">{site.sectors.map((sector, i) => <Reveal className="sector" key={sector}><span>{String(i + 1).padStart(2, "0")}</span><h3>{sector}</h3></Reveal>)}</div>
        </section>
        <section className="section container contact" id="contact">
          <Reveal className="contact-copy"><span className="eyebrow">{home.contactEyebrow}</span><h2 className="serif">{home.contactTitle}</h2><p>{home.contactIntro}</p><div className="contact-detail"><div><small>{home.findUs}</small>{site.location}</div></div><div className="contact-detail"><div><small>{home.emailUs}</small>{site.email}</div></div></Reveal>
          <Reveal><ContactForm locale={locale} /></Reveal>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
