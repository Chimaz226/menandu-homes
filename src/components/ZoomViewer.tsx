"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

const MAX_SCALE = 6;
const MIN_MAX_SCALE = 3;
/** Allow zooming until one source pixel spans ~3 screen pixels; beyond that it's just blur. */
const PX_STRETCH = 3;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SCALE = 2.5;

type Point = { x: number; y: number };

/**
 * Pan/zoom viewer for detailed drawings. Opens fitted to its box ("zoomed out"),
 * then: pinch or wheel to zoom, drag to pan, double-tap/double-click to zoom into a spot,
 * plus +/−/fit buttons. Panning is clamped so the drawing can't be lost off-screen.
 * Re-mount (via `key`) to reset when the image changes.
 */
export function ZoomViewer({ image, alt }: { image: StaticImageData; alt: string }) {
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const t = useRef({ s: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ dist: number; mid: Point } | null>(null);
  const lastTap = useRef<{ time: number; p: Point } | null>(null);
  const [scale, setScale] = useState(1);
  const [atMax, setAtMax] = useState(false);
  const maxScale = useRef(MAX_SCALE);

  const apply = useCallback((animate = false) => {
    const el = layer.current;
    if (!el) return;
    const { s, x, y } = t.current;
    el.style.transition = animate ? "transform 250ms ease-out" : "none";
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    setScale(Math.round(s * 10) / 10);
    setAtMax(s >= maxScale.current - 0.05);
  }, []);

  const clamp = useCallback(() => {
    const b = box.current;
    if (!b) return;
    const w = b.clientWidth;
    const h = b.clientHeight;
    const st = t.current;
    // Low-resolution drawings get a lower zoom ceiling so they never turn to mush.
    maxScale.current = Math.max(MIN_MAX_SCALE, Math.min(MAX_SCALE, (image.width / w) * PX_STRETCH));
    st.s = Math.min(maxScale.current, Math.max(1, st.s));
    st.x = Math.min(0, Math.max(w - w * st.s, st.x));
    st.y = Math.min(0, Math.max(h - h * st.s, st.y));
  }, [image.width]);

  /** Zoom to `next` keeping box-relative point `p` fixed under the finger/cursor. */
  const zoomAt = useCallback(
    (p: Point, next: number) => {
      const st = t.current;
      const s = Math.min(maxScale.current, Math.max(1, next));
      st.x = p.x - (p.x - st.x) * (s / st.s);
      st.y = p.y - (p.y - st.y) * (s / st.s);
      st.s = s;
      clamp();
    },
    [clamp],
  );

  const local = (e: { clientX: number; clientY: number }): Point => {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const center = (): Point => ({ x: (box.current?.clientWidth ?? 0) / 2, y: (box.current?.clientHeight ?? 0) / 2 });

  const lastToggle = useRef(0);
  const toggleAt = (p: Point) => {
    // Some mobile browsers fire dblclick after a handled double-tap; ignore the echo.
    if (performance.now() - lastToggle.current < 500) return;
    lastToggle.current = performance.now();
    if (t.current.s > 1.05) {
      t.current = { s: 1, x: 0, y: 0 };
    } else {
      zoomAt(p, DOUBLE_TAP_SCALE);
    }
    apply(true);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
    } else if (e.pointerType === "touch") {
      const now = performance.now();
      const prev = lastTap.current;
      if (prev && now - prev.time < DOUBLE_TAP_MS && Math.hypot(prev.p.x - p.x, prev.p.y - p.y) < 30) {
        lastTap.current = null;
        toggleAt(p);
      } else {
        lastTap.current = { time: now, p };
      }
    }
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      zoomAt(mid, t.current.s * (dist / pinch.current.dist));
      t.current.x += mid.x - pinch.current.mid.x;
      t.current.y += mid.y - pinch.current.mid.y;
      clamp();
      pinch.current = { dist, mid };
      apply();
    } else if (pointers.current.size === 1 && t.current.s > 1) {
      t.current.x += p.x - prev.x;
      t.current.y += p.y - prev.y;
      clamp();
      apply();
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  // Wheel zoom needs a non-passive listener to stop the page scrolling.
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(local(e), t.current.s * Math.exp(-e.deltaY * 0.0015));
      apply();
    };
    b.addEventListener("wheel", onWheel, { passive: false });
    return () => b.removeEventListener("wheel", onWheel);
  }, [apply, zoomAt]);

  // Keep the drawing in bounds if the screen rotates/resizes.
  useEffect(() => {
    const onResize = () => {
      clamp();
      apply();
    };
    onResize(); // also computes the zoom ceiling for this image on open
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [apply, clamp]);

  const step = (factor: number) => {
    zoomAt(center(), t.current.s * factor);
    apply(true);
  };
  const fit = () => {
    t.current = { s: 1, x: 0, y: 0 };
    apply(true);
  };

  const btn = "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-brand-primary hover:bg-brand-surface disabled:opacity-30";

  return (
    <div className="relative h-full w-full">
      <div
        ref={box}
        className="relative h-full w-full touch-none select-none overflow-hidden bg-white"
        style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(e) => toggleAt(local(e))}
      >
        <div ref={layer} className="absolute inset-0 origin-top-left will-change-transform">
          {/* Large `sizes` so a high-resolution file is loaded for zooming in. */}
          <Image src={image} alt={alt} fill sizes="(max-width: 768px) 300vw, 150vw" draggable={false} className="pointer-events-none object-contain p-3" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white/95 p-1 shadow-lg ring-1 ring-black/10 backdrop-blur">
          <button type="button" className={btn} onClick={() => step(1 / 1.6)} disabled={scale <= 1} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="min-w-14 rounded-full px-3 text-xs font-semibold text-brand-primary hover:bg-brand-surface" onClick={fit} aria-label="Fit to screen">
            {scale <= 1 ? "Fit" : `${scale.toFixed(1)}×`}
          </button>
          <button type="button" className={btn} onClick={() => step(1.6)} disabled={atMax} aria-label="Zoom in">
            +
          </button>
        </div>
        {scale <= 1 && <p className="rounded-full bg-brand-ink/70 px-3 py-1 text-[11px] text-white">Pinch or double-tap to zoom</p>}
      </div>
    </div>
  );
}
