import { site } from "@/content/site";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/**
 * schema.org JSON-LD for search engines: the developer, the website, the
 * property listing (with price, address and the homes on offer) and the FAQ.
 * Everything is derived from content/site.ts so it stays in sync with the page.
 */
export function buildStructuredData() {
  const { company, contact, project, pricing, units, faq, renders, about } = site;
  const orgId = `${siteUrl}/#organization`;
  const listingId = `${siteUrl}/#listing`;
  const placeId = `${siteUrl}/#place`;

  const address = {
    "@type": "PostalAddress",
    streetAddress: "Plot 43A, Udeco Medical Road, Chevy View Estate",
    addressLocality: "Chevron, Lekki",
    addressRegion: "Lagos State",
    addressCountry: "NG",
  };

  const images = [...new Set([...renders.hero, ...renders.gallery].map((r) => absoluteUrl(r.src.src)))];
  const available = units.some((u) => u.availability !== "sold-out");
  const phone = (p: string) => p.replace(/\s+/g, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": orgId,
        name: company.name,
        url: `${siteUrl}/`,
        logo: absoluteUrl(company.logoPng),
        image: images[0],
        slogan: company.slogan,
        description: company.tagline,
        telephone: phone(contact.phones[0]),
        ...(contact.email && { email: contact.email }),
        areaServed: [
          { "@type": "Place", name: "Chevron, Lekki, Lagos" },
          { "@type": "AdministrativeArea", name: "Eti-Osa, Lagos State" },
          { "@type": "City", name: "Lagos" },
        ],
        contactPoint: [
          ...contact.phones.map((p) => ({ "@type": "ContactPoint", telephone: phone(p), contactType: "sales", areaServed: "NG", availableLanguage: "English" })),
          { "@type": "ContactPoint", telephone: phone(contact.whatsappDisplay), contactType: "sales", contactOption: "WhatsApp", areaServed: "NG" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: company.name,
        inLanguage: "en-NG",
        publisher: { "@id": orgId },
      },
      {
        "@type": "Place",
        "@id": placeId,
        name: "Chevy View Estate, Chevron, Lekki",
        address,
      },
      {
        "@type": "RealEstateListing",
        "@id": listingId,
        url: `${siteUrl}/`,
        name: "4-Bedroom Terrace Duplexes with BQ for Sale, Chevy View Estate, Chevron, Lekki",
        description: about.paragraphs.slice(0, 2).join(" "),
        image: images,
        datePosted: "2026-11-13",
        inLanguage: "en-NG",
        provider: { "@id": orgId },
        contentLocation: { "@id": placeId },
        offers: {
          "@type": "Offer",
          price: pricing.pricePerUnit,
          priceCurrency: "NGN",
          availability: available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          businessFunction: "http://purl.org/goodrelations/v1#Sell",
          seller: { "@id": orgId },
          eligibleQuantity: { "@type": "QuantitativeValue", value: units.filter((u) => u.availability !== "sold-out").length },
          itemOffered: {
            "@type": "House",
            name: `${pricing.product}, ${project.locationTag}`,
            numberOfBedrooms: 4,
            accommodationCategory: "Terrace duplex",
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Boys' Quarters (BQ)", value: true },
              { "@type": "LocationFeatureSpecification", name: "Off-street parking", value: true },
            ],
            address,
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
