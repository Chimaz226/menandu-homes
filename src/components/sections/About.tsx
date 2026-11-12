import Image from "next/image";
import { site } from "@/content/site";
import { PricingPanel } from "../PricingPanel";
import { Reveal } from "../Reveal";
import { Container, SectionHeading } from "../ui";

export function About() {
  const { about, renders } = site;
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
                  <Image src={r.src} alt={r.alt} fill placeholder="blur" sizes="(min-width: 1024px) 28vw, 50vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Reveal className="mt-14">
          <PricingPanel className="mx-auto max-w-3xl" />
        </Reveal>
      </Container>
    </section>
  );
}
