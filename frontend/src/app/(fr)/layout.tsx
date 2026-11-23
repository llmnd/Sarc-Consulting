import type { Metadata } from "next";
import { siteUrl } from "@/config/seo";
import SeoStructuredData from "@/components/SeoStructuredData";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SARC Consulting | Conseil en conformité et transformation à Dakar",
  description:
    "Cabinet de conseil basé à Dakar, SARC Consulting accompagne les organisations africaines en conformité réglementaire, gestion des obligations et transformation digitale.",
  openGraph: {
    siteName: "SARC Consulting",
    type: "website",
    locale: "fr_SN",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <SeoStructuredData locale="fr" />
        {children}
      </body>
    </html>
  );
}
