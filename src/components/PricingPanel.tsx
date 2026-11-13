import { formatNaira, site, type Availability } from "@/content/site";

const status: Record<Availability, { label: string; chip: string }> = {
  available: { label: "Available", chip: "bg-brand-accent/15 text-brand-accent-dark ring-brand-accent/40" },
  "few-left": { label: "Reserved", chip: "bg-amber-100 text-amber-800 ring-amber-300" },
  "sold-out": { label: "Sold out", chip: "bg-brand-sold/10 text-brand-sold ring-brand-sold/30 line-through" },
};

/** Price per unit, payment summary and per-unit availability. Reused in the hero and About sections. */
export function PricingPanel({ className = "" }: { className?: string }) {
  const { pricing, units, payment } = site;
  const available = units.filter((u) => u.availability !== "sold-out").length;
  const deposit = payment.breakdown[0];

  return (
    <div className={`rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-ink/50">Sales price</p>
          {pricing.oldPrice && <p className="mt-1 text-sm text-brand-ink/40 line-through">{formatNaira(pricing.oldPrice)}</p>}
          <p className="mt-1 whitespace-nowrap font-display text-2xl font-extrabold text-brand-primary sm:text-3xl">
            {formatNaira(pricing.pricePerUnit)}
            <span className="ml-1 text-sm font-semibold text-brand-ink/50">/ unit</span>
          </p>
          <p className="mt-0.5 text-[11px] text-brand-ink/50">{pricing.priceInWords}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            available ? "bg-brand-accent/15 text-brand-accent-dark" : "bg-brand-sold/10 text-brand-sold"
          }`}
        >
          {available ? `${available} of ${units.length} available` : "Sold out"}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-brand-ink/80">{pricing.product}</p>

      <ul className="mt-3 grid grid-cols-5 gap-1.5" aria-label="Availability by unit">
        {units.map((u) => {
          const st = status[u.availability];
          return (
            <li key={u.id} title={`Unit ${u.id}: ${st.label}`} className={`rounded-lg py-1.5 text-center text-xs font-bold ring-1 ${st.chip}`}>
              {u.id}
              <span className="sr-only">: {st.label}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-black/5 pt-3 text-xs text-brand-ink/60">
        <span>
          <strong className="font-semibold text-brand-ink">{deposit.percent}% deposit</strong> {formatNaira(deposit.amount)}
        </span>
        <span>Balance over {payment.duration}</span>
      </div>
    </div>
  );
}
