import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.company.name}: 4-Bedroom Terrace Duplexes, Chevron, Lekki`,
    short_name: site.company.name,
    description: site.project.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#024d87",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
