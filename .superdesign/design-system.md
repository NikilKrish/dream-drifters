# Dream Drifters Enhanced B Design System

> **Canonical context:** Enhanced B is the sole production source of truth. `design.md` governs design decisions and `memory.md` governs implementation history and deployment state. External website studies and the former A/B/C prototypes are reference material only.

## Product and journey

Dream Drifters is a Chennai-based travel consultancy serving leisure travellers, organisations and groups equally. The single page follows this fixed sequence:

**Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer**

The conversion path is discovery, contextual package or service selection, one inline enquiry and an explicit WhatsApp continuation. There is no booking engine, payment flow, account system, CMS or automatic redirect.

## Enhanced B direction

- Editorial Intelligence supplies the full-page hierarchy, typography and trust-first pacing.
- Cinematic Services is an inseparable Enhanced B chapter, not a separate A variant.
- Packages uses a scroll-led depth carousel on desktop and native rails on smaller screens.
- Hero, Services and Reviews include attached poster-first ambient video families.
- NUBA, Black Tomato, Visit Jersey, Going, Homo Travellus and Alethia remain inspiration references only; do not reproduce their assets or identifiable compositions.

## Visual system

- Deep ink `oklch(14% .034 230)` is the continuous canvas.
- Raised and form inks use nearby tonal steps rather than alternating light themes.
- Pearl `oklch(96% .012 86)` is the primary text color; mist and soft pearl carry secondary copy.
- Cyan `oklch(73% .125 205)` is reserved for primary actions, focus, active states and small brand signals.
- Display typography is self-hosted Instrument Serif 400; body and UI use self-hosted Manrope Variable.
- Content width is 1360 px; panels use 14 px radii; interactive controls are fully rounded.
- Glass is limited to navigation, proof dock, the foreground service panel, itinerary sheet and enquiry form. Reduced transparency uses solid ink.
- Avoid repetitive cards, decorative numbering, badges, raw glyphs, excessive glass and unsupported proof.

## Canonical components

- Adaptive modal navigation with About, Services, Packages, Reviews and Get a quote.
- Two-line poster-first Hero with `discovery` desktop/mobile video and two actions.
- Verified four-item proof dock, editorial About and immersive Vision and Mission.
- Six-capability Services progression: Tour Packages, Flights, Accommodation, Visas, Meeting Incentive, Conference Event (MICE), and Corporate Travel.
- Eight-reason trust wall with mobile expanders.
- Six-package depth carousel, responsive rails and accessible itinerary sheet.
- Verification-gated Reviews with `travellers` background media.
- Inline conditional Enquiry with consent, validation, API fallback and explicit WhatsApp continuation.

## Motion and media

- Preserve native scrolling; never add mandatory snapping or scroll hijacking.
- Use 120 ms feedback, 240–420 ms state changes and 650–800 ms chapter entrances.
- Use transforms and opacity; reserve clipping for signature media transitions.
- Hero `discovery` video mounts after first paint. Services `operations` and Reviews `travellers` mount near their chapters and pause off-screen.
- Capable phones receive mobile video sources. Reduced motion, Save-Data, 2G, low memory and playback failure remain poster-only.
- GSAP ScrollTrigger communicates Services progression; Flip communicates itinerary continuity. Reduced motion removes both spatial behaviors.

## Responsive and accessibility rules

- Below 700 px: normal flow, service accordion, trust expanders and one-card-plus-peek package rail.
- 700–1099 px: shortened Services progression and two-card package rail.
- 1100 px and above: full Services progression and three-card depth stage.
- Minimum 320 px width, zero page overflow, 44 px targets and WCAG 2.2 AA contrast.
- Menus and dialogs require focus containment, Escape dismissal, inert backgrounds and focus restoration.
- Draft testimonials, hidden prices and unsupported claims must never bypass typed verification selectors.

## Standard interface language

Use only: `Explore packages`, `View itinerary`, `Get a quote`, `Send enquiry`, and `Continue in WhatsApp`.
