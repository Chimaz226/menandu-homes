import { site } from "@/content/site";
import { PinIcon } from "../icons";
import { Reveal } from "../Reveal";
import { Container, SectionHeading, WhatsAppButton } from "../ui";

export function Location() {
  const { location, project } = site;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.mapQuery)}`;

  return (
    <section id="location" className="bg-brand-surface py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <SectionHeading eyebrow={location.eyebrow} heading={location.heading} />
          </Reveal>
          <Reveal className="mt-6 space-y-4 leading-relaxed text-brand-ink/75">
            {location.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal className="mt-6 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
              <PinIcon />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-ink/50">Site address</span>
              <span className="block font-semibold text-brand-primary">{project.address}</span>
            </span>
          </Reveal>

          <ul data-stagger className="mt-5 flex flex-wrap gap-2">
            {location.tags.map((t) => (
              <li key={t} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-primary ring-1 ring-brand-primary/15">
                {t}
              </li>
            ))}
          </ul>

          {location.landmarks.length > 0 && (
            <ul className="mt-8 divide-y divide-black/5 rounded-2xl bg-white px-5">
              {location.landmarks.map((l) => (
                <li key={l.name} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-brand-ink/60">{l.distance}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WhatsAppButton label="Book an inspection" />
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand-primary-light hover:text-brand-primary">
              Get directions →
            </a>
          </div>
        </div>

        <Reveal>
          {location.mapQuery ? (
            <iframe
              title={`Map showing ${project.shortAddress}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&z=15&output=embed`}
              className="aspect-[4/3] w-full rounded-3xl border-0 shadow-lg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl bg-white bg-[radial-gradient(#024d8722_1px,transparent_1px)] bg-[size:18px_18px] text-center ring-1 ring-black/5">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-lg">
                <PinIcon width={28} height={28} />
              </span>
              <p className="mt-4 font-display font-bold text-brand-primary">Map coming soon</p>
              <p className="mt-1 text-sm text-brand-ink/60">{project.locationTag}</p>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
