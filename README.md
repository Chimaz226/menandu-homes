# Menandu Homes — 5-unit terrace landing page

One-page marketing site (Next.js 16 App Router, TypeScript, Tailwind v4, GSAP). There's no backend: enquiries go to WhatsApp (`wa.me`) and email (`mailto:`).

```bash
npm run dev     # http://localhost:3000
npm run build   # production build (page is fully static)
```

## Where things live

| What | Where |
| --- | --- |
| **All copy, prices, contacts, FAQ** | `src/content/site.ts` |
| Brand colours and fonts | `src/app/globals.css` (`@theme`). Tailwind v4 has no `tailwind.config` |
| Sections (Hero, About, Gallery, Floor Plans, Location, Payment, FAQ, Contact + footer) | `src/components/sections/` |
| Architectural renders | `src/assets/renders/` (static imports give automatic blur placeholders); wired up in `site.ts` → `renders` |
| Reusable "Sold out" ribbon | `SoldOutRibbon` in `src/components/ui.tsx` |
| Pricing panel (shown in Hero and About) | `src/components/PricingPanel.tsx` |
| Logo / favicon | `public/brand/menandu-logo.png` (transparent, 829×457), `src/app/favicon.ico` |
| Floor-plan crops (whole row / mid home / end home) | `src/assets/plans/`, cut from the originals in `_assets/floor-plans/` |
| Animations | `src/components/Animations.tsx` (GSAP + ScrollTrigger + SplitText) |
| Original client files | `_assets/` (not served) |

Empty fields in `site.ts` (`""`, `null`, `[]`) are **hidden** on the page, not shown blank. For example, email buttons, the Instagram link, the map, the delivery date and the RC number only appear once they're filled in.

## Still waiting on the client

Search the code for `TODO(client)`. In summary:

- Project/estate name (currently the working title "Menandu Terraces"), location tag, full site address, delivery date
- Unit prices, old prices and availability. Set `availability: "sold-out"` to show the red "Sold out" state
- Enquiry email, Instagram handle, RC number, year established, office address
- Payment plan structure and FAQ answers (current text is generic and has no figures)
- Neighbourhood copy, landmarks, map location
- Architect confirmation of bed/bath counts and sqm. Once confirmed, set `project.specsConfirmed: true` to remove the disclaimer
- Vector logo (the transparent PNG has soft edges, so a white version for dark backgrounds isn't possible yet) and a full favicon set (only a 16×16 `.ico` was supplied)

## Floor plans

The section is interactive: floor tabs (ground / first / second / site plan) × home type (terrace home units 02–05, end home unit 01, whole terrace), with a room schedule and an enlarge viewer. Room sizes are in `site.ts` → `floorPlans.plans[].rooms`. If a home type is marked `availability: "sold-out"` in `units`, its plans get the red "Sold out" ribbon.

If the architect revises the drawings, replace the PNGs in `_assets/floor-plans/` and re-crop. The crop boxes are pixel coordinates of each unit in those drawings, so they need re-checking if the layout changes.

## Animations

All motion is in `Animations.tsx`, driven by data attributes so sections stay server-rendered: `data-reveal`, `data-stagger`, `data-split` (section headings), `data-clip`, `data-parallax`, `data-count`, `data-progress`, `data-hero-*`. The floor-plan cross-fade lives in `FloorPlans.tsx`.

Safety rules (please keep them):
- CSS only pre-hides elements between "JS is on" and "GSAP started" (`globals.css`, `lib/anim-gate.ts`). If GSAP hasn't started within 3.5s, `html.no-anim` shows everything.
- Nothing animates under `prefers-reduced-motion`.
- The hero image is never hidden (it's the LCP element); it only zooms and parallaxes.

## Next 16 notes for future edits

- `next/image` uses `preload`, not the deprecated `priority`.
- `cacheComponents` is on, so `new Date()` etc. can't run during prerender. See `src/components/Year.tsx` for the `"use cache"` pattern.
- `next.config.ts` pins `turbopack.root`, because a stray `pnpm-lock.yaml` in the user home folder confuses root detection.

## Deploy

Push to GitHub and import into Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production domain so Open Graph URLs resolve.
