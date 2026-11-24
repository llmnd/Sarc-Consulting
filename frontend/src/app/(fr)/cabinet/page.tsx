import type { Metadata } from "next";
import LocalizedInteriorPage from "@/components/LocalizedInteriorPage";
import { createPageMetadata } from "@/config/seo";
import { site } from "@/content/site";

export const metadata: Metadata = createPageMetadata(
  "cabinet",
  "fr",
  "À propos | SARC Consulting",
  site.pages.cabinet.intro,
);

export default function CabinetPage() {
  return <LocalizedInteriorPage pageId="cabinet" locale="fr" />;
}
