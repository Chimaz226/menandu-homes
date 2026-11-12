"use client";

import { useId, useState } from "react";
import { site } from "@/content/site";
import { ChevronDownIcon } from "../icons";
import { Container, SectionHeading } from "../ui";

export function Faq() {
  const { faq } = site;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div data-reveal>
          <SectionHeading eyebrow={faq.eyebrow} heading={faq.heading} />
        </div>
        <div data-stagger className="divide-y divide-black/10 border-y border-black/10">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const btnId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-base font-bold text-brand-primary hover:text-brand-primary-light sm:text-lg"
                  >
                    {item.q}
                    <ChevronDownIcon className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 leading-relaxed text-brand-ink/70">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
