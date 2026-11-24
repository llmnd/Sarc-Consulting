import type { Metadata } from "next";

export const siteUrl = "https://www.sarc-consulting.com";

export const localizedRoutes = {
  home: { fr: "/", en: "/en" },
  cabinet: { fr: "/a-propos", en: "/en/about" },
  expertises: { fr: "/prestations", en: "/en/expertise" },
  approach: { fr: "/methode", en: "/en/approach" },
  sectors: { fr: "/secteurs", en: "/en/sectors" },
  commitments: { fr: "/engagements", en: "/en/commitments" },
  news: { fr: "/actualites", en: "/en/news" },
  contact: { fr: "/contact", en: "/en/contact" },
  ai: { fr: "/ia-automatisation", en: "/en/ai-automation" },
} as const;

export type SeoPage = keyof typeof localizedRoutes;
export type Locale = "fr" | "en";

export function createPageMetadata(
  page: SeoPage,
  locale: Locale,
  title: string,
  description: string,
): Metadata {
  const paths = localizedRoutes[page];
  const canonicalPath = paths[locale];
  const openGraphLocale = locale === "fr" ? "fr_SN" : "en_GB";
  const alternateLocale = locale === "fr" ? "en_GB" : "fr_SN";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        fr: paths.fr,
        en: paths.en,
        "x-default": paths.fr,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: "SARC Consulting",
      locale: openGraphLocale,
      alternateLocale: [alternateLocale],
      type: "website",
      images: [
        {
          url: "/images/sarc-maquette-team.png",
          alt: locale === "fr"
            ? "L’équipe de SARC Consulting échange autour d’une tablette"
            : "The SARC Consulting team discusses a project around a tablet",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/sarc-maquette-team.png"],
    },
  };
}
