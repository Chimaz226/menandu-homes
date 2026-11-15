"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site, whatsappUrl } from "@/content/site";
import { Container } from "./ui";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "./icons";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "border-black/5 shadow-sm" : "border-transparent"
      }`}
    >
      <Container className="flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a href="#home" className="shrink-0" aria-label={`${site.company.name}, back to top`}>
          <Image src={site.company.logo} alt={site.company.name} width={829} height={457} preload className="h-[68px] w-auto sm:h-[76px]" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href ? "location" : undefined}
                  className={`relative py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-brand-accent after:transition-transform ${
                    active === item.href
                      ? "text-brand-primary-light after:scale-x-100"
                      : "text-brand-primary hover:text-brand-primary-light after:scale-x-0"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary-light px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Enquire Now</span>
            <span className="sm:hidden">Enquire</span>
          </a>
          <button
            type="button"
            className="rounded-md p-2 text-brand-primary lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="h-[calc(100dvh-var(--nav-h))] border-t border-black/5 bg-white lg:hidden">
          <ul className="flex flex-col px-5 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-black/5 py-4 font-display text-lg font-bold text-brand-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
