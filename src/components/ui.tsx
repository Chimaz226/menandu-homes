import type { ReactNode } from "react";
import { mailtoUrl, whatsappUrl } from "@/content/site";
import { MailIcon, WhatsAppIcon } from "./icons";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

/** Eyebrow label + bold heading: the convention used by every section. */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "left",
  invert = false,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
          invert ? "text-brand-accent" : "text-brand-primary-light"
        }`}
      >
        <span className="h-px w-6 bg-current" aria-hidden />
        {eyebrow}
      </p>
      <h2
        data-split
        className={`font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${
          invert ? "text-white" : "text-brand-primary"
        }`}
      >
        {heading}
      </h2>
      {intro && <p className={`mt-4 text-base leading-relaxed ${invert ? "text-white/80" : "text-brand-ink/70"}`}>{intro}</p>}
    </div>
  );
}

const btn =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-light";

export function WhatsAppButton({ label = "Chat on WhatsApp", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={`${btn} bg-brand-primary-light text-white hover:bg-brand-primary ${className}`}>
      <WhatsAppIcon />
      {label}
    </a>
  );
}

/** Renders nothing until an enquiry email is set in content/site.ts. */
export function EmailButton({ invert = false, className = "" }: { invert?: boolean; className?: string }) {
  const href = mailtoUrl();
  if (!href) return null;
  return (
    <a
      href={href}
      className={`${btn} border ${
        invert ? "border-white/60 text-white hover:bg-white/10" : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
      } ${className}`}
    >
      <MailIcon />
      Email us
    </a>
  );
}

/** Red diagonal "SOLD OUT" ribbon. Parent must be `relative overflow-hidden`. */
export function SoldOutRibbon() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-label="Sold out">
      <span className="w-[160%] -rotate-[20deg] bg-brand-sold/90 py-2 text-center font-display text-lg font-extrabold uppercase tracking-[0.35em] text-white shadow-lg">
        Sold out
      </span>
    </div>
  );
}
