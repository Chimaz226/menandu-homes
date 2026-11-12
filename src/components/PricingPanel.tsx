import { formatNaira, site, type Availability } from "@/content/site";

const badge: Record<Availability, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-brand-accent/15 text-brand-accent-dark" },
  "few-left": { label: "Few left", className: "bg-amber-100 text-amber-800" },
  "sold-out": { label: "Sold out", className: "bg-brand-sold/10 text-brand-sold" },
};

/** Unit types with price and availability. Reused in the hero and About sections. */
export function PricingPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5 sm:p-6 ${className}`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-ink/50">Pricing</p>
      <ul className="divide-y divide-black/5">
        {site.units.map((u) => {
          const b = badge[u.availability];
          const soldOut = u.availability === "sold-out";
          return (
            <li key={u.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className={`font-display font-bold ${soldOut ? "text-brand-ink/40 line-through" : "text-brand-primary"}`}>
                  {u.name}
                  <span className="ml-2 text-xs font-medium text-brand-ink/50">
                    × {u.unitCount} {u.unitCount === 1 ? "unit" : "units"}
                  </span>
                </p>
                <p className="text-sm text-brand-ink/60">{u.summary}</p>
              </div>
              <div className="shrink-0 text-right">
                {u.oldPrice && <p className="text-xs text-brand-ink/40 line-through">{formatNaira(u.oldPrice)}</p>}
                <p className="font-display text-sm font-bold text-brand-ink">{u.price ? formatNaira(u.price) : "Price on request"}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${b.className}`}>{b.label}</span>
              </div>
            </li>
          );
        })}
      </ul>
      {!site.project.specsConfirmed && (
        <p className="mt-4 text-[11px] leading-snug text-brand-ink/50">Specifications subject to final architectural confirmation.</p>
      )}
    </div>
  );
}
