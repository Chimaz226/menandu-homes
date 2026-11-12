import type { ReactNode } from "react";

/** Fades and rises into view on scroll. Animated by components/Animations.tsx (GSAP). */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={className}>
      {children}
    </div>
  );
}
