import { site } from "@/content/site";
import { PinIcon } from "../icons";
import { Reveal } from "../Reveal";
import { Container, SectionHeading, WhatsAppButton } from "../ui";

export function Location() {
  const { location, project } = site;
  return (
    <section id="location" className="bg-brand-surface py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading eyebrow={location.eyebrow} heading={location.heading} intro={location.description} />
          {project.address && (
            <p className="mt-6 flex items-start gap-2 font-semibold text-brand-primary">
              <PinIcon className="mt-0.5 shrink-0" /> {project.address}
            </p>
          )}
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
          <div className="mt-8">
            <WhatsAppButton label="Ask for the site location" />
          </div>
        </Reveal>

        <Reveal>
          {location.mapQuery ? (
            <iframe
              title={`Map showing ${project.name}`}
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
