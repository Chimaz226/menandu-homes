import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { animGateScript } from "@/lib/anim-gate";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["600", "700", "800"] });

const hero = site.renders.hero[0];
const ogImage = { url: hero.src.src, width: hero.src.width, height: hero.src.height, alt: hero.alt };

const title = `${site.company.name} | Luxury 4-Bedroom Terrace Duplexes, Chevy View Estate, Chevron`;
const description = `${site.project.description} Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron, Lagos. ₦499,000,000 per unit, 30% deposit with the balance over 5 months and 2 weeks.`;

export const metadata: Metadata = {
  // TODO: set to the production domain once confirmed, e.g. new URL("https://menanduhomes.com")
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title,
  description,
  openGraph: { title, description, type: "website", siteName: site.company.name, locale: "en_NG", images: [ogImage] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
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
