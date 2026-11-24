import type { Metadata } from "next";
import AiAutomationPage from "@/components/AiAutomationPage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata(
  "ai",
  "fr",
  "IA & automatisation | SARC Consulting",
  "Automatisez vos processus avec l'IA, sous contrôle humain, avec SARC Consulting.",
);

export default function AiPage() {
  return <AiAutomationPage locale="fr" />;
}
