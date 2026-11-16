"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Img = { src: StaticImageData; alt: string };

/**
 * Crossfades through a few images inside a sized, `relative` parent.
 * - Cycles only while on screen (IntersectionObserver), so off-screen frames cost nothing.
 * - Only the first image loads up front; the rest load after the page has finished loading.
 * - Static under prefers-reduced-motion.
 * `delay` offsets the first change so neighbouring cyclers don't switch in sync.
 */
export function ImageCycler({
  images,
  interval = 3500,
  delay = 0,
  sizes,
  quality = 90,
}: {
  images: Img[];
  interval?: number;
  delay?: number;
  sizes: string;
  quality?: number;
}) {
  const [index, setIndex] = useState(0);
  const [loadAll, setLoadAll] = useState(false);
  const [visible, setVisible] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const n = images.length;

  useEffect(() => {
    const go = () => setLoadAll(true);
    if (document.readyState === "complete") {
      const t = setTimeout(go, 800);
      return () => clearTimeout(t);
    }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !loadAll || n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setIndex((i) => (i + 1) % n);
      timer = setInterval(() => setIndex((i) => (i + 1) % n), interval);
    }, delay + interval);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [visible, loadAll, n, interval, delay]);

  return (
    <div ref={box} className="absolute inset-0">
      {images.map((img, i) =>
        i === 0 || loadAll ? (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image src={img.src} alt={img.alt} fill placeholder="blur" sizes={sizes} quality={quality} className="object-cover" />
          </div>
        ) : null,
      )}
    </div>
  );
}
