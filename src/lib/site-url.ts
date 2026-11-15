/**
 * Absolute base URL of the live site, used for canonical links, the sitemap,
 * robots.txt and structured data.
 *
 * Set NEXT_PUBLIC_SITE_URL (e.g. "https://menanduhomes.com") once a custom
 * domain is connected. Until then Vercel's production URL is used, which is the
 * same fallback Next.js applies to metadata.
 */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
})();

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`);
