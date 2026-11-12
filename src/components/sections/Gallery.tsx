"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { ChevronDownIcon, CloseIcon } from "../icons";
import { Container, SectionHeading } from "../ui";

export function Gallery() {
  const { gallery } = site;
  const images = site.renders.gallery;
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = index === null ? null : images[index];

  return (
    <section id="gallery" className="bg-brand-surface py-20 lg:py-28">
      <Container>
        <div data-reveal>
          <SectionHeading eyebrow={gallery.eyebrow} heading={gallery.heading} intro={gallery.note} />
        </div>

        <ul className="mt-12 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 lg:auto-rows-[15rem] lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.alt} data-clip className={i === 0 ? "col-span-2 row-span-2" : i === images.length - 1 ? "col-span-2 lg:col-span-1" : ""}>
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-light"
                aria-label={`View larger: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
        aria-label="Image viewer"
      >
        {current && (
          <figure className="relative flex w-screen max-w-6xl flex-col items-center px-4">
            <Image src={current.src} alt={current.alt} sizes="100vw" className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.alt} · {(index ?? 0) + 1}/{images.length}
            </figcaption>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => step(-1)} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Previous image">
                <ChevronDownIcon className="rotate-90" />
              </button>
              <button type="button" onClick={close} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Close">
                <CloseIcon />
              </button>
              <button type="button" onClick={() => step(1)} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Next image">
                <ChevronDownIcon className="-rotate-90" />
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </section>
  );
}
