import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // 75 = default; 90 is used for the architectural renders so they stay crisp.
    qualities: [75, 90],
    // WebP only: AVIF is noticeably heavier to decode on budget Android phones.
    formats: ["image/webp"],
  },
  partialPrefetching: true,
  turbopack: {
    // A stray pnpm-lock.yaml in the user home folder confuses root detection.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
