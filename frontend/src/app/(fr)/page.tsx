import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata(
  "home",
  "fr",
  "SARC Consulting | Back-office conformité, juridique et IA à Dakar",
  "SARC Consulting SAS accompagne les entreprises en conformité, juridique, excellence opérationnelle et automatisation depuis Dakar.",
);

export default function Home() {
  return <HomePage locale="fr" />;
}
