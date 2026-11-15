import { site } from "@/content/site";
import { CalendarIcon, ChevronDownIcon, PinIcon } from "../icons";
import { HeroSlideshow } from "../HeroSlideshow";
import { PricingPanel } from "../PricingPanel";
import { Container, EmailButton, WhatsAppButton } from "../ui";

/** Full-bleed render slideshow with copy and pricing overlaid. Copy is never animated in, so it paints instantly; data-hero-bg gets a scroll parallax from Animations.tsx. */
export function Hero() {
  const { project, renders } = site;
  return (
    <section id="home" className="relative isolate flex min-h-[min(calc(100svh-72px),52rem)] items-end overflow-hidden md:min-h-[min(calc(100svh-112px),58rem)]">
      {/* Images are never hidden (the first is the LCP element); GSAP only parallaxes this layer. */}
      <div data-hero-bg className="absolute inset-0 -z-20 will-change-transform">
        <HeroSlideshow slides={renders.hero} />
      </div>
      {/* Scrim keeps white text readable over the bright sky in the renders. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-brand-primary-dark/95 via-brand-primary-dark/60 to-brand-primary-dark/10 lg:bg-gradient-to-r lg:from-brand-primary-dark/90 lg:from-10% lg:via-brand-primary-dark/45 lg:via-45% lg:to-transparent lg:to-70%" />

      <Container className="grid gap-10 pb-16 pt-28 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:pb-20">
        <div className="text-white">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/25 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-accent" aria-hidden />
            {project.locationTag}
          </p>
          {/* The h1 carries the search phrase visibly (small line) plus the client's headline. */}
          <h1>
            <span className="block text-xs font-semibold uppercase leading-relaxed tracking-[0.2em] text-brand-accent sm:text-sm">{project.seoHeading}</span>
            <span className="mt-3 block whitespace-pre-line font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </span>
          </h1>
          <p className="mt-5 font-display text-lg font-bold leading-snug sm:text-xl">
            {project.subtitle}
          </p>
          <p className="mt-2 max-w-xl leading-relaxed text-white/80">
            {project.slogan}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/90">
            <li className="flex items-start gap-2">
              <PinIcon className="mt-0.5 shrink-0 text-brand-accent" /> {project.shortAddress}
            </li>
            {project.deliveryDate && (
              <li className="flex items-center gap-2">
                <CalendarIcon className="text-brand-accent" /> Delivery: {project.deliveryDate}
              </li>
            )}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsAppButton />
            <EmailButton invert />
          </div>
        </div>

        <div className="w-full max-w-md lg:justify-self-end">
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
