import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.sarc-consulting.com";
  const pages = ["", "/cabinet", "/expertises", "/approche", "/secteurs", "/engagements", "/contact"];
  return pages.map((page, index) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
