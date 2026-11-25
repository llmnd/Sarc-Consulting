import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import InteriorPage from "@/components/InteriorPage";
import Reveal from "@/components/Reveal";
import TimeSavingsSimulator from "@/components/TimeSavingsSimulator";
import { site as siteFr } from "@/content/site";
import { siteEn } from "@/content/site.en";
import { ui, type Locale } from "@/content/ui";

export default function AiAutomationPage({ locale }: { locale: Locale }) {
  const site = locale === "en" ? siteEn : siteFr;
  const page = site.aiAutomation;
  const copy = ui[locale];
  const contactPath = locale === "en" ? "/en/contact" : "/contact";

  return (
    <InteriorPage
      pageId="ai"
      locale={locale}
      eyebrow={page.heroEyebrow}
      title={page.heroTitle}
      intro={page.heroIntro}
      showContactCta={false}
      heroActions={
        <>
          <Link className="button" href={contactPath}>
            {page.bookAssessment}
            <ArrowUpRight className="action-icon" size={14} aria-hidden="true" />
          </Link>
          <a className="button button-outline" href="#ai-use-cases">
            {page.viewUseCases}
          </a>
        </>
      }
    >
      <section className="section container ai-use-cases" id="ai-use-cases">
        <Reveal className="section-heading">
          <span className="eyebrow">{page.useCasesEyebrow}</span>
          <h2 className="serif" id="ai-use-cases-title">{page.useCasesTitle}</h2>
        </Reveal>
        <Reveal className="ai-table-wrap">
          <table className="ai-use-cases-table" aria-labelledby="ai-use-cases-title">
            <thead>
              <tr>
                {page.useCaseColumns.map((column) => <th scope="col" key={column}>{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {page.useCases.map((useCase) => (
                <tr key={useCase.title}>
                  <th scope="row">{useCase.title}</th>
                  <td data-label={page.useCaseColumns[1]}>{useCase.action}</td>
                  <td data-label={page.useCaseColumns[2]}>{useCase.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <TimeSavingsSimulator locale={locale} />

      <section className="section page-soft ai-formulas">
        <div className="container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.formulasEyebrow}</span>
            <h2 className="serif">{page.formulasTitle}</h2>
          </Reveal>
          <div className="ai-formula-grid">
            {page.formulas.map((formula, index) => (
              <Reveal className="ai-formula-card" key={formula.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{formula.title}</h3>
                <p>{formula.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section ai-guarantees" style={{ backgroundColor: "#0E1D3C" }}>
        <div className="container">
          <Reveal className="section-heading">
            <span className="eyebrow">{page.guaranteesEyebrow}</span>
            <h2 className="serif">{page.guaranteesTitle}</h2>
          </Reveal>
          <div className="ai-guarantee-grid">
            {page.guarantees.map((guarantee) => (
              <Reveal className="ai-guarantee" key={guarantee.title}>
                <h3>{guarantee.title}</h3>
                <p>{guarantee.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="page-cta ai-final-cta">
        <div className="page-cta-content">
          <span className="eyebrow">{copy.interiorCtaEyebrow}</span>
          <h2 className="serif">{copy.home.finalCtaTitle}</h2>
          <p>{copy.home.finalCtaText}</p>
          <div className="page-cta-actions">
            <Link className="button" href={contactPath}>
              {copy.home.bookMeeting}
              <ArrowUpRight className="action-icon" size={14} aria-hidden="true" />
            </Link>
            <a className="button button-outline" href="/maquette/Maquette_site_SARC_Consulting.pdf" download>
              {copy.home.downloadBrochure}
              <ArrowDownToLine className="action-icon" size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </InteriorPage>
  );
}
