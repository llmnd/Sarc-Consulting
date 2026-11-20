import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SARC Consulting | La conformité, en mouvement",
  description: "Entreprise africaine de conseil basée à Dakar, SARC Consulting porte une expertise made in Africa en conformité et transformation.",
  openGraph: {
    title: "SARC Consulting",
    description: "Une expertise made in Africa, une ambition panafricaine.",
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
