import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SARC Consulting | La conformité, en mouvement",
  description: "Cabinet de conseil à Dakar spécialisé en conformité réglementaire, gestion des obligations et transformation digitale.",
  openGraph: {
    title: "SARC Consulting",
    description: "La conformité, en mouvement.",
    type: "website",
    locale: "fr_SN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
