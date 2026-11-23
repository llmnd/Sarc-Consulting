import type { Metadata } from "next";

export const siteUrl = "https://www.sarc-consulting.com";

export const localizedRoutes = {
  home: { fr: "/", en: "/en" },
  cabinet: { fr: "/cabinet", en: "/en/about" },
  expertises: { fr: "/expertises", en: "/en/expertise" },
  approach: { fr: "/approche", en: "/en/approach" },
  sectors: { fr: "/secteurs", en: "/en/sectors" },
  commitments: { fr: "/engagements", en: "/en/commitments" },
  contact: { fr: "/contact", en: "/en/contact" },
} as const;

type SeoPage = keyof typeof localizedRoutes;
type Locale = "fr" | "en";

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
        "fr-SN": paths.fr,
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
          url: "/images/sarc-hero-team.jpg",
          alt: "L’équipe de SARC Consulting échange autour d’une tablette",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/sarc-hero-team.jpg"],
    },
  };
}
