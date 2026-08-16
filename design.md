# Dream Drifters Design Record

Last updated: 16 August 2026

This is the canonical design specification for the current Dream Drifters Codex project. The sole production source of truth is **Enhanced B**, the approved Editorial Intelligence experience with cinematic Services, the depth package carousel and its attached video-background system. Superseded concepts remain available only as labelled historical references under `reference/` and `.superdesign/website/`.

Production implementation commit: `6cf0d4f`. Permanent Sites deployment is pending responsive visual approval.

## Product intent

Dream Drifters is a Chennai-based travel consultancy serving leisure travellers, corporate buyers and groups. The website should feel cinematic, assured and personal while making it easy to move from inspiration to a clear enquiry.

The approved single-page sequence is:

**Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer**

The primary conversion path is package or service discovery followed by an inline enquiry and an explicit WhatsApp continuation. There is no booking engine, payment flow, account system, CMS or automatic WhatsApp redirect.

## Design direction

- Tone: premium, cinematic, editorial, trustworthy and operationally competent.
- Primary visual references: NUBA for full-bleed luxury travel pacing and Black Tomato for emotion-led storytelling.
- Supporting references: Visit Jersey for mobile discovery, Going for hierarchy discipline and Homo Travellus for guided selection.
- Canonical artifact: Enhanced B, a single production direction that combines Editorial Intelligence, cinematic Services, the depth package carousel and attached ambient video backgrounds.
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
- Headings use large fluid sizes, compressed line-height and restrained negative tracking.
- Body copy is limited to readable editorial measures.
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

- Fixed adaptive navigation with the brand mark, About, Services, Packages, Reviews and Get a quote.
- Navigation gains an ink glass surface after the hero.
- Mobile navigation behaves as a modal: focus containment, background inertness, scroll locking, Escape dismissal and focus restoration.
- The active chapter is exposed with `aria-current`.

### Hero

- Poster-first, full-viewport cinematic composition.
- Headline remains exactly two lines: “Your journey.” and “Our passion.”
- Actions are “Explore packages” and “Get a quote.”
- Copy enters with a short stagger; the poster remains the stable fallback.
- The attached `discovery` WebM/MP4 loop mounts after first paint on capable devices; desktop and mobile posters remain visible until playback is ready.

### Proof, About and Purpose

- The proof dock contains only four verified operational facts, not unsupported traveller totals or satisfaction percentages.
- About uses a large editorial image and concise company positioning.
- Vision and Mission share one immersive image chapter with two restrained statements.

### Services

Six public capabilities are preserved:

1. Tour Packages
2. Flights
3. Accommodation
4. Visas
5. Meeting Incentive, Conference Event (MICE)
6. Corporate Travel

Desktop uses a 360 svh GSAP-pinned progression with full-bleed operations media, a six-scene active index and a restrained foreground panel. Tablet uses a shorter pinned treatment containing the same six capabilities. Mobile uses a single-open accessible accordion. Travel Insurance is not exposed publicly; legacy insurance submissions remain accepted by the API.

The attached `operations` WebM/MP4 loop is part of this chapter's canonical background treatment. It lazy-mounts near Services and falls back to its poster whenever ambient playback is inappropriate or unavailable.

### Why Us

Eight trust reasons are presented as editorial rows. They become expandable on mobile and a two-column reading wall on larger screens.

### Packages and itinerary

- Six original journeys, inclusions and itineraries are preserved.
- Desktop uses a 360 svh depth-of-field stage. Vertical progress maps continuously across all six packages, with a sharp centre card, blurred adjacent cards, counter-panning destination typography and no autoplay or looping.
- Previous and next controls, adjacent-card promotion, pointer dragging and Left or Right keyboard input all update the active package and its live announcement.
- Tablet uses an unpinned two-card native rail with side peeks and no blur.
- Mobile uses a one-card-plus-peek native rail with visible previous and next controls and no blur.
- Reduced motion replaces the depth stage with a static editorial grid.
- “View itinerary” opens an accessible full-screen sheet with GSAP entrance and shared-image continuity.
- Package selection prefills the enquiry form and announces the change.
- Stored prices are currently hidden; the interface requests a current quote until the owner verifies them.

### Reviews

- All supplied testimonials remain typed as drafts and do not render as verified endorsements.
- Until verification, the chapter displays service-process assurance and notes that references are available directly.
- The attached `travellers` WebM/MP4 loop provides the chapter background on capable devices and otherwise remains a stable poster composition.

### Enquiry

- One inline form replaces the earlier multi-step planner overlay.
- Interests can be package, service or custom.
- Package enquiries reveal travel window, party and budget fields.
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
- A shared editorial motion director connects Hero to proof, About to Purpose, Purpose to Services, Trust to Packages, Packages to Reviews and Reviews to Enquiry through restrained scale, pan and crossfade relationships.
- Off-screen ambient videos pause and lower-page videos are mounted only near their chapters.
- Capable phones may use the supplied mobile WebM or MP4 loops after the poster and first paint.
- Reduced motion removes automatic video playback, pinning, scrubbing and spatial transitions while keeping all content functional. A visitor may still request video through the accessible play control.
- Save-Data, 2G and low-memory modes start with stable poster-only scenes and do not spend video data until the visitor explicitly requests playback.
- Browser autoplay rejection keeps the video mounted and exposes a manual Play video control. MP4 is listed before WebM for Chrome reliability; decoding or network failure leaves the poster stable.

Enhanced B includes three required ambient-media assignments:

| Chapter | Video family | Mounting policy | Poster policy |
|---|---|---|---|
| Hero | `discovery` | Delayed until after first paint | Eager responsive hero poster |
| Services | `operations` | Lazy-mounted near the chapter | Lazy poster retained through failure |
| Reviews | `travellers` | Lazy-mounted near the chapter | Lazy poster retained through failure |

Both WebM and MP4 encodes are required for each assignment. Mobile-specific video sources are used below 700 px when the device passes the motion, bandwidth and memory policy. Detailed filenames, budgets and licensing notes are maintained in `public/media/README.md`.

## Responsive behavior

- Below 700 px: document flow, service accordion, expandable trust rows, one-card package rail and touch-visible transitions.
- 700–1099 px: shortened pinned Services treatment and two-card package rail.
- 861 px and above: desktop navigation replaces the modal menu.
- 1100 px and above: full Services progression and desktop package depth stage.
- Short-height desktop and tablet rules keep service context and its primary action inside the viewport.
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
- Temporary stock media must be replaced or fully licensed before production launch.

## Standard interface language

- Explore packages
- View itinerary
- Get a quote
- Send enquiry
- Continue in WhatsApp

Avoid introducing competing CTA terminology without updating this record and the associated tests.
