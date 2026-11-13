import { Animations } from "@/components/Animations";
import { Navbar } from "@/components/Navbar";
import { TopBar } from "@/components/TopBar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { FloorPlans } from "@/components/sections/FloorPlans";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Payment } from "@/components/sections/Payment";
import { site } from "@/content/site";

const siteAddress = {
  "@type": "PostalAddress",
  streetAddress: "Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron",
  addressLocality: "Eti-Osa",
  addressRegion: "Lagos State",
  addressCountry: "NG",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      name: site.company.name,
      slogan: site.company.slogan,
      description: site.company.tagline,
      telephone: [...site.contact.phones, site.contact.whatsappDisplay],
      ...(site.contact.email && { email: site.contact.email }),
    },
    {
      "@type": "RealEstateListing",
      name: site.project.name,
      description: site.project.description,
      contentLocation: { "@type": "Place", name: "Chevy View Estate, Chevron", address: siteAddress },
      offers: {
        "@type": "Offer",
        price: site.pricing.pricePerUnit,
        priceCurrency: "NGN",
        availability: site.units.some((u) => u.availability !== "sold-out") ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        seller: { "@type": "RealEstateAgent", name: site.company.name },
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <FloorPlans />
        <Location />
        <Payment />
        <Faq />
        <Contact />
      </main>
      <Animations />
    </>
  );
}
