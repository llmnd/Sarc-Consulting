"use client";

import { useState } from "react";
import {
  Building2,
  CreditCard,
  Globe2,
  HeartPulse,
  Landmark,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/config/seo";

const sectorIcons: LucideIcon[] = [
  HeartPulse,
  Landmark,
  CreditCard,
  ShieldCheck,
  Building2,
  Globe2,
];

export default function SectorExplorer({
  sectors,
  descriptions,
  headings,
  locale,
  historicalExpertiseLabel,
}: {
  sectors: readonly string[];
  descriptions: readonly string[];
  headings: readonly string[];
  locale: Locale;
  historicalExpertiseLabel: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const SelectedIcon = sectorIcons[selectedIndex] ?? Building2;
  const selectedSector = sectors[selectedIndex];
  const selectedDescription = descriptions[selectedIndex];
  const selectedHeading = headings[selectedIndex] ?? selectedSector;

  return (
    <div className="sector-explorer">
      <h2 className="serif sector-section-title" key={`sector-heading-${selectedIndex}`} aria-live="polite">
        {selectedHeading}
      </h2>
      <div className="sector-list" role="group" aria-label={locale === "fr" ? "Choisir un secteur" : "Choose a sector"}>
        {sectors.map((sector, index) => {
          const Icon = sectorIcons[index] ?? Building2;
          const isSelected = selectedIndex === index;

          return (
            <button
              className={`sector-pill ${isSelected ? "featured" : ""}`}
              type="button"
              key={sector}
              aria-pressed={isSelected}
              aria-controls="sector-description"
              onClick={() => setSelectedIndex(index)}
            >
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>{sector}{index === 0 && <span className="sector-historical"> · {historicalExpertiseLabel}</span>}</span>
            </button>
          );
        })}
      </div>
      {selectedSector && selectedDescription && (
        <section
          className="sector-explorer-panel"
          id="sector-description"
          aria-labelledby="sector-panel-title"
          aria-live="polite"
          key={selectedIndex}
        >
          <div className="sector-panel-copy">
            <span className="sector-panel-kicker">{locale === "fr" ? "Notre expertise sectorielle" : "Our sector expertise"}</span>
            <h3 className="serif" id="sector-panel-title">{selectedSector}</h3>
            <p>{selectedDescription}</p>
          </div>
          <div className="sector-panel-visual" aria-hidden="true">
            <span className="sector-panel-orbit sector-panel-orbit-outer" />
            <span className="sector-panel-orbit sector-panel-orbit-inner" />
            <SelectedIcon className="sector-panel-icon" size={44} strokeWidth={1.25} />
            <span className="sector-panel-index">{String(selectedIndex + 1).padStart(2, "0")}</span>
          </div>
        </section>
      )}
    </div>
  );
}
