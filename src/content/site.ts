/**
 * ALL site copy lives here. Components only read from this file, so missing
 * client content can be dropped in without touching any component.
 *
 * Search for "TODO(client)" to find every value still waiting on Menandu Homes.
 * Fields left as `null` / "" are hidden on the page rather than shown empty.
 */

import type { StaticImageData } from "next/image";
import aerialView from "@/assets/renders/aerial-view.jpg";
import cornerCloseup from "@/assets/renders/corner-closeup.jpg";
import cornerView from "@/assets/renders/corner-view-unit-01.jpg";
import endUnit01 from "@/assets/renders/end-unit-01.jpg";
import endUnit05 from "@/assets/renders/end-unit-05.jpg";
import frontElevation from "@/assets/renders/front-elevation.jpg";
import firstEnd from "@/assets/plans/first-floor-end.png";
import firstFull from "@/assets/plans/first-floor-full.png";
import firstMid from "@/assets/plans/first-floor-mid.png";
import groundEnd from "@/assets/plans/ground-floor-end.png";
import groundFull from "@/assets/plans/ground-floor-full.png";
import groundMid from "@/assets/plans/ground-floor-mid.png";
import secondEnd from "@/assets/plans/second-floor-end.png";
import secondFull from "@/assets/plans/second-floor-full.png";
import secondMid from "@/assets/plans/second-floor-mid.png";

export type Render = { src: StaticImageData; alt: string };

export type Availability = "available" | "few-left" | "sold-out";

/** One of the five homes. Unit 01 is the end of the row; 02–05 share a layout. */
export type Unit = { id: "01" | "02" | "03" | "04" | "05"; type: "end" | "mid"; availability: Availability };

/** "mid" = units 02–05 (identical), "end" = unit 01, "full" = the whole row */
export type PlanView = "mid" | "end" | "full";

export type Room = { name: string; /** approx. size from the drawings, e.g. "4.6 × 7.3 m" */ size?: string };

export type FloorPlan = {
  id: string;
  title: string;
  /** Crops of the architectural drawing for each view */
  images: Record<PlanView, StaticImageData>;
  /** Room schedule per home type (the "full" view shows the mid-terrace list) */
  rooms: Record<Exclude<PlanView, "full">, Room[]>;
};

const whatsappNumber = "2348022330096"; // +234 802 233 0096, from the client's property profile (Nov 2026)

export const site = {
  company: {
    name: "Menandu Homes",
    tagline: "Luxury Real Estate • Property Development • Investment",
    slogan: "Your Dream Home. Your Smart Investment.",
    /** Transparent PNG, 829 × 457 */
    logo: "/brand/menandu-logo.png",
    // TODO(client): RC / registration number
    rcNumber: "",
    // TODO(client): year established, shown in the top bar next to the RC number
    established: "",
    // TODO(client): office address (project.address is the development site, not the office)
    officeAddress: "",
  },

  contact: {
    /** Telephone numbers from the client's property profile */
    phones: ["+234 803 321 9596", "+234 812 734 2050"],
    whatsappDisplay: "+234 802 233 0096",
    whatsappNumber,
    whatsappMessage:
      "Hello Menandu Homes, I'm interested in the 4-bedroom terrace duplexes at Plot 43A, Chevy View Estate, Chevron. Please send me more details.",
    // TODO(client): enquiry email address — email buttons stay hidden until this is set
    email: "",
    // TODO(client): Instagram handle without the @, e.g. "menanduhomes"
    instagram: "",
  },

  project: {
    /** Used for the page title, enquiry subjects and structured data */
    name: "Luxury Terrace Duplexes, Chevy View Estate",
    presenter: "Menandu Homes presents",
    title: "Five Exclusive Homes.\nOne Exceptional Address.",
    subtitle: "Luxury four-bedroom terrace duplexes, each with a Boys' Quarters (BQ).",
    slogan: "Premium Living. Exceptional Value. A Place to Call Home.",
    locationTag: "Chevy View Estate, Chevron · Lekki, Lagos",
    address: "Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron, Eti-Osa LGA, Lagos State, Nigeria",
    shortAddress: "Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron, Lagos",
    description:
      "An exclusive residential development of five luxury four-bedroom terrace duplexes, each with a Boys' Quarters, combining contemporary architecture, comfort, functionality and elegance.",
    // TODO(client): delivery date, e.g. "Q4 2027"
    deliveryDate: "",
    /** Bedroom count and BQ confirmed in the client's property profile */
    specsConfirmed: true,
  },

  pricing: {
    product: "4-bedroom terrace duplex + BQ",
    pricePerUnit: 499_000_000,
    priceInWords: "Four Hundred and Ninety-Nine Million Naira Only",
    /** Previous price shown struck through. null = hidden */
    oldPrice: null as number | null,
    totalUnits: 5,
    totalDevelopmentValue: 2_495_000_000,
  },

  // TODO(client): update availability as units sell ("available" | "few-left" | "sold-out")
  units: [
    { id: "01", type: "end", availability: "available" },
    { id: "02", type: "mid", availability: "available" },
    { id: "03", type: "mid", availability: "available" },
    { id: "04", type: "mid", availability: "available" },
    { id: "05", type: "mid", availability: "available" },
  ] as Unit[],

  /** Architectural renders supplied by the client (also kept in _assets/renders). */
  renders: {
    /** Hero slideshow, in order. `position` is the CSS object-position used when cropping. */
    hero: [
      { src: cornerView, alt: "Three-storey terrace development seen from the corner of unit 01, with grey fluted cladding and lit balconies", position: "70% center" },
      { src: frontElevation, alt: "Front elevation of units 02 to 05 with glass-balustrade balconies", position: "center" },
      { src: aerialView, alt: "Aerial view of the five homes and the gated, paved parking forecourt", position: "center" },
      { src: endUnit05, alt: "View along the terrace from unit 05", position: "60% center" },
      { src: cornerCloseup, alt: "Fluted cladding and warm-lit balconies at unit 01", position: "65% center" },
    ],
    about: [
      { src: aerialView, alt: "Aerial view of the five terrace homes with a paved, gated parking forecourt" },
      { src: frontElevation, alt: "Front elevation of units 02 to 05, each with glass-balustrade balconies on two floors" },
    ],
    gallery: [
      { src: cornerView, alt: "Corner view of the development from unit 01" },
      { src: frontElevation, alt: "Front elevation of units 02 to 05" },
      { src: aerialView, alt: "Aerial view of the development and parking forecourt" },
      { src: endUnit01, alt: "Street-facing side of end unit 01" },
      { src: cornerCloseup, alt: "Close-up of the fluted cladding and balconies at unit 01" },
      { src: endUnit05, alt: "View along the terrace from unit 05" },
    ],
  } satisfies { hero: (Render & { position: string })[]; about: Render[]; gallery: Render[] },

  about: {
    eyebrow: "Property Profile",
    heading: "Premium living. Exceptional value.",
    paragraphs: [
      "Menandu Homes proudly presents an exclusive residential development comprising five (5) units of luxury four-bedroom terrace duplexes, each with a Boys' Quarters (BQ), at Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron, Eti-Osa Local Government Area, Lagos State.",
      "Designed to combine contemporary architecture, comfort, functionality and elegance, this development offers an exceptional opportunity for homeowners and property investors seeking premium residential accommodation in a desirable location.",
      "Each home rises over three floors: open lounge and dining, kitchen, guest toilet and the BQ on the ground floor, with four bedrooms, including the master bedroom, across the two floors above.",
    ],
    highlights: [
      { value: "5", label: "Exclusive units" },
      { value: "4", label: "Bedrooms per unit" },
      { value: "1", label: "Boys' Quarters per unit" },
      { value: "3", label: "Floors per home" },
    ],
    detailsHeading: "Property details",
    details: [
      { label: "Development", value: "Five (5) units of terrace duplexes" },
      { label: "Bedrooms", value: "Four (4) bedrooms per unit" },
      { label: "Additional accommodation", value: "Boys' Quarters (BQ)" },
      { label: "Property type", value: "Luxury residential development" },
      { label: "Plot number", value: "43A" },
      { label: "Location", value: "Udeco Medical Road, Chevy View Estate, Chevron, Eti-Osa LGA, Lagos State" },
    ],
  },

  gallery: {
    eyebrow: "Gallery",
    heading: "See the homes",
    note: "Architectural renders. Final finishes may vary.",
  },

  floorPlans: {
    eyebrow: "The Layout",
    heading: "Floor plans",
    // TODO(client): add confirmed sqm per home type from the architect
    summary:
      "Three floors per home across a 34m × 8m building. Units 02–05 share one layout; unit 01 at the end of the row has a wider plan with a side terrace.",
    note: "Room sizes are approximate, measured from the architectural drawings.",
    views: [
      { id: "mid", label: "Terrace home", sub: "Units 02–05", unitIds: ["02", "03", "04", "05"] },
      { id: "end", label: "End home", sub: "Unit 01", unitIds: ["01"] },
      { id: "full", label: "Whole terrace", sub: "All five homes", unitIds: [] },
    ] as { id: PlanView; label: string; sub: string; /** sold-out ribbon shows when all of these units are sold */ unitIds: Unit["id"][] }[],
    plans: [
      {
        id: "ground",
        title: "Ground floor",
        images: { mid: groundMid, end: groundEnd, full: groundFull },
        rooms: {
          mid: [
            { name: "Lounge & dining", size: "4.6 × 7.3 m" },
            { name: "Kitchen", size: "2.7 m wide" },
            { name: "Boys' quarters (BQ)", size: "2.7 × 1.8 m" },
            { name: "BQ toilet" },
            { name: "Guest toilet" },
            { name: "Entrance & stairwell" },
          ],
          end: [
            { name: "Lounge & dining", size: "4.4 × 7.3 m" },
            { name: "Kitchen", size: "2.7 m wide" },
            { name: "Boys' quarters (BQ)", size: "2.7 × 1.95 m" },
            { name: "BQ toilet" },
            { name: "Guest toilet" },
            { name: "Entrance & stairwell" },
          ],
        },
      },
      {
        id: "first",
        title: "First floor",
        images: { mid: firstMid, end: firstEnd, full: firstFull },
        rooms: {
          mid: [
            { name: "Bedroom", size: "4.55 × 3.0 m" },
            { name: "Toilet", size: "1.8 × 1.8 m" },
            { name: "Bedroom", size: "4.6 × 4.8 m" },
            { name: "Toilet", size: "1.8 × 2.7 m" },
            { name: "Terrace", size: "4.6 × 0.9 m" },
          ],
          end: [
            { name: "Bedroom", size: "5.5 × 3.0 m" },
            { name: "Toilet", size: "1.5 m wide" },
            { name: "Bedroom", size: "6.0 × 4.0 m" },
            { name: "Toilet", size: "3.0 × 1.8 m" },
            { name: "Side terrace", size: "1.15 m wide" },
          ],
        },
      },
      {
        id: "second",
        title: "Second floor",
        images: { mid: secondMid, end: secondEnd, full: secondFull },
        rooms: {
          mid: [
            { name: "Bedroom", size: "4.6 × 3.0 m" },
            { name: "Toilet", size: "1.8 × 1.8 m" },
            { name: "Master bedroom", size: "4.6 × 4.8 m" },
            { name: "Toilet", size: "1.8 × 2.7 m" },
          ],
          end: [
            { name: "Bedroom", size: "5.5 × 3.0 m" },
            { name: "Toilet", size: "1.5 m wide" },
            { name: "Master bedroom", size: "6.0 × 4.0 m" },
            { name: "Toilet", size: "3.0 × 1.8 m" },
            { name: "Side terrace", size: "1.15 m wide" },
          ],
        },
      },
    ] as FloorPlan[],
  },

  location: {
    eyebrow: "Location Advantage",
    heading: "A desirable address on the Chevron–Lekki corridor",
    paragraphs: [
      "Strategically situated at Plot 43A, Udeco Medical Road, within Chevy View Estate, Chevron, this development enjoys a desirable residential address in the Eti-Osa axis of Lagos.",
      "Its location within the wider Chevron–Lekki corridor makes it an attractive choice for families, professionals and property investors seeking quality residential accommodation and long-term property value.",
    ],
    tags: ["Chevy View Estate", "Chevron–Lekki corridor", "Eti-Osa LGA, Lagos", "Long-term property value"],
    // TODO(client): nearby landmarks with rough travel times, e.g. { name: "Shoprite", distance: "5 min drive" }
    landmarks: [] as { name: string; distance: string }[],
    /** Google Maps search used for the embedded map */
    mapQuery: "Udeco Medical Road, Chevy View Estate, Chevron, Lekki, Lagos, Nigeria",
  },

  payment: {
    eyebrow: "Flexible Payment Plan",
    heading: "Own your home in 5 months and 2 weeks",
    intro: "Menandu Homes offers a flexible payment arrangement to make property ownership more convenient for prospective buyers.",
    duration: "5 months and 2 weeks",
    breakdown: [
      { label: "Initial deposit", percent: 30, amount: 149_700_000 },
      { label: "Outstanding balance", percent: 70, amount: 349_300_000 },
    ],
    total: 499_000_000,
    note: "The initial deposit of 30% secures the purchase, while the outstanding 70% balance is payable over a period of 5 months and 2 weeks from the date of the initial deposit.",
    steps: [
      { title: "Enquire & inspect", text: "Call or WhatsApp us to arrange a property inspection at Chevy View Estate." },
      { title: "Pay 30% deposit", text: "An initial deposit of ₦149,700,000 secures your unit." },
      { title: "Spread the balance", text: "Pay the 70% balance of ₦349,300,000 over 5 months and 2 weeks." },
      { title: "Own your home", text: "Complete the ₦499,000,000 purchase and take ownership." },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    items: [
      {
        q: "How much does a unit cost?",
        a: "Each unit is ₦499,000,000 (Four Hundred and Ninety-Nine Million Naira Only).",
      },
      {
        q: "What is the payment plan?",
        a: "A 30% initial deposit of ₦149,700,000 secures the purchase. The outstanding 70% balance of ₦349,300,000 is payable over 5 months and 2 weeks from the date of the initial deposit.",
      },
      {
        q: "Where is the development?",
        a: "Plot 43A, Udeco Medical Road, Chevy View Estate, Chevron, Eti-Osa Local Government Area, Lagos State, within the Chevron–Lekki corridor.",
      },
      {
        q: "What does each home include?",
        a: "Each unit is a luxury terrace duplex with four bedrooms and a Boys' Quarters (BQ), arranged over three floors with a lounge and dining area, kitchen and guest toilet on the ground floor.",
      },
      {
        q: "How many units are there?",
        a: "Five units in total. Contact us to check which units are still available.",
      },
      {
        q: "Is there parking?",
        a: "Yes. The site plan provides off-street parking within the gated compound.",
      },
      {
        q: "Can I inspect the property?",
        a: "Yes. Call +234 803 321 9596 or +234 812 734 2050, or WhatsApp +234 802 233 0096, to arrange an inspection, reservation or purchase.",
      },
    ],
  },

  contactSection: {
    eyebrow: "Contact Menandu Homes",
    heading: "Your dream home. Your smart investment.",
    text: "For enquiries, property inspections, reservations and purchase arrangements, call or WhatsApp our team.",
  },
};

export const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#floor-plans", label: "Floor Plans" },
  { href: "#location", label: "Location" },
  { href: "#payment", label: "Payment" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;

export const whatsappUrl = (message = site.contact.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mailtoUrl = () =>
  site.contact.email
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(`Enquiry: ${site.project.name}`)}`
    : null;

export const telUrl = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;

export const formatNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
