import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata(
  "home",
  "fr",
  "SARC Consulting | Conseil en conformité et transformation à Dakar",
  "Cabinet de conseil basé à Dakar, SARC Consulting accompagne les organisations africaines en conformité réglementaire, gestion des obligations et transformation digitale.",
);

export default function Home() {
  return <HomePage locale="fr" />;
}
