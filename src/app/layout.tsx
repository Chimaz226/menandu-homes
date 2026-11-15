import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { animGateScript } from "@/lib/anim-gate";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin", "latin-ext"], weight: ["600", "700", "800"] });

/*
 * Search targets: people looking for property to buy in Chevron / Lekki, e.g.
 * "4 bedroom terrace duplex for sale in Chevron", "houses for sale in Lekki",
 * "Chevy View Estate". Title stays under ~65 characters so Google shows it whole.
 * The share image comes from app/opengraph-image.jpg (file convention).
 */
const title = "4-Bedroom Terrace Duplex for Sale in Chevron, Lekki | Menandu Homes";
const description =
  "Five luxury 4-bedroom terrace duplexes with BQ for sale at Plot 43A, Chevy View Estate, Chevron, Lekki, Lagos. ₦499m per unit, 30% deposit, balance over 5½ months.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${site.company.name}` },
  description,
  applicationName: site.company.name,
  keywords: [
    "4 bedroom terrace duplex for sale",
    "terrace duplex for sale in Chevron",
    "houses for sale in Lekki",
    "property for sale in Chevron Lekki",
    "Chevy View Estate",
    "Chevron Lekki",
    "Eti-Osa real estate",
    "Lagos real estate",
    "duplex with BQ for sale Lagos",
    "luxury homes for sale Lagos",
    "Menandu Homes",
  ],
  authors: [{ name: site.company.name }],
  creator: site.company.name,
  publisher: site.company.name,
  category: "real estate",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.company.name,
    locale: "en_NG",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the code from Google Search Console (HTML tag method) into this env var on Vercel.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  other: {
    "geo.region": "NG-LA",
    "geo.placename": "Chevron, Lekki, Lagos",
  },
};

export const viewport: Viewport = {
  themeColor: "#024d87",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline gate script adds classes to <html> before React hydrates.
    <html lang="en-NG" className={`${inter.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: animGateScript }} />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
