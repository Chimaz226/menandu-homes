"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Site-wide GSAP motion, driven by data attributes so section components stay
 * server-rendered:
 *
 *   data-hero-bg       hero image: slow zoom-out on load, parallax on scroll
 *   data-hero-item     hero copy: staggered rise on load
 *   data-hero-panel    hero pricing card: rises in after the copy
 *   data-reveal        fades/rises in when scrolled into view (batched)
 *   data-stagger       children rise in one after another
 *   data-split         heading lines slide up from a mask (SplitText)
 *   data-clip          image wipes open from the bottom
 *   data-parallax="n"  drifts n% vertically while scrolling (needs an oversized child)
 *   data-count         number counts up from 0
 *   data-progress      bar that fills as its section scrolls past
 *
 * Elements are pre-hidden by CSS only under `html.js` (see globals.css and
 * lib/anim-gate.ts), and nothing runs under prefers-reduced-motion.
 */
export function Animations() {
  useGSAP(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The safety-net timer already revealed everything; don't re-hide it.
      if (root.classList.contains("no-anim")) return;
      root.classList.add("gsap");

      /* Hero */
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-bg]", { scale: 1.18, duration: 2.4, ease: "power2.out" }, 0)
        .fromTo("[data-hero-item]", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.1)
        .fromTo("[data-hero-panel]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.4);

      gsap.to("[data-hero-bg]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
      });

      /* Scroll reveals */
      // Elements already above the viewport (reload mid-page, anchor jump) are shown immediately.
      const passed = (el: Element) => el.getBoundingClientRect().bottom < 0;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals.filter((el) => !passed(el)), { autoAlpha: 0, y: 24 });
      gsap.set(reveals.filter(passed), { autoAlpha: 1, y: 0 });
      ScrollTrigger.batch(reveals, {
        start: "top 96%",
        once: true,
        interval: 0.05,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out", overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.fromTo(
          group.children,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out", scrollTrigger: { trigger: group, start: "top 95%", once: true } },
        );
      });

      /* Headings: lines slide up from behind a mask */
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.6,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 96%", once: true },
            }),
        });
      });

      /* Image wipes */
      gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%", once: true } });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out" });
        const img = el.querySelector("img");
        if (img) tl.from(img, { scale: 1.15, duration: 0.9, ease: "power2.out" }, 0);
      });

      /* Parallax */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 10;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      /* Counters */
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        if (!Number.isFinite(end)) return;
        const counter = { v: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          v: end,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
        });
      });

      /* Progress bars */
      gsap.utils.toArray<HTMLElement>("[data-progress]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", transformOrigin: "left center", scrollTrigger: { trigger: el.parentElement, start: "top 80%", end: "bottom 50%", scrub: 0.6 } },
        );
      });

      // Trigger positions are measured once; anything that changes page height afterwards
      // (floor-plan view switch, FAQ accordion, late images/fonts) would leave every
      // trigger below it stale, so animations fired late or after scrolling past.
      // Re-measure whenever the page height changes (debounced).
      // The refresh waits until scrolling has stopped: refreshing mid-scroll would
      // cancel an in-progress smooth scroll (e.g. the floor-plan "Next floor" button).
      let timer: ReturnType<typeof setTimeout> | undefined;
      let pending = false;
      let lastHeight = document.body.scrollHeight;
      const flush = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          pending = false;
          const h = document.body.scrollHeight;
          if (h !== lastHeight) {
            lastHeight = h;
            ScrollTrigger.refresh();
          }
        }, 150);
      };
      const refresh = () => {
        pending = true;
        flush();
      };
      const onScroll = () => pending && flush();
      const ro = new ResizeObserver(refresh);
      ro.observe(document.body);
      window.addEventListener("load", refresh);
      window.addEventListener("scroll", onScroll, { passive: true });
      // `html.gsap` is intentionally never removed: the CSS pre-hide only applies
      // before GSAP starts, so a revert (e.g. StrictMode, reduced-motion toggle)
      // leaves content visible.
      return () => {
        ro.disconnect();
        clearTimeout(timer);
        window.removeEventListener("load", refresh);
        window.removeEventListener("scroll", onScroll);
      };
    });
  });

  return null;
}
