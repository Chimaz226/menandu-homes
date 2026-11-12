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

export type UnitType = {
  id: string;
  name: string;
  /** e.g. "4-bedroom terrace + BQ" */
  summary: string;
  unitCount: number;
  /** Naira, whole numbers. null = "Price on request" */
  price: number | null;
  /** Previous price shown struck through. null = hidden */
  oldPrice: number | null;
  availability: Availability;
};

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

const whatsappNumber = "2348127342050"; // +234 812 734 2050, from letterhead

export const site = {
  company: {
    name: "Menandu Homes",
    tagline: "Affordable Home Developers/Builders, Sales & Lease",
    /** Transparent PNG, 829 × 457 */
    logo: "/brand/menandu-logo.png",
    // TODO(client): RC / registration number — not shown on the letterhead
    rcNumber: "",
    // TODO(client): year established, shown in the top bar next to the RC number
    established: "",
    // TODO(client): full office address — letterhead photo cuts it off
    officeAddress: "",
  },

  contact: {
    phones: ["+234 803 321 9596", "+234 802 233 0096"],
    whatsappDisplay: "+234 812 734 2050",
    whatsappNumber,
    whatsappMessage:
      "Hello Menandu Homes, I'm interested in the 5-unit terrace development. Please send me more details.",
    // TODO(client): enquiry email address — email buttons stay hidden until this is set
    email: "",
    // TODO(client): Instagram handle without the @, e.g. "menanduhomes"
    instagram: "",
  },

  project: {
    // TODO(client): project/estate name, if different from the working title
    name: "Menandu Terraces",
    // TODO(client): area / city, e.g. "Lekki, Lagos"
    locationTag: "Location to be announced",
    headline: "Five terrace homes,\nbuilt for modern family living.",
    description:
      "A boutique development of five terrace homes, each with a generous lounge and dining space, a boys' quarters, en-suite bedrooms across two upper floors and dedicated parking.",
    // TODO(client): delivery date, e.g. "Q4 2027"
    deliveryDate: "",
    // TODO(client): full site address
    address: "",
    /** Flip to true once the architect confirms bed/bath counts per unit */
    specsConfirmed: false,
  },

  units: [
    {
      id: "end",
      name: "End Terrace",
      summary: "4 bedrooms + BQ, wider plan",
      unitCount: 1,
      price: null, // TODO(client)
      oldPrice: null,
      availability: "available", // TODO(client)
    },
    {
      id: "mid",
      name: "Terrace",
      summary: "4 bedrooms + BQ, front balconies",
      unitCount: 4,
      price: null, // TODO(client)
      oldPrice: null,
      availability: "available", // TODO(client)
    },
  ] as UnitType[],

  /** Architectural renders supplied by the client (also kept in _assets/renders). */
  renders: {
    hero: { src: cornerView, alt: "Three-storey terrace development seen from the corner of unit 01, with grey fluted cladding and lit balconies" },
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
  } satisfies { hero: Render; about: Render[]; gallery: Render[] },

  about: {
    eyebrow: "The Residence",
    heading: "Space for every part of family life.",
    paragraphs: [
      "Each home is arranged over three floors. The ground floor is given to living: an open lounge and dining area, a kitchen, a guest toilet and a self-contained boys' quarters with its own toilet.",
      "Upstairs, four bedrooms are split across the first and second floors, each with its own toilet, including a master bedroom on the second floor. Front bedrooms open onto glass-balustrade balconies under warm timber-lined soffits.",
    ],
    highlights: [
      { value: "5", label: "Homes in the development" },
      { value: "4", label: "Bedrooms per home" },
      { value: "3", label: "Floors per home" },
      { value: "7", label: "Parking spaces on site" },
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
      { id: "mid", label: "Terrace home", sub: "Units 02–05", unitId: "mid" },
      { id: "end", label: "End home", sub: "Unit 01", unitId: "end" },
      { id: "full", label: "Whole terrace", sub: "All five homes", unitId: null },
    ] as { id: PlanView; label: string; sub: string; /** links to units[].id for the sold-out ribbon */ unitId: string | null }[],
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
    eyebrow: "Location",
    heading: "Where you'll live",
    // TODO(client): a short paragraph about the neighbourhood
    description:
      "Full address and neighbourhood details are coming soon. Message us on WhatsApp for the site location and to arrange an inspection.",
    // TODO(client): nearby landmarks with rough travel times, e.g. { name: "Shoprite", distance: "5 min drive" }
    landmarks: [] as { name: string; distance: string }[],
    // TODO(client): Google Maps embed query (address or "lat,lng"). Empty = map hidden.
    mapQuery: "",
  },

  payment: {
    eyebrow: "Payment Plan",
    heading: "Flexible ways to own your home",
    intro:
      "Outright and instalment options are available. Full payment terms will be confirmed on enquiry.",
    // TODO(client): real payment structure. Placeholder steps below describe the
    // purchase process only and contain no figures.
    steps: [
      { title: "Enquire", text: "Message us on WhatsApp to request the price list and payment terms." },
      { title: "Inspect", text: "Book a visit to the site and review the floor plans with our team." },
      { title: "Reserve", text: "Secure your preferred unit with an initial deposit." },
      { title: "Complete", text: "Pay the balance outright or on an agreed instalment plan." },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Frequently asked questions",
    // TODO(client): confirm or replace these answers
    items: [
      {
        q: "How many bedrooms does each home have?",
        a: "Each home has four bedrooms, each with its own toilet, plus a boys' quarters with its own toilet on the ground floor. Final specifications will be confirmed by the architect.",
      },
      {
        q: "Is there parking?",
        a: "Yes. The site plan provides off-street parking spaces within the compound.",
      },
      {
        q: "Can I pay in instalments?",
        a: "Yes, instalment plans are available. Contact us on WhatsApp for the current payment terms.",
      },
      {
        q: "Can I inspect the site?",
        a: "Yes. Message us on WhatsApp or call to book an inspection.",
      },
      {
        q: "Do you also lease properties?",
        a: "Yes. Menandu Homes handles development, sales and leasing. Ask us about lease options.",
      },
    ],
  },

  contactSection: {
    eyebrow: "Contact",
    heading: "Let's talk about your new home",
    text: "Our team is available to answer questions, share the price list and arrange site inspections.",
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
