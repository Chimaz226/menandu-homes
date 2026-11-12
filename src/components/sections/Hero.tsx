import Image from "next/image";
import { site } from "@/content/site";
import { CalendarIcon, ChevronDownIcon, PinIcon } from "../icons";
import { PricingPanel } from "../PricingPanel";
import { Container, EmailButton, WhatsAppButton } from "../ui";

/** Full-bleed render with copy and pricing overlaid. Motion hooks (data-hero-*) are driven by Animations.tsx. */
export function Hero() {
  const { project, company, renders } = site;
  return (
    <section id="home" className="relative isolate flex min-h-[min(calc(100svh-72px),48rem)] items-end overflow-hidden md:min-h-[min(calc(100svh-112px),56rem)]">
      {/* Image is never hidden (it's the LCP element); GSAP only zooms and parallaxes it. */}
      <div data-hero-bg className="absolute inset-0 -z-20 will-change-transform">
        <Image src={renders.hero.src} alt={renders.hero.alt} fill preload placeholder="blur" sizes="100vw" className="object-cover object-[70%_center]" />
      </div>
      {/* Scrim keeps white text readable over the bright sky in the render. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-primary-dark/95 via-brand-primary-dark/60 to-brand-primary-dark/10 lg:bg-gradient-to-r lg:from-brand-primary-dark/90 lg:from-10% lg:via-brand-primary-dark/45 lg:via-45% lg:to-transparent lg:to-70%" />

      <Container className="grid gap-10 pb-16 pt-32 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:pb-20">
        <div className="text-white">
          <p data-hero-item className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden />
            {project.locationTag}
          </p>
          <h1 data-hero-item className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{project.name}</h1>
          <p data-hero-item className="mt-2 text-sm font-semibold text-white/70">by {company.name}</p>
          <p data-hero-item className="mt-6 whitespace-pre-line font-display text-xl font-bold leading-snug sm:text-2xl">{project.headline}</p>
          <p data-hero-item className="mt-4 max-w-xl leading-relaxed text-white/80">{project.description}</p>

          {(project.deliveryDate || project.address) && (
            <ul data-hero-item className="mt-6 space-y-2 text-sm text-white/90">
              {project.deliveryDate && (
                <li className="flex items-center gap-2">
                  <CalendarIcon className="text-brand-accent" /> Delivery: {project.deliveryDate}
                </li>
              )}
              {project.address && (
                <li className="flex items-center gap-2">
                  <PinIcon className="text-brand-accent" /> {project.address}
                </li>
              )}
            </ul>
          )}

          <div data-hero-item className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton />
            <EmailButton invert />
          </div>
        </div>

        <div data-hero-panel className="w-full max-w-md lg:justify-self-end">
          <PricingPanel />
        </div>
      </Container>

      <a
        href="#about"
        className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white lg:flex"
      >
        Scroll
        <ChevronDownIcon className="mt-1 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  );
}
