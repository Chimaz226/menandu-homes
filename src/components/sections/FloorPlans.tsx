"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { site, whatsappUrl, type PlanView } from "@/content/site";
import { ChevronDownIcon, CloseIcon, WhatsAppIcon } from "../icons";
import { SitePlan } from "../SitePlan";
import { ZoomViewer } from "../ZoomViewer";
import { Container, SectionHeading, SoldOutRibbon } from "../ui";

gsap.registerPlugin(useGSAP);

type Tab = "ground" | "first" | "second" | "site";

const tabs: { id: Tab; label: string; short: string; level: string }[] = [
  { id: "ground", label: "Ground floor", short: "Ground", level: "G" },
  { id: "first", label: "First floor", short: "First", level: "1" },
  { id: "second", label: "Second floor", short: "Second", level: "2" },
  { id: "site", label: "Site plan", short: "Site", level: "" },
];

const siteFacts = [
  { name: "Building footprint", size: "34 × 8 m" },
  { name: "Front setback from access road", size: "9 m" },
  { name: "Side and rear margins", size: "3 m" },
  { name: "On-site parking", size: "14 cars" },
  { name: "Homes in the row", size: "5" },
];

/** Live height of the sticky nav (CSS var --nav-h in globals.css); the control bar pins just below it. */
const navHeight = () => document.querySelector("header")?.offsetHeight ?? 96;

function ZoomIcon(p: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  );
}

/** Stacked-floor indicator showing which level is being viewed. */
function LevelIndicator({ active }: { active: Tab }) {
  return (
    <div className="flex flex-col gap-1" aria-hidden>
      {["second", "first", "ground"].map((id) => {
        const t = tabs.find((x) => x.id === id)!;
        const on = active === id;
        return (
          <span
            key={id}
            className={`flex h-6 w-14 items-center justify-center rounded text-[11px] font-bold transition-colors ${
              on ? "bg-brand-primary text-white" : "bg-brand-primary/10 text-brand-primary/50"
            }`}
          >
            {t.level}
          </span>
        );
      })}
    </div>
  );
}

export function FloorPlans() {
  const { floorPlans, units } = site;
  const [tab, setTab] = useState<Tab>("ground");
  const [view, setView] = useState<PlanView>("mid");
  const stage = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const tabIndex = tabs.findIndex((t) => t.id === tab);
  const prevTab = tabIndex > 0 ? tabs[tabIndex - 1] : null;
  const nextTab = tabIndex < tabs.length - 1 ? tabs[tabIndex + 1] : null;

  const plan = floorPlans.plans.find((p) => p.id === tab);
  const viewMeta = floorPlans.views.find((v) => v.id === view)!;
  // Ribbon only when every unit shown in this view is sold.
  const soldOut =
    !!plan && viewMeta.unitIds.length > 0 && viewMeta.unitIds.every((id) => units.find((u) => u.id === id)?.availability === "sold-out");
  const [zoomOpen, setZoomOpen] = useState(false);

  // Lock page scroll behind the full-screen viewer (a modal <dialog> doesn't on iOS).
  useEffect(() => {
    if (!zoomOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [zoomOpen]);

  const openZoom = () => {
    setZoomOpen(true);
    dialog.current?.showModal();
  };
  const wide = tab === "site" || view === "full";
  const rooms = plan ? plan.rooms[view === "end" ? "end" : "mid"] : siteFacts;
  const image = plan?.images[view];

  // Cross-fade the drawing and room list whenever floor or view changes. Kept short so switching feels instant.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-plan-image]", { autoAlpha: 0, scale: 0.98, duration: 0.3, ease: "power2.out" });
        gsap.from("[data-plan-room]", { autoAlpha: 0, x: 12, duration: 0.25, stagger: 0.03, ease: "power2.out" });
      });
    },
    { scope: stage, dependencies: [tab, view], revertOnUpdate: true },
  );

  /** If the drawing has scrolled above the pinned control bar, bring it back into view. */
  const revealPanel = () => {
    const panel = stage.current;
    if (!panel) return;
    const offset = navHeight() + (bar.current?.offsetHeight ?? 0) + 8;
    if (panel.getBoundingClientRect().top < offset) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + panel.getBoundingClientRect().top - offset, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const goTo = (t: Tab) => {
    setTab(t);
    revealPanel();
  };
  const chooseView = (v: PlanView) => {
    setView(v);
    revealPanel();
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  // Swipe left/right on the drawing to change floor (horizontal swipes only, so vertical scrolling is untouched).
  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0 && nextTab) setTab(nextTab.id);
    if (dx > 0 && prevTab) setTab(prevTab.id);
  };

  return (
    <section id="floor-plans" className="py-20 lg:py-28">
      <Container>
        <div data-reveal>
          <SectionHeading eyebrow={floorPlans.eyebrow} heading={floorPlans.heading} intro={floorPlans.summary} />
        </div>

        {/* Controls: pinned under the nav on mobile/tablet so switching never needs a scroll back up. */}
        <div
          ref={bar}
          className="sticky z-30 -mx-5 mt-8 flex flex-col gap-2 border-b border-black/5 bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
          style={{ top: "var(--nav-h)" }}
        >
          <div role="tablist" aria-label="Floor" className="grid grid-cols-4 gap-1.5 lg:flex lg:gap-2">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`plan-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="plan-panel"
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => goTo(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`rounded-full px-2 py-2 text-sm font-semibold transition-colors lg:px-5 lg:py-2.5 ${
                  tab === t.id ? "bg-brand-primary text-white shadow-md" : "bg-brand-surface text-brand-primary hover:bg-brand-primary/10"
                }`}
              >
                <span className="lg:hidden">{t.short}</span>
                <span className="hidden lg:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {tab !== "site" && (
            <div className="grid grid-cols-3 rounded-2xl bg-brand-surface p-1 ring-1 ring-black/5 lg:inline-flex" role="group" aria-label="Home type">
              {floorPlans.views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => chooseView(v.id)}
                  className={`rounded-xl px-2 py-1.5 text-center transition-colors lg:px-4 lg:py-2 lg:text-left ${
                    view === v.id ? "bg-white shadow-sm ring-1 ring-black/5" : "hover:bg-white/60"
                  }`}
                >
                  <span className={`block text-xs font-semibold sm:text-sm ${view === v.id ? "text-brand-primary" : "text-brand-ink/70"}`}>{v.label}</span>
                  <span className="hidden text-[11px] text-brand-ink/50 sm:block">{v.sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          ref={stage}
          id="plan-panel"
          role="tabpanel"
          aria-labelledby={`plan-tab-${tab}`}
          className={`mt-4 grid gap-4 lg:mt-6 lg:gap-6 ${wide ? "" : "lg:grid-cols-[1.5fr_1fr]"}`}
        >
          {/* Drawing */}
          <div
            className="relative overflow-hidden rounded-3xl bg-white p-3 shadow-sm ring-1 ring-black/10 sm:p-6"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              data-plan-image
              onClick={tab !== "site" ? openZoom : undefined}
              className={`relative flex items-center justify-center ${tab !== "site" ? "cursor-zoom-in" : ""} ${wide ? "" : "h-[340px] sm:h-[480px] lg:h-[540px]"}`}
            >
              {tab === "site" ? (
                <SitePlan className="h-auto w-full" />
              ) : (
                image && (
                  <Image
                    src={image}
                    alt={`${plan!.title} plan, ${viewMeta.label.toLowerCase()} (${viewMeta.sub})`}
                    sizes={wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1024px) 60vw, 100vw"}
                    className={wide ? "h-auto w-full" : "h-full w-auto max-w-full object-contain"}
                  />
                )
              )}
            </div>
            {soldOut && <SoldOutRibbon />}
            {tab !== "site" && (
              <button
                type="button"
                onClick={openZoom}
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-brand-primary shadow ring-1 ring-black/10 backdrop-blur hover:bg-white sm:right-4 sm:top-4"
              >
                <ZoomIcon /> Enlarge
              </button>
            )}
            <p className="mt-2 text-center text-[11px] text-brand-ink/40 lg:hidden">Tap to enlarge · swipe to change floor</p>
          </div>

          {/* Room schedule */}
          <div className={`rounded-3xl bg-brand-surface p-5 sm:p-8 ${wide ? "grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-start" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary-light">
                  {tab === "site" ? "The plot" : viewMeta.sub}
                </p>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-brand-primary">{plan ? plan.title : "Site plan"}</h3>
              </div>
              {tab !== "site" && <LevelIndicator active={tab} />}
            </div>

            <ul className={`divide-y divide-black/10 ${wide ? "md:columns-2 md:gap-8 md:divide-y-0" : "mt-4 sm:mt-6"}`}>
              {rooms.map((r, i) => (
                <li key={`${r.name}-${i}`} data-plan-room className="flex items-baseline justify-between gap-4 py-2.5 sm:py-3 md:break-inside-avoid">
                  <span className="font-medium text-brand-ink">{r.name}</span>
                  {r.size && <span className="shrink-0 text-sm tabular-nums text-brand-ink/60">{r.size}</span>}
                </li>
              ))}
            </ul>

            <div className={wide ? "" : "mt-6"}>
              <p className="text-xs leading-relaxed text-brand-ink/50">{floorPlans.note}</p>
              <a
                href={whatsappUrl("Hello Menandu Homes, please send me the full architectural drawings for the terrace homes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary-light hover:text-brand-primary"
              >
                <WhatsAppIcon width={16} height={16} /> Request the full drawings
              </a>
            </div>
          </div>
        </div>

        {/* Previous / next floor, right where the reader finishes the room list. */}
        <nav aria-label="Change floor" className="mt-4 grid grid-cols-2 gap-3 lg:mt-6">
          {prevTab ? (
            <button
              type="button"
              onClick={() => goTo(prevTab.id)}
              className="flex items-center gap-2 rounded-2xl bg-brand-surface px-4 py-3 text-left ring-1 ring-black/5 hover:bg-brand-primary/10"
            >
              <ChevronDownIcon className="shrink-0 rotate-90 text-brand-primary" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-brand-ink/50">Previous</span>
                <span className="block text-sm font-semibold text-brand-primary">{prevTab.label}</span>
              </span>
            </button>
          ) : (
            <span />
          )}
          {nextTab && (
            <button
              type="button"
              onClick={() => goTo(nextTab.id)}
              className="flex items-center justify-end gap-2 rounded-2xl bg-brand-primary px-4 py-3 text-right text-white hover:bg-brand-primary-dark"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-white/70">Next</span>
                <span className="block text-sm font-semibold">{nextTab.label}</span>
              </span>
              <ChevronDownIcon className="shrink-0 -rotate-90" />
            </button>
          )}
        </nav>
      </Container>

      {/* Full-screen zoom viewer: opens fitted to the screen, then pinch / double-tap / wheel to zoom in. */}
      <dialog
        ref={dialog}
        onClose={() => setZoomOpen(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-white p-0 backdrop:bg-black/80 sm:m-auto sm:h-[92vh] sm:w-[96vw] sm:rounded-2xl"
        aria-label="Enlarged floor plan"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-2.5 sm:px-5 sm:py-3">
            <p className="min-w-0 truncate font-display font-bold text-brand-primary">
              {plan?.title} · {viewMeta.label}
              <span className="ml-2 hidden text-xs font-medium text-brand-ink/50 sm:inline">{viewMeta.sub}</span>
            </p>
            <button type="button" onClick={() => dialog.current?.close()} className="rounded-full p-2 text-brand-primary hover:bg-brand-surface" aria-label="Close">
              <CloseIcon />
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            {zoomOpen && image && <ZoomViewer key={`${tab}-${view}`} image={image} alt={`${plan!.title} plan, ${viewMeta.label.toLowerCase()}, enlarged`} />}
          </div>
        </div>
      </dialog>
    </section>
  );
}
