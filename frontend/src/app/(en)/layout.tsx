import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SeoStructuredData from "@/components/SeoStructuredData";
import { siteUrl } from "@/config/seo";
import { siteEn } from "@/content/site.en";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: "SARC Consulting | Compliance, in motion",
  description: siteEn.hero.subtitle,
  openGraph: {
    siteName: "SARC Consulting",
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function EnglishRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SeoStructuredData locale="en" />
        {children}
      </body>
    </html>
  );
}
