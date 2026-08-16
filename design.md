# Dream Drifters Design Record

Last updated: 15 August 2026

This is the canonical design record for the current Dream Drifters Codex project. It describes the implemented experience rather than the superseded concepts retained under `reference/` and `.superdesign/`.

## Product intent

Dream Drifters is a Chennai-based travel consultancy serving leisure travellers, corporate buyers and groups. The website should feel cinematic, assured and personal while making it easy to move from inspiration to a clear enquiry.

The approved single-page sequence is:

**Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer**

The primary conversion path is package or service discovery followed by an inline enquiry and an explicit WhatsApp continuation. There is no booking engine, payment flow, account system, CMS or automatic WhatsApp redirect.

## Design direction

- Tone: premium, cinematic, editorial, trustworthy and operationally competent.
- Primary visual references: NUBA for full-bleed luxury travel pacing and Black Tomato for emotion-led storytelling.
- Supporting references: Visit Jersey for mobile discovery, Going for hierarchy discipline and Homo Travellus for guided selection.
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

### Proof, About and Purpose

- The proof dock contains only four verified operational facts, not unsupported traveller totals or satisfaction percentages.
- About uses a large editorial image and concise company positioning.
- Vision and Mission share one immersive image chapter with two restrained statements.

### Services

Six services are preserved:

1. Corporate Travel
2. Flights
3. Hotels
4. Visa Consultancy
5. Travel Insurance
6. Events and Incentives

Desktop uses a 360 svh GSAP-pinned progression. Tablet uses a shorter paired sequence. Mobile uses a single-open accessible accordion.

### Why Us

Eight trust reasons are presented as editorial rows. They become expandable on mobile and a two-column reading wall on larger screens.

### Packages and itinerary

- Six original journeys, inclusions and itineraries are preserved.
- Mobile uses a native horizontal rail with visible previous and next controls.
- Larger layouts use an asymmetric editorial grid.
- “View itinerary” opens an accessible full-screen sheet with GSAP entrance and shared-image continuity.
- Package selection prefills the enquiry form and announces the change.
- Stored prices are currently hidden; the interface requests a current quote until the owner verifies them.

### Reviews

- All supplied testimonials remain typed as drafts and do not render as verified endorsements.
- Until verification, the chapter displays service-process assurance and notes that references are available directly.

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
- Off-screen ambient videos pause and lower-page videos are mounted only near their chapters.
- Reduced motion removes video, pinning, scrubbing and spatial transitions while keeping all content functional.

### Important current limitation

Ambient video currently requires a viewport of at least 1100 px. It is also disabled by reduced motion, Save-Data, a reported 2G connection or reported device memory below 4 GB. Consequently, phones always display static posters. Most remaining microanimations are subtle, one-time or hover-led, so the mobile experience can feel almost static. This was identified after the Sites deployment and is the primary unresolved experience concern.

## Responsive behavior

- Below 700 px: document flow, service accordion, expandable trust rows and package rail.
- 700–1099 px: paired service progression and tablet layouts.
- 861 px and above: desktop navigation replaces the modal menu.
- 1100 px and above: full service progression and ambient background video become eligible.
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

