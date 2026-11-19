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
              <Image src={images.hero.src} alt={images.hero.alt} fill priority sizes="(max-width:760px) 100vw,50vw" style={{objectFit:"contain", padding:"20px"}} />
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
          <Reveal><span className="eyebrow">Le cabinet</span></Reveal>
          <Reveal className="cabinet-copy">
            <h2 className="serif">{site.cabinet.title}</h2>
            <p>{site.cabinet.text}</p>
            <a className="text-link" href="#approche">Notre manière d’accompagner ↗</a>
          </Reveal>
        </section>
        <section className="section container expertise" id="expertises">
          <Reveal className="section-heading"><span className="eyebrow">Nos expertises</span><h2 className="serif">La rigueur au service de l’action.</h2><p>Des accompagnements conçus autour de vos obligations, de vos équipes et de votre réalité opérationnelle.</p></Reveal>
          <Reveal className="expertise-figure"><Image src={images.expertises.src} alt={images.expertises.alt} width={1600} height={900} loading="lazy" /></Reveal>
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
