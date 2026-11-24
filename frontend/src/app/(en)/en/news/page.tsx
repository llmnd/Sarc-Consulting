import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import InteriorPage from "@/components/InteriorPage";
import { createPageMetadata } from "@/config/seo";

export const metadata: Metadata = createPageMetadata(
  "news",
  "en",
  "News | SARC Consulting",
  "Read the latest news and updates from SARC Consulting.",
);

export default function NewsPage() {
  return (
    <InteriorPage
      pageId="news"
      locale="en"
      eyebrow="News"
      title="Updates from SARC Consulting."
      intro="Find upcoming news, publications and updates to our services here."
    >
      <section className="section container">
        <Reveal className="page-note">
          <span className="eyebrow">Coming soon</span>
          <h2 className="serif">Our next publications will be announced here.</h2>
          <p>
            For press enquiries, contact our team at{" "}
            <a href="mailto:aissata.ba-seck@sarc-consulting.com">
              aissata.ba-seck@sarc-consulting.com
            </a>.
          </p>
        </Reveal>
      </section>
    </InteriorPage>
  );
}
