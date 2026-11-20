import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sarc-consulting.com";
  const pages = ["", "/cabinet", "/expertises", "/approche", "/secteurs", "/engagements", "/contact"];
  const englishPages = ["/en", "/en/about", "/en/expertise", "/en/approach", "/en/sectors", "/en/commitments", "/en/contact"];
  return [...pages, ...englishPages].map((page, index) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: index === 0 || index === pages.length ? 1 : 0.8,
  }));
}
