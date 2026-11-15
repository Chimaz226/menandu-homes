import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/** One-page site: a single URL, with the renders listed so they can appear in Google Images. */
export default function sitemap(): MetadataRoute.Sitemap {
  const images = [...new Set([...site.renders.hero, ...site.renders.gallery].map((r) => absoluteUrl(r.src.src)))];
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-11-15"),
      changeFrequency: "weekly",
      priority: 1,
      images,
    },
  ];
}
