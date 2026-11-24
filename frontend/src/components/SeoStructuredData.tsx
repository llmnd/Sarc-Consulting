import { siteUrl } from "@/config/seo";
import type { Locale } from "@/config/seo";

export default function SeoStructuredData({ locale }: { locale: Locale }) {
  const knowsAbout = locale === "fr"
    ? [
        "Conformité réglementaire",
        "Gestion des obligations",
        "Transformation digitale",
        "Automatisation des opérations",
        "Accompagnement des équipes",
      ]
    : [
        "Regulatory compliance",
        "Obligations management",
        "Digital transformation",
        "Operational automation",
        "Team support",
      ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: locale === "fr" ? "SARC Consulting SAS" : "SARC Consulting",
      url: siteUrl,
      email: "aissata.ba-seck@sarc-consulting.com",
      telephone: "+221 76 973 52 44",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Villa n°23, Liberté 6 Extension",
        addressLocality: "Dakar",
        addressCountry: "SN",
      },
      areaServed: {
        "@type": "Place",
        name: "Africa",
      },
      knowsAbout,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "SARC Consulting",
      url: siteUrl,
      inLanguage: locale,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ];

  return (
    <>
      {structuredData.map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
