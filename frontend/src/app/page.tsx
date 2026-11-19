import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import Image from "next/image";
import { images } from "@/config/images";
import { site } from "@/content/site";

export default function Home() {
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"ProfessionalService",
    name:"SARC Consulting",
    address:{ "@type":"PostalAddress","addressLocality":"Dakar","addressCountry":"SN" },
    areaServed:"SN",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}} />
      <a className="skip-link" href="#main">Aller au contenu</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <span className="eyebrow">{site.hero.eyebrow}</span>
            <h1 className="serif">La conformité,<br /><span>en mouvement.</span></h1>
            <p>{site.hero.subtitle}</p>
            <div className="hero-actions">
              <a className="button" href="#expertises">Découvrir nos expertises ↗</a>
              <a className="button button-outline" href="#contact">Nous contacter</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <Image src={images.hero.src} alt={images.hero.alt} fill priority quality={90} sizes="(max-width:760px) 100vw,50vw" />
            </div>
          </div>
          <a className="hero-scroll" href="#cabinet">Défiler pour découvrir</a>
        </section>
        <div className="stats container">
          {site.stats.map((stat) => (
            <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small> — {stat.note}</small></div>
          ))}
        </div>
        <section className="section container cabinet" id="cabinet">
          <Reveal className="cabinet-aside">
            <span className="eyebrow">Le cabinet</span>
            <div className="cabinet-visual" aria-hidden="true">
              <span className="cabinet-visual-ring" />
              <svg viewBox="0 0 220 220" fill="none">
                <rect x="54" y="30" width="112" height="148" rx="5" stroke="currentColor" strokeWidth="2" />
                <path d="M78 66h64M78 88h48M78 110h34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="151" cy="151" r="37" fill="#f2b632" />
                <path d="m135 151 11 11 22-25" stroke="#0b1f3a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="cabinet-visual-caption">Exigences comprises <i /> Actions concrètes</span>
              <span className="cabinet-visual-index">01</span>
            </div>
          </Reveal>
          <Reveal className="cabinet-copy">
            <h2 className="serif">{site.cabinet.title}</h2>
            <p>{site.cabinet.text}</p>
            <a className="text-link" href="#approche">Notre manière d’accompagner ↗</a>
          </Reveal>
        </section>
        <section className="section team-section" id="equipe">
          <div className="container">
            <Reveal className="team-heading">
              <span className="eyebrow">Notre équipe</span>
              <h2 className="serif">Des expertises complémentaires, au plus près de vos enjeux.</h2>
              <p>Des profils engagés pour éclairer vos enjeux de conformité et faire avancer vos projets aux côtés de vos équipes.</p>
            </Reveal>
            <div className="team-grid">
              {site.teamMembers.map((member, index) => (
                <Reveal className="team-card-wrap" key={member.name}>
                  <details className="team-card">
                    <summary>
                      <span className="team-profile-visual">
                        {member.portrait ? (
                          <Image className="team-avatar" src={member.portrait} alt={`Portrait de ${member.name}`} width={160} height={160} sizes="(max-width:760px) 152px,160px" />
                        ) : (
                          <span className="team-avatar team-avatar-placeholder" role="img" aria-label={`Portrait à ajouter pour ${member.name}`}>{String(index + 1).padStart(2, "0")}</span>
                        )}
                        <span className="team-profile-overlay" aria-hidden="true">
                          <span className="team-profile-name">{member.name}</span>
                          <span className="team-profile-role">{member.role}</span>
                        </span>
                      </span>
                      <h3 className="team-profile-accessible-name">{member.name}</h3>
                      <span className="team-profile-accessible-role">{member.role}</span>
                      <span className="team-more"><span>En savoir plus</span><span className="team-more-icon" aria-hidden="true">+</span></span>
                    </summary>
                    <div className="team-bio"><p>{member.bio}</p></div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="section container expertise" id="expertises">
          <Reveal className="section-heading"><span className="eyebrow">Nos expertises</span><h2 className="serif">La rigueur au service de l’action.</h2><p>Des accompagnements conçus autour de vos obligations, de vos équipes et de votre réalité opérationnelle.</p></Reveal>
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
              <span className="expertise-symbol-caption">Rigueur <i /> Confiance <i /> Action</span>
            </div>
          </Reveal>
          <div className="expertise-grid">
            {site.expertises.map(([title, text], i) => (
              <Reveal className="expertise-card" key={title}><span className="card-num">{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="section container" id="approche">
          <Reveal className="section-heading"><span className="eyebrow">Notre approche</span><h2 className="serif">Du diagnostic à l’ancrage, avec méthode.</h2><p>Une démarche progressive, collaborative et pensée pour produire des avancées concrètes.</p></Reveal>
          <div className="steps">
            {site.approach.map(([title, subtitle, text], i) => (
              <Reveal className="step" key={title}><span className="step-num">{String(i+1).padStart(2,"0")} / {title}</span><h3>{subtitle}</h3><p>{text}</p></Reveal>
            ))}
          </div>
        </section>
        <section className="section container commitments" id="engagements">
          <Reveal><span className="eyebrow">Nos engagements</span><h2 className="serif">Un conseil exigeant. Une relation simple.</h2><p>Nous cherchons à faire progresser vos pratiques avec discernement et pragmatisme.</p></Reveal>
          <div className="commitment-grid">
            {site.commitments.map(([title,text],i)=><Reveal className="commitment" key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
          </div>
        </section>
        <section className="section container" id="secteurs">
          <Reveal className="section-heading"><span className="eyebrow">Secteurs d’intervention</span><h2 className="serif">Des contextes variés. Des enjeux singuliers.</h2><p>Les secteurs sont indicatifs et seront confirmés avec SARC Consulting.</p></Reveal>
          <div className="sector-grid">{site.sectors.map((sector,i)=><Reveal className="sector" key={sector}><span>{String(i+1).padStart(2,"0")}</span><h3>{sector}</h3></Reveal>)}</div>
        </section>
        <section className="section container contact" id="contact">
          <Reveal className="contact-copy"><span className="eyebrow">Entrons en conversation</span><h2 className="serif">Vos enjeux méritent un échange.</h2><p>Parlez-nous de votre contexte. Nous reviendrons vers vous pour comprendre vos besoins.</p><div className="contact-detail"><div><small>Nous trouver</small>{site.location}</div></div><div className="contact-detail"><div><small>Nous écrire</small>{site.email}</div></div></Reveal>
          <Reveal><ContactForm /></Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
