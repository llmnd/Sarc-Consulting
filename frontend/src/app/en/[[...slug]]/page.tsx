import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import LocalizedInteriorPage, { type InteriorPageId } from "@/components/LocalizedInteriorPage";
import { siteEn } from "@/content/site.en";

const pageBySlug = {
  about: "cabinet",
  expertise: "expertises",
  approach: "approach",
  sectors: "sectors",
  commitments: "commitments",
  contact: "contact",
} as const satisfies Record<string, InteriorPageId>;

const slugs = Object.keys(pageBySlug) as (keyof typeof pageBySlug)[];

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, ...slugs.map(slug => ({ slug: [slug] }))];
}

type RouteParams = { slug?: string[] };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const pageSlug = slug[0] as keyof typeof pageBySlug | undefined;
  if (!pageSlug) {
    return {
      title: "SARC Consulting | Compliance, in motion",
      description: siteEn.hero.subtitle,
      openGraph: { title: "SARC Consulting", description: siteEn.hero.subtitle, locale: "en_GB" },
    };
  }
  if (slug.length !== 1 || !Object.prototype.hasOwnProperty.call(pageBySlug, pageSlug)) return {};

  const pageId = pageBySlug[pageSlug];
  const page = siteEn.pages[pageId];
  return {
    title: `${page.eyebrow} | SARC Consulting`,
    description: page.intro,
    openGraph: { title: `${page.eyebrow} | SARC Consulting`, description: page.intro, locale: "en_GB" },
  };
}

export default async function EnglishPage({ params }: { params: Promise<RouteParams> }) {
  const { slug = [] } = await params;
  if (slug.length === 0) return <HomePage locale="en" />;
  if (slug.length !== 1 || !Object.prototype.hasOwnProperty.call(pageBySlug, slug[0])) notFound();

  const pageId = pageBySlug[slug[0] as keyof typeof pageBySlug];
  return <LocalizedInteriorPage pageId={pageId} locale="en" />;
}
