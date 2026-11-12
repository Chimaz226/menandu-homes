import { site } from "@/content/site";
import { Reveal } from "../Reveal";
import { Container, SectionHeading, WhatsAppButton } from "../ui";

export function Payment() {
  const { payment } = site;
  return (
    <section id="payment" className="bg-brand-primary py-20 text-white lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={payment.eyebrow} heading={payment.heading} intro={payment.intro} invert />
        </Reveal>
        <div className="relative mt-12">
          {/* Track + bar that fills as the section scrolls (desktop only). */}
          <div className="absolute inset-x-6 top-[2.75rem] hidden h-0.5 bg-white/15 lg:block" aria-hidden />
          <div data-progress className="absolute inset-x-6 top-[2.75rem] hidden h-0.5 origin-left bg-brand-accent lg:block" aria-hidden />
          <ol data-stagger className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {payment.steps.map((s, i) => (
            <li key={s.title}>
              <div className="h-full rounded-3xl bg-brand-primary p-6 ring-1 ring-white/10 [background-image:linear-gradient(rgba(255,255,255,.05),rgba(255,255,255,.05))]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent font-display font-extrabold text-brand-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{s.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
        <div className="mt-10">
          <WhatsAppButton label="Request payment terms" className="bg-white! text-brand-primary! hover:bg-brand-surface!" />
        </div>
      </Container>
    </section>
  );
}
