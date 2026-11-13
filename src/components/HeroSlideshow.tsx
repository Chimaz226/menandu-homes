"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons";

gsap.registerPlugin(useGSAP);

type Slide = { src: StaticImageData; alt: string; position: string };

const INTERVAL_MS = 6000;

/**
 * Hero background slideshow: crossfade + slow Ken Burns zoom, autoplay every 6s.
 * - Slides are mounted one ahead of the current one, so phones don't download every render up front.
 * - No autoplay or zoom under prefers-reduced-motion; pauses while the tab is hidden.
 * - Swipe left/right anywhere on the hero to change slide.
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(() => new Set([0, 1]));
  const [hidden, setHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const n = slides.length;

  const go = (i: number) => {
    const next = (i + n) % n;
    setIndex(next);
    setMounted((m) => (m.has(next) && m.has((next + 1) % n) ? m : new Set([...m, next, (next + 1) % n])));
  };

  // Autoplay (restarts after every manual change, since it depends on `index`).
  useEffect(() => {
    if (hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hidden]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Swipe on the whole hero section (the copy sits on top of this background).
  useEffect(() => {
    const section = root.current?.closest("section");
    if (!section) return;
    let start: { x: number; y: number } | null = null;
    const onStart = (e: TouchEvent) => (start = { x: e.touches[0].clientX, y: e.touches[0].clientY });
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) setIndex((i) => {
        const next = (i + (dx < 0 ? 1 : -1) + n) % n;
        setMounted((m) => new Set([...m, next, (next + 1) % n]));
        return next;
      });
    };
    section.addEventListener("touchstart", onStart, { passive: true });
    section.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      section.removeEventListener("touchstart", onStart);
      section.removeEventListener("touchend", onEnd);
    };
  }, [n]);

  // Ken Burns on the active slide.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(`[data-slide="${index}"] img`, { scale: 1.12 }, { scale: 1, duration: INTERVAL_MS / 1000 + 1.5, ease: "none" });
      });
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  return (
    <>
      <div ref={root} className="absolute inset-0" aria-roledescription="carousel" aria-label="Renders of the development">
        {slides.map((s, i) =>
          mounted.has(i) ? (
            <div
              key={i}
              data-slide={i}
              aria-hidden={i !== index}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                preload={i === 0}
                placeholder="blur"
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.position }}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Controls: top-right, clear of the copy and pricing card. */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/25 p-1 text-white backdrop-blur sm:right-6 sm:top-6">
        <button type="button" onClick={() => go(index - 1)} className="rounded-full p-1.5 hover:bg-white/15" aria-label="Previous image">
          <ChevronDownIcon width={16} height={16} className="rotate-90" />
        </button>
        <div className="flex items-center gap-1.5 px-1">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${n}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} className="rounded-full p-1.5 hover:bg-white/15" aria-label="Next image">
          <ChevronDownIcon width={16} height={16} className="-rotate-90" />
        </button>
      </div>
    </>
  );
}
