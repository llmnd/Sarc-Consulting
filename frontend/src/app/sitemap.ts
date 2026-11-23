import type { MetadataRoute } from "next";
import { localizedRoutes, siteUrl } from "@/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(localizedRoutes).flatMap(({ fr, en }) => {
    const languages = {
      fr: `${siteUrl}${fr}`,
      en: `${siteUrl}${en}`,
      "x-default": `${siteUrl}${fr}`,
    };

    return [fr, en].map((path) => ({
      url: `${siteUrl}${path}`,
      alternates: { languages },
    }));
  });
}
