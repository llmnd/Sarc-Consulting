import type { Metadata } from "next";
import AiAutomationPage from "@/components/AiAutomationPage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata(
  "ai",
  "en",
  "AI & automation | SARC Consulting",
  "Automate processes with AI while keeping human control with SARC Consulting.",
);

export default function EnglishAiPage() {
  return <AiAutomationPage locale="en" />;
}
