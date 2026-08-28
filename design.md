# Dream Drifters Design Record

Last updated: 25 August 2026

This is the canonical design specification for the current Dream Drifters Codex project. The sole production source of truth is **Enhanced B**, the approved Editorial Intelligence experience with cinematic Services, a user-controlled package carousel and its attached video-background system. Superseded concepts remain available only as labelled historical references under `reference/` and `.superdesign/website/`.

Validated deployed implementation commit: `328178f`. The public Vercel release is available at https://dream-drifters.vercel.app/. The OpenAI Sites address remains an independent preview deployment. Visual-scrutiny corrections are being completed on `codex/visual-system-scrutiny`; they are not deployed and remain subject to the media-approval and final validation gates recorded in `PROJECT_STATUS.md`.

## Product intent

Dream Drifters is a Chennai-based travel consultancy serving leisure travellers, corporate buyers and groups. The website should feel cinematic, assured and personal while making it easy to move from inspiration to a clear enquiry.

The approved single-page sequence is:

**Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Assurance → Enquiry → Footer**

The primary conversion path is package or service discovery followed by an inline enquiry and an explicit WhatsApp continuation. There is no booking engine, payment flow, account system, CMS or automatic WhatsApp redirect.

## Design direction

- Tone: premium, cinematic, editorial, trustworthy and operationally competent.
- Primary visual references: NUBA for full-bleed luxury travel pacing and Black Tomato for emotion-led storytelling.
- Supporting references: Visit Jersey for mobile discovery, Going for hierarchy discipline and Homo Travellus for guided selection.
- Canonical artifact: Enhanced B, a single production direction that combines Editorial Intelligence, cinematic Services, a desktop scroll-linked depth carousel and attached ambient video backgrounds.
- Provenance: the cinematic Services treatment originated in prototype A, but it is now an inseparable Enhanced B component rather than a separate active variant.
- Motion reference: Alethia's connected-scene principle, adapted without scroll hijacking or copied assets.
- Brand continuity: preserve the supplied Dream Drifters mark and use cyan as a rare interaction signal.
- Avoid: SaaS-like cyan layouts, repetitive card grids, decorative numbering, generic badges, excessive glass, raw symbol icons and unsupported proof claims.

## Visual system

### Palette

The implemented site uses one continuous dark ink family rather than alternating unrelated light and dark themes.

- Deep ink: `oklch(14% .034 230)`
- Raised ink: `oklch(18% .036 228)`
- Form and panel ink: `oklch(22% .038 225)`
- Pearl text: `oklch(96% .012 86)`
- Soft pearl: `oklch(86% .018 85)`
- Mist metadata: `oklch(73% .025 210)`
- Brand cyan: `oklch(73% .125 205)`
- Error: `oklch(76% .13 28)`
- Success: `oklch(78% .105 155)`

Cyan is reserved for primary actions, active states, focus rings, selected metadata and small identity moments.

### Typography

- Display: self-hosted Instrument Serif, weight 400.
- Body and interface: self-hosted Manrope Variable.
- Functional text uses `clamp(14px, 13.44px + .16vw, 16px)`; body and inputs never fall below 16px.
- Section display text uses `clamp(56px, 6.6vw, 120px)`. The two-line desktop Hero uses 96–144px, approximately .87 line-height and -.035em tracking, with a short-desktop cap of 136px and at least 12px optical clearance before its lead.
- Headings use compressed line-height and restrained negative tracking; body copy is limited to readable editorial measures.
- Eyebrow labels are intentionally rare and currently limited to high-value chapter markers.

### Geometry and surfaces

- Maximum content width: 1360 px.
- Standard panel radius: 14 px.
- Interactive controls: fully rounded pills or circular icon buttons.
- Media frames: sharp or minimally rounded to retain an editorial character.
- Glass is limited to navigation, proof dock, foreground service panel, itinerary sheet and enquiry form.
- Reduced-transparency and unsupported-backdrop-filter modes use solid ink surfaces.

## Section design

### Navigation

- Fixed adaptive navigation with the brand mark, About, Services, Packages, Assurance and Get a quote. Assurance retains the historical `#reviews` anchor for compatible links.
- Navigation is transparent only at the exact page top, gains its ink glass surface during the first deliberate scroll (8px/24px hysteresis), and keeps that surface through every later chapter.
- Mobile navigation behaves as a modal: focus containment, background inertness, scroll locking, Escape dismissal and focus restoration.
- The active chapter is exposed with `aria-current`.

### Hero

- Poster-first, full-viewport cinematic composition.
- Headline remains exactly two lines: “Your journey.” and “Our passion.”
- Actions are “Explore packages” and “Get a quote.”
- Copy enters with a short stagger; the poster remains the stable fallback.
- The approved `hero-tropical-aerial` family mounts after first paint on capable devices. It selects a dedicated 1080×1920 mobile crop or a 1920×1080, 2560×1440 or native 3840×2160 desktop encode, and the matching poster remains visible until the first video frame is decoded.

### Proof, About and Purpose

- The proof dock contains only four verified operational facts, not unsupported traveller totals or satisfaction percentages.
- About uses a large editorial image and concise company positioning.
- Vision and Mission share one immersive image chapter with two restrained statements.
- Direction behaves as a calm editorial bridge: its train-window media remains full-bleed, while Vision and Mission sit in one transparent divided surface without glass-card layering.
- Direction media does not scale during scroll. Its heading and statement reveals use short, low-distance movement, and short/narrow viewports preserve a quiet tail before Services.
- Direction requires at least 55% viewport ownership before exposing its playback control; the control sits near the chapter top when available and disappears before Services takes ownership.
- At 1424×696, 1366×768 and 1440×900, About stays within one viewport with a 420–620px height-aware media frame. The side-by-side split starts at 1000px, leaving the 768px composition stacked.

### Services

Six public capabilities are preserved:

1. Tour Packages
2. Flights
3. Accommodation
4. Visas
5. Events & Incentives, with the internal `mice` enquiry identifier preserved
6. Corporate Travel

Desktop and tablet use a 520 svh GSAP-pinned progression around a 100 svh stage, producing six equal 70 svh capability steps. A single unblurred operations-video stage holds one active service, concise progress and accessible previous/next controls. Mobile remains in natural document flow with a poster/video header and a single-open accessible accordion. Reduced motion removes pinning and autoplay while keeping the poster, one active capability and direct controls. Travel Insurance is not exposed publicly; legacy insurance submissions remain accepted by the API.

The attached `operations` WebM/MP4 loop is part of this chapter's canonical background treatment. It lazy-mounts near Services and falls back to its poster whenever ambient playback is inappropriate or unavailable.

The operations family is the only active Services imagery. Destination/package stills are not reused as capability decoration.

### Why Us

Eight trust reasons are presented as editorial rows. They become expandable on mobile and a two-column reading wall on larger screens.

### Packages and itinerary

- Six original journeys, inclusions and itineraries are preserved.
- Desktop Packages uses a `360svh` pinned depth sequence across six journeys. Its opening 8% is an intentional rest plateau: Maldives is fully composed, every other card is hidden, and no transition begins until meaningful scroll input.
- During desktop progression, no more than two photographs move within the clipped right-hand deck. One complete package body remains fully legible, and a shared depth state keeps its visual dominance, counter, live announcement and analytics synchronized. Previous and next controls, horizontal swipe, and Left or Right keyboard input move to exact composed stops and wrap across all six packages. Home and End move directly to the first and final package.
- Tablet and mobile stay in natural document flow with one stacked package card, equal itinerary/quote actions, wraparound controls and no side peeks.
- Reduced motion removes package pinning and depth layers, retaining the immediate controlled carousel.
- “View itinerary” opens an accessible full-screen sheet with GSAP entrance and shared-image continuity.
- Package selection prefills the enquiry form and announces the change.
- Stored prices are currently hidden; the interface requests a current quote until the owner verifies them.

### Assurance

- All supplied testimonials remain typed as drafts and do not render as verified endorsements.
- The visible chapter is titled “Support you can see.” and always presents three operating commitments: a named point of contact, clear options before commitment and support through the journey.
- Public copy does not describe the testimonial verification process. If approved testimonials enter the existing verified selector, they may render after the commitments.
- The attached `travellers` WebM/MP4 loop provides the chapter background on capable devices and otherwise remains a stable poster composition.

### Enquiry

- One adaptive inline form replaces the earlier planner overlay.
- Interests can be package, service or custom.
- Package enquiries always use two inline stages: travel intent/details, then contact/notes/consent/submission.
- Custom and service enquiries remain compact on desktop at least 861px wide and 820px high; short desktop, tablet and mobile use the same two-stage treatment.
- Back preserves values. Stage changes expose progress semantics, announce the new stage and move focus to its heading.
- Name, mobile, email and consent remain required.
- Successful submission presents an inline review state and an explicit “Continue in WhatsApp” action.
- The site never redirects to WhatsApp automatically.

## Motion and media

- Native scrolling is always preserved.
- Hero entrance: approximately 720 ms with staggered delays.
- Content reveal: 680 ms opacity and transform.
- Feedback: 120 ms; state changes: 240–420 ms; media transitions: 650–720 ms.
- Easing favours quart and quint-style deceleration without bounce or elastic movement.
- GSAP ScrollTrigger powers service progression; GSAP Flip supports itinerary continuity.
- A shared editorial motion director connects ambient chapters through restrained reveals, pan and crossfade relationships; Direction intentionally omits media scaling. Desktop Packages uses its own ScrollTrigger depth progression after a stable rest plateau; compact and reduced-motion modes remain manually controlled.
- Off-screen ambient videos pause and lower-page videos are mounted only near their chapters.
- Capable phones may use the dedicated portrait WebM or MP4 loop after the poster and first paint.
- Reduced motion removes automatic video playback, pinning, scrubbing and spatial transitions while keeping all content functional. A visitor may still request video through the accessible play control.
- Hero remains poster-only for Save-Data, 2G/slow-2G, reduced-motion and low-memory modes. Later ambient chapters retain their explicit playback recovery where a valid source is available.
- Browser autoplay rejection keeps the video mounted and exposes a manual Play video control. MP4 is listed before WebM for Chrome reliability; decoding or network failure leaves the poster stable.

Enhanced B includes three required ambient-media assignments:

| Chapter | Video family | Mounting policy | Poster policy |
|---|---|---|---|
| Hero | `hero-tropical-aerial` | Adaptive MP4-first pair delayed until after first paint | Eager responsive first-frame poster |
| Services | `operations` | Lazy-mounted near the chapter | Lazy poster retained through failure |
| Assurance | `travellers` | Lazy-mounted near the chapter | Lazy poster retained through failure |

Both WebM and MP4 encodes are required for each assignment. Mobile-specific video sources are used below 700 px when the device passes the motion, bandwidth and memory policy. Detailed filenames, budgets and licensing notes are maintained in `public/media/README.md`.

The typed registry in `src/data/media.ts` records source family, chapter, focal point, adaptive selection conditions, video and poster outputs, licence/consent status and replacement state. Active Hero, About, Direction, Services, Assurance and Enquiry assignments are unique and do not borrow package files. Hero, About and the six package still families have recorded Pexels provenance, responsive 4K outputs and placement approval. Direction, Services, Assurance and Enquiry remain review-required, so the full site does not yet pass the production-media gate.

## Responsive behavior

- Below 700 px: document flow, service accordion, expandable trust rows and one stacked package card with touch navigation.
- 700–1099 px: pinned Services treatment and a single naturally flowing package card.
- 861 px and above: desktop navigation replaces the modal menu.
- 1100 px and above: full Services progression and the restored pinned package depth sequence with a complete initial rest state.
- Short-height desktop and tablet rules keep service context and its primary action inside the viewport.
- Below 820px height, custom and service enquiries switch to two stages so the contact action remains reachable without a second-page composition; package enquiries are staged at every size.
- Minimum supported width: 320 px.
- No horizontal page overflow is permitted.

## Accessibility and trust rules

- WCAG 2.2 AA contrast target and minimum 44 px touch targets.
- Semantic section headings, skip navigation and visible focus rings.
- Keyboard-operable menus, overlays, accordions, rails, dialogs and forms.
- Focus traps, Escape handling, background inertness and trigger-focus return.
- Form errors are associated with fields and summarized for focused correction.
- Reduced-motion and reduced-transparency alternatives are mandatory.
- Proof, prices and testimonials are filtered through typed verification metadata before rendering.
- Temporary stock media must pass the typed licence, consent and replacement gate before production launch. Current production media approval is blocked.

## Standard interface language

- Explore packages
- View itinerary
- Get a quote
- Send enquiry
- Continue in WhatsApp

Avoid introducing competing CTA terminology without updating this record and the associated tests.
