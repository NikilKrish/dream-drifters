---
version: "superdesign-alpha"
name: "Expedition Editorial"
description: "Full-bleed photographic hero with a slow-rotating slide deck, an earthen-terracotta editorial band, and a warm-paper content field, carried entirely by a serif display face and hairline outline buttons."
colors:
  background: "#F0F0F0"
  surface: "#F1F1F1"
  surface-editorial: "#79411C"
  text-primary: "#1B1919"
  text-secondary: "#212121"
  text-on-dark: "#FFFFFF"
  accent: "#0056A7"
  border: "#000000"
typography:
  headline-md:
    fontFamily: "HW Cigars Trial"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: "1.15"
  body-md:
    fontFamily: "HW Cigars Trial"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "1.33"
  label-md:
    fontFamily: "HW Cigars Trial"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "1.19"
  body-default:
    fontFamily: "HW Cigars Trial"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "1.5"
  accent-serif-light:
    fontFamily: "HW Cigars Trial Light"
    fontSize: "32px"
    fontWeight: 300
    lineHeight: "1.2"
  label-mono-caps:
    fontFamily: "Neue Haas Grotesk"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "1.4"
spacing:
  base: "10px"
  gap: "20px"
  section-padding: "80px"
  section-gap-lg: "272px"
rounded:
  control: "50px"
  card: "50px"
  pill: "50px"
components:
  button-hero-primary:
    background: "transparent"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "58px"
    border: "1px solid rgba(255,255,255,0.9)"
    note: "observed outline rectangle, hero-only"
  button-solid-inline:
    background: "#1863DC"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "58px"
    padding: "20px 32px"
    border: "1px solid rgb(24, 99, 220)"
  button-nav-utility:
    background: "transparent"
    text-color: "#FFFFFF"
    radius: "0px"
    height: "46px"
    padding: "10px 10px 10px 0px"
  button-text-link:
    background: "transparent"
    text-color: "#1863DC"
    radius: "0px"
    height: "46px"
    padding: "6px 0px 14px"
    border: "1px solid rgba(255,255,255,0)"
  button-text-caps:
    background: "transparent"
    text-color: "#000000"
    radius: "0px"
    height: "35px"
    padding: "0px"
  card-destination-media:
    background: "transparent"
    radius: "0px"
    padding: "0px"
  card-experience-tile:
    background: "transparent"
    radius: "0px"
    padding: "0px"
---
# Expedition Editorial
> **External reference only:** This NUBA study records inspiration and is not the Dream Drifters source of truth. Enhanced B is defined by the repository-root [design.md](../../../design.md) and [Enhanced B design system](../../design-system.md).

Source: https://nuba.com/us/

## Overview
This is a luxury-travel editorial system built on full-bleed photography, a single oversized serif display face, and near-total absence of rounding or ornament. It sits closest to Swiss/International rationalism transplanted onto a warm, earthen palette: hairline rules, thin all-caps labels, and rectangular outline buttons carry the "premium" signal instead of gradients or shadows. Color is used structurally — a saturated blue-white photographic hero, a deep terracotta interstitial band, and a warm off-white paper field for content — rather than decoratively. Nothing is glassmorphic, nothing glows; sophistication comes from restraint, generous whitespace, and a slow, deliberate motion cadence.

## Composition
The first screen is a full-viewport photographic hero (a blue ice-cave image) with a transparent navbar overlaid directly on the photo, a centered wordmark, and stacked hero text (eyebrow, serif headline, one outlined button) positioned low-center, with a five-dot carousel indicator beneath it — confirming this hero rotates through multiple images. Scrolling reveals a deliberate rhythm of alternating full-bleed color bands: a terracotta (#79411C-toned) statement band with a centered award seal, eyebrow, serif-set body copy and a text link; then a paper-toned (#F1F1F1) destination band using a two-column asymmetric image grid; then a four-up experience-card row on the same paper field; then a return to the terracotta band for a two-column text+image editorial pairing; ending in a paper-toned footer. This alternation — dark-warm band / light-warm band / dark-warm band — is the deliberate choice; the alternative (a single continuous white page) is rejected in favor of strong section-level color blocking that visually paginates the story. Density is low: wide gaps (up to 272px between sections), generous line-length caps (~800px), and never more than one grid per screen.

## Colors
The pixel field is dominated by warm neutrals, not blue, despite the hero: #F0F0F0 (~44%) and #F0F0D8 (~11%) are the paper-toned background/surface that underlies most of the scrolling page, and #784818 (~29%, echoing the declared #79411C) is the terracotta editorial band — together these three warm tones account for roughly 84% of rendered pixels. The hero's saturated blues (#004890, #006090, #004878, ~5% combined) are real but rationed to the first-screen photograph only; they do not recur as a UI color anywhere below the fold. Text ink is near-black (#1B1919, #212121, #000000) on both light and dark bands, with #FFFFFF reserved for text and outlines sitting directly on the photographic hero and the terracotta band. #0056A7 / #1863DC serve as the lone accent — a saturated blue used exclusively on the one solid-fill button and inline text links — a rationed, single-role accent against an otherwise achromatic-plus-earth palette. Borders are pure black or white at 1px, never gray, keeping every rule crisp against either field.

## Typography
A single serif display face, HW Cigars Trial, runs the entire hierarchy: 40px/1.15 for section and hero headlines, 32px/1.19 for large editorial labels, and a 20px/1.5 body-reading size for paragraph copy — all at regular weight, giving the page a quiet, literary tone rather than a bold marketing one. A light-weight cut of the same family (HW Cigars Trial Light) appears on subordinate serif lines for extra delicacy. Bold 18px/1.33 set in the same family is reserved for short emphatic lines (award captions, card body intros). All-caps micro-labels (eyebrows, nav items, "SEE EXPERIENCE"-style links) switch to Neue Haas Grotesk, a grotesque sans, at small sizes with wide tracking — the system's only sans-serif use, functioning purely as a structural/label layer beneath the serif's editorial voice.

## Layout
Content is capped at an 800px measure for reading blocks, with 80px section padding and section-to-section gaps as large as 272px, 156px, and 144px, producing a slow, magazine-paced scroll. The destination band uses a two-column asymmetric grid: one large tall image column paired with a stack of two smaller images — an alternating-layout, not a uniform grid. The experience-card row is a strict 4-up uniform card grid (rows: [4]), each card equal width with image-top/text-bottom anatomy. The business section reuses the two-column pattern (one full-width text block over a [1 | 1] image-and-caption pair). The footer is a flat multi-column link list (4 nav columns + a 25-link total, plus a bottom partner-logo strip of 8 marks) — no card treatment, transparent background throughout. Nothing observed uses rounded corners; radius is 0px everywhere except a 50px pill token reserved for a badge/seal shape.

## Components
- **Navbar** — transparent, overlaid directly on the hero photograph, no background fill or bottom border visible; edge-to-edge full-width bar (not inset, not a capsule), fixed height band roughly 90px tall. Contains 5 left-aligned nav items, a centered serif wordmark, and 4 right-aligned utility items (about/blog/contact/search) — 9 nav-level text links total, all rendered as the ×39-measured transparent/white 46px-height link style with 0px radius. No visible CTA button distinct from the nav links; the wordmark is plain white serif type, no logomark.
- **Hero primary button** — one outlined rectangle sits beneath the hero headline: transparent fill, white 1px border, white caps label, 0px radius, ~58px height (observed from screenshot, not the measured solid button — this is the button variant actually emphasized on the first screen, a thin outline, not a solid fill).
- **Solid inline button** — appears mid-page, e.g. beside editorial text: fill `#1863DC`, white text, 0px radius (sharp), 58px height, padding `20px 32px`, `1px solid rgb(24, 99, 220)` border — the only solid, high-contrast button variant measured, used as a secondary/inline CTA, not the hero primary.
- **Text-link button ("SEE EXPERIENCE" style)** — transparent, blue (`#1863DC`) text, 0px radius, 46px height, underline-on-hover implied by the near-invisible `1px solid rgba(255,255,255,0)` border; appears once per experience card and once beneath the destinations/experiences grids as a section-level link.
- **Caps text button** — transparent, black text, 0px radius, 35px height, no padding; used for small in-body links like "READ MORE" under the terracotta statement band.
- **Award/seal badge** — centered single element atop the terracotta statement band: a circular emblem (badge shape, ~50px-radius family) with white line art and caption text below it, sitting alone with heavy whitespace on all sides.
- **Destination image band** — appears once, mid-page, on the paper surface: a two-column asymmetric photo grid (one large portrait image left, stacked smaller images right), each block full-bleed to its column with a caption/eyebrow + serif heading + body paragraph set beneath the smaller images, no visible card border or shadow — image and text sit directly on the paper background.
- **Experience card (4-up row)** — appears once as a horizontal scrolling/carousel row of 4 equal cards on the paper surface (rows: [4]), transparent background, 0px radius, 0px padding on the card shell itself. Anatomy top-to-bottom: a photographic image covering roughly the top half of the card, then a small caps eyebrow (location/category label), a serif heading line, 2–3 lines of body copy, and a caps text-link CTA at the base. A pair of pagination dots and a chevron arrow sit beneath the row, confirming this is a scrolling rail, not a static grid.
- **Business/editorial pairing** — on the terracotta band: a full-width intro paragraph over a [1 | 1] two-column image-and-caption grid, each column a photo with a serif heading and body paragraph beneath — same anatomy as the destination band, reused with terracotta ground instead of paper ground.
- **Footer** — background transparent, sits on the paper surface. Structure: wordmark top-left, four link-list columns (Travel/Business/Insider region list/About+Information/Contact+Global) totaling 25 links, a hairline divider, then a partner/affiliate logo strip of 8 monochrome marks, then a final hairline divider and a small-print legal line plus 3 policy links.

## Graphics & Effects
The only measured gradient, `linear-gradient(rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)`, covers roughly 0.3% of the page — a thin bottom-edge scrim used to fade an image into the paper background at a section seam, not a page-wide treatment. Two soft shadows are used sparingly for edge separation, not elevation drama: `rgba(0, 0, 0, 0.1) 0px -1px 0px 0px inset` (a hairline inset seam, likely under the navbar or a sticky element) and `rgba(0, 0, 0, 0.1) 2px 4px 5px 0px` (a light drop shadow on a small floating control, such as the reduced-motion toggle visible bottom-left of the hero). A third, `rgba(172, 171, 171, 0.3) 0px -1px 10px 0px`, is a faint upward glow, likely under a sticky footer or pagination element. Photography itself carries all textural richness — no noise/grain overlay, no pattern fills; the ice-cave hero's own light and crystalline surface supplies visual complexity that the flat UI otherwise withholds.

## Motion
Transitions are unhurried and eased throughout: `all 0.4s ease` and `all 0.3s ease` govern most hover/state changes, while a compound transition `background, border, border-radius, box-shadow, transform 0.3s, 0.3s, 0.3s, 0.3s, 0.4s ease, ease, ease, ease, ease` indicates buttons animate multiple properties in near-unison for a soft, non-snappy hover response. A slower `border, background, transform 0.5s ease` likely governs the hero carousel's slide/dot transition. No spring or overshoot easing is present — everything settles smoothly, matching the editorial, unhurried tone. Named keyframes (jet-engine-spin, spin, batman) point to isolated loader/spinner animations rather than any decorative ambient motion on the page itself.

## Guardrails
- Never round a corner: every button, card, and image sits at 0px radius except the one circular seal badge; a rounded card breaks the system instantly.
- Do not fill the hero button solid blue — the hero's primary action is a thin white outline rectangle on photography; reserve the solid `#1863DC` fill for inline, mid-page secondary actions only.
- Do not tint the hero photograph's blue palette into the rest of the page; blue exists only in the hero photo and as the single accent-blue button/link color elsewhere.
- Never substitute a sans-serif for headline or body copy; HW Cigars Trial carries all reading hierarchy, with the grotesque sans confined to small caps labels only.
- Preserve the terracotta/paper band alternation; do not flatten the page to one continuous background color.
- Keep spacing generous — do not compress the 80px+ section padding or the near-272px section gaps into a dense layout.
