import Image from "next/image";
import { formatNaira, site } from "@/content/site";
import { PricingPanel } from "../PricingPanel";
import { Reveal } from "../Reveal";
import { Container, SectionHeading } from "../ui";

export function About() {
  const { about, renders, pricing } = site;
  return (
    <section id="about" className="overflow-hidden py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading eyebrow={about.eyebrow} heading={about.heading} />
            </Reveal>
            <Reveal className="mt-6 space-y-4 leading-relaxed text-brand-ink/75">
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
            <dl data-stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {about.highlights.map((h) => (
                <div key={h.label} className="rounded-2xl bg-brand-surface p-4">
                  <dt className="sr-only">{h.label}</dt>
                  <dd>
                    <span data-count={h.value} className="block font-display text-3xl font-extrabold tabular-nums text-brand-primary">
                      {h.value}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-brand-ink/60">{h.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Renders wipe open, then drift at different speeds while scrolling. */}
          <div className="grid grid-cols-2 gap-4 self-start">
            {renders.about.map((r, i) => (
              <div
                key={r.alt}
                data-clip
                className={`relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5 ${i === 1 ? "mt-12" : ""}`}
              >
                <div data-parallax={i === 0 ? 8 : 14} className="absolute inset-x-0 -inset-y-[15%]">
                  <Image src={r.src} alt={r.alt} fill placeholder="blur" sizes="(min-width: 1024px) 28vw, 50vw" quality={90} className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-3xl bg-brand-surface p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold text-brand-primary">{about.detailsHeading}</h3>
            <dl className="mt-4 divide-y divide-black/10">
              {about.details.map((d) => (
                <div key={d.label} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-sm text-brand-ink/60">{d.label}</dt>
                  <dd className="font-medium text-brand-ink">{d.value}</dd>
                </div>
              ))}
              <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <dt className="text-sm text-brand-ink/60">Total development value</dt>
                <dd className="font-medium text-brand-ink">
                  {formatNaira(pricing.totalDevelopmentValue)} <span className="text-sm text-brand-ink/50">({pricing.totalUnits} units)</span>
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal className="self-start">
            <PricingPanel />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
