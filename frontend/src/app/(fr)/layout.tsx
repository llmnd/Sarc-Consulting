import type { Metadata, Viewport } from "next";
import SeoStructuredData from "@/components/SeoStructuredData";
import { siteUrl } from "@/config/seo";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: "SARC Consulting | Back-office conformité, juridique et IA à Dakar",
  description:
    "SARC Consulting SAS accompagne les entreprises en conformité, juridique, excellence opérationnelle et automatisation depuis Dakar.",
  openGraph: {
    siteName: "SARC Consulting",
    type: "website",
    locale: "fr_SN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function FrenchRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <SeoStructuredData locale="fr" />
        {children}
      </body>
    </html>
  );
}
