import { formatNaira, site } from "@/content/site";
import { CalendarIcon } from "../icons";
import { Reveal } from "../Reveal";
import { Container, SectionHeading, WhatsAppButton } from "../ui";

export function Payment() {
  const { payment, pricing } = site;
  const [deposit, balance] = payment.breakdown;

  return (
    <section id="payment" className="bg-brand-primary py-20 text-white lg:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading eyebrow={payment.eyebrow} heading={payment.heading} intro={payment.intro} invert />
            </Reveal>
            <Reveal className="mt-6 flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <CalendarIcon className="mt-0.5 shrink-0 text-brand-accent" />
              <p className="text-sm leading-relaxed text-white/80">{payment.note}</p>
            </Reveal>
          </div>

          {/* Breakdown card */}
          <Reveal className="rounded-3xl bg-white p-6 text-brand-ink shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-ink/50">Sales price per unit</p>
              <span className="rounded-full bg-brand-accent/15 px-3 py-1 text-xs font-semibold text-brand-accent-dark">
                Payment duration: {payment.duration}
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-brand-primary sm:text-4xl">{formatNaira(pricing.pricePerUnit)}</p>
            <p className="mt-1 text-xs text-brand-ink/50">{pricing.priceInWords}</p>

            {/* 30 / 70 split */}
            <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-brand-surface" aria-hidden>
              <div className="bg-brand-accent" style={{ width: `${deposit.percent}%` }} />
              <div className="bg-brand-primary-light" style={{ width: `${balance.percent}%` }} />
            </div>

            <table className="mt-5 w-full text-sm">
              <caption className="sr-only">Payment structure</caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-brand-ink/50">
                  <th scope="col" className="pb-2 font-semibold">Payment structure</th>
                  <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {payment.breakdown.map((row, i) => (
                  <tr key={row.label}>
                    <th scope="row" className="py-3 text-left font-medium">
                      <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-brand-accent" : "bg-brand-primary-light"}`} aria-hidden />
                      {row.label} ({row.percent}%)
                    </th>
                    <td className="py-3 text-right font-semibold tabular-nums">{formatNaira(row.amount)}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="pt-3 text-left font-display font-bold text-brand-primary">
                    Total purchase price
                  </th>
                  <td className="pt-3 text-right font-display font-extrabold tabular-nums text-brand-primary">{formatNaira(payment.total)}</td>
                </tr>
              </tbody>
            </table>
          </Reveal>
        </div>

        {/* How it works */}
        <div className="relative mt-14">
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
          <WhatsAppButton label="Reserve a unit" className="bg-white! text-brand-primary! hover:bg-brand-surface!" />
        </div>
      </Container>
    </section>
  );
}
