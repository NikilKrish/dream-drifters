# Dream Drifters — Luxury Editorial Design System

## Product and job to be done

Dream Drifters is a Chennai-based travel consultancy. The single-page experience is leisure-first: inspire a traveller, help them explore six curated journeys, collect a concise three-step brief, and hand the structured brief to WhatsApp. Corporate travel is a compact secondary offering. There is no booking engine, payment flow, account system or CMS.

## Primary design source

Use NUBA's cinematic, image-led luxury travel pacing as the primary style source. Black Tomato contributes emotion-led discovery and persistent enquiry behaviour only; do not copy its visual styling. Visit Jersey contributes mobile-first sequential discovery. Going contributes hierarchy discipline. The result must remain recognisably Dream Drifters and must use the supplied brand mark.

## Brand palette

- Editorial ink `#071B2B`: navigation, footer, running dark copy and overlays.
- Pearl `#F6F3EC`: primary page canvas and warm editorial whitespace.
- Frost white `#FFFFFF`: inverted copy and lifted input surfaces.
- Sea glass `#5F8585`: muted rules, metadata and quiet support accents.
- Brand cyan `#04B2C9`: the only vivid action color; use for the primary CTA, active progress and small brand signals.
- Mist `#DCE5E4`: borders and inactive controls.

Never introduce gold, purple, neon gradients, black body text or competing saturated accents. Cyan is sparse, not a section-fill color.

## Typography

- Display: Instrument Serif, 400. Use for cinematic headings and destination names.
- UI and body: Manrope Variable, 400–700.
- Display scale: clamp from 56px mobile to 112px desktop, line-height 0.92–1.0, slight negative tracking.
- Section headings: clamp 42–76px, line-height 1.0.
- Body: 16–19px, line-height 1.55–1.7, maximum 68 characters.
- Labels: 12–14px, uppercase, 0.12em tracking.

## Layout and surfaces

- Desktop canvas: fluid 12-column grid, max content width 1360px, 32–64px gutters.
- Mobile: single column, 20px gutters, no fixed minimum widths and no horizontal overflow.
- Section spacing: 112–176px desktop, 72–104px mobile.
- Images dominate the composition; avoid repetitive SaaS cards.
- Image frames use 0–16px radius. Forms and package sheets use 20–28px radius. Buttons are full pills.
- Shadows are rare and low-opacity; hierarchy comes from scale, crop, overlap and contrast.

## Core components

- Adaptive navigation: transparent over the hero, then ink/pearl after scroll; logo left, five anchors and a persistent cyan `Plan my trip` CTA.
- Hero: poster-first full-bleed cinematic media, quiet gradient overlay, emotional headline, two actions and a scroll cue. Ambient video loads after first paint only on capable devices.
- Destination mosaic: six editorial photo tiles with staggered geometry, destination metadata and restrained hover/tap reveals.
- Package sheet: full-screen accessible layer with a shared-image transition, overview, duration, from-price, inclusions, itinerary and `Plan this journey` CTA.
- Planner: full-screen three-step layer with step progress, large option controls, inline validation, review state and explicit WhatsApp continuation.
- Trust and testimonials: use only verified claims; typography and spacing carry authority rather than badge clutter.
- Corporate band: one compact ink panel near the lower page, visually secondary to leisure journeys.

## Motion

- Use native scrolling. Never hijack scroll or hide the scrollbar.
- Entrance and section transitions: 600–900ms using `cubic-bezier(.22,1,.36,1)`.
- Micro-interactions: 180–240ms.
- Animate opacity and transforms; use masks/clip-path only on contained media.
- Hero copy staggers in once, destination imagery reveals on entry, and package images transition into the full-screen sheet.
- Reduced motion: remove parallax, scrubbing and shared-element travel; render content immediately with simple opacity changes or none.
- Save-Data/mobile: use the optimized poster instead of autoplay video.

## Conversion and accessibility rules

- One dominant filled CTA per viewport.
- Package actions prefill the planner; users must explicitly choose to continue to WhatsApp.
- Provide skip navigation, semantic headings, keyboard operation, focus trapping, Escape/backdrop close, visible focus rings and ARIA live status.
- Meet WCAG 2.2 AA contrast and 44px minimum touch targets.
- Every image has explicit dimensions and useful alt text; decorative media has empty alt text.

## Content constraints

- The six existing packages and Chennai contact details are draft source content.
- Prices use `From` and cannot ship until verified.
- Do not publish the existing 5000+, 100% satisfaction or testimonial claims until the business verifies them.
- Temporary stock media must be visibly documented for replacement before production.
