# Dream Drifters Project Memory

Last updated: 15 August 2026

This file is the durable handoff record for the Dream Drifters website revamp. It captures the work completed, decisions made, current deployment state and remaining risks so another engineer or Codex task can continue without reconstructing the history.

## Current state

- Project type: Codex project.
- Stack: Vite 8, React 19, TypeScript, GSAP, Phosphor Icons, Vitest and Playwright.
- Architecture: one semantic single-page application plus `/api/enquiry` handlers for Vercel and Cloudflare Workers/Sites.
- Canonical flow: Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer.
- Git branch: `main`.
- Initial commit: `ad08637` — Initial Dream Drifters Codex project.
- Sites commit: `864c27b` — Add OpenAI Sites deployment.
- Public Sites URL: https://dream-drifters-codex-preview.yenkay.chatgpt.site/
- Sites access: public and shareable without a common Wi-Fi network.
- Working tree was clean immediately before these documentation files were added.

## Progress timeline

### 1. Source recovery and baseline

- The supplied website archive was imported and preserved under `reference/archive/`.
- The original `index.html`, `.dc.html` artifacts, brand marks, packages, services, itineraries, testimonials and Chennai contact content were retained as source references.
- `.dc.html` files were treated as non-deployable artifacts.
- The supplied Dream Drifters brand mark was preserved in the live interface.

### 2. Research and first design direction

- Travel references were evaluated through NUBA, Black Tomato, Visit Jersey, Going and Homo Travellus.
- The initial direction shifted away from a SaaS-style cyan page toward cinematic luxury-editorial storytelling.
- A Superdesign context and design-system record were created under `.superdesign/`.
- Explorer was selected as the preferred early concept, prioritising destination discovery and enquiry access.

### 3. Original-flow correction

- The first Explorer journey did not preserve enough of the original company narrative.
- The experience was restructured to the exact original trust-first order now used by the site.
- Corporate capability, all six services, all eight trust reasons, all six packages and the original final enquiry position were restored.
- The planner overlay was replaced with one inline enquiry form.

### 4. Cinematic implementation

- The site was rebuilt with Vite, React and TypeScript.
- Local WebM/MP4 video loops and AVIF/WebP posters were added for destination discovery, travel operations and human journey moments.
- The hero, purpose, services and reviews chapters received full-bleed or layered cinematic media.
- Glassmorphism was constrained to functional foreground surfaces.
- GSAP ScrollTrigger and Flip were dynamically loaded for service progression and itinerary transitions.
- Content was moved into typed data modules instead of being embedded in presentation components.

### 5. Full UI scrutiny and correction

The major audit identified excessive page length, missing mobile-menu containment, repeated template patterns, unverified claims, eager media, external fonts, oversized initial JavaScript, inconsistent CTA language and accessibility gaps.

Corrections completed:

- Locked the interface to a cohesive ink theme with restrained cyan.
- Self-hosted Instrument Serif and Manrope Variable.
- Replaced raw glyphs with Phosphor Icons.
- Removed decorative numbering, visible draft labels, package badges and unsupported public proof.
- Standardised CTAs and reduced repetitive eyebrow labels.
- Added verified operational proof records.
- Hid unverified prices and testimonials through typed selectors.
- Added mobile service accordion, trust expanders and package rail.
- Added a real pinned service sequence for tablet and desktop.
- Added menu focus trapping, inert background, Escape behavior, scroll locking and focus restoration.
- Added contextual accessible names, error associations, error summary, success focus and privacy dialog.
- Added reduced-motion and reduced-transparency policies.
- Added responsive posters, lazy media mounting and off-screen video pausing.
- Replaced direct scroll listeners with IntersectionObserver-based behavior.

### 6. Enquiry and WhatsApp handoff

- `EnquiryBrief` supports package, service and custom interests.
- Package and service CTAs prefill the inline enquiry immediately and announce the selection.
- Package enquiries conditionally require travel timing, party and budget information.
- Server validation normalises input, enforces request limits and performs honeypot and submission-timing checks.
- Personal information is not persisted or intentionally logged.
- Meta Cloud API notification is supported when the required environment values exist.
- Backend failure returns a safe WhatsApp fallback.
- Users always choose the explicit “Continue in WhatsApp” action; no unsolicited redirect occurs.
- Privacy-safe analytics record interaction names and identifiers without form values or PII.

### 7. Verification completed

- Production builds pass.
- Seven Vitest files and 16 unit/component tests pass after the Sites migration.
- Earlier Playwright verification passed 18 journeys at 390 px, 768 px and 1440 px.
- Existing browser coverage includes section order, anchors, page-height budgets, horizontal overflow, menu containment, responsive services, package/service prefilling, conditional form validation, API fallback and accessibility checks.
- The Sites-hosted root was independently requested and returned HTTP 200 with the Dream Drifters document.
- Local Cloudflare preview confirmed `/api/enquiry` returns the structured WhatsApp fallback when Meta credentials are absent.

### 8. Source control

- A new local Git repository was established on `main`.
- The README identifies the work as a Codex project.
- Generated output, test artifacts, environment files, local Wrangler state and temporary artifacts are ignored.
- The validated deployment source was committed and pushed to the Sites source repository.

### 9. Remote preview and deployment

- A temporary Cloudflare tunnel was first used to make the local server reachable from a phone outside the LAN.
- That tunnel was replaced by a durable OpenAI Sites deployment.
- The project now uses `@openai/sites-vite-plugin` and the Cloudflare Vite plugin.
- A Cloudflare Worker entry point mirrors the enquiry validation and Meta/WhatsApp fallback behavior.
- The Sites deployment is public and shareable at the URL listed above.

### 10. Latest motion diagnosis

- All video files were verified as reachable; missing playback was not caused by broken assets or the tunnel.
- The implemented media policy requires a viewport of at least 1100 px, so phones never mount background video.
- Reduced motion, Save-Data, 2G and low-memory detection add further video suppression.
- Reduced-motion CSS also shortens animations to effectively instant feedback.
- Many microanimations are hover-dependent and therefore not visible on touchscreens.
- The mobile experience currently relies on posters, a one-time hero reveal, scroll reveals, accordion motion, menu motion, button press feedback and itinerary entry.
- This behavior matches the earlier performance policy but conflicts with the newer expectation of a visibly cinematic mobile experience.

## Content and verification status

- Four operational proof items are marked verified and currently render.
- Six testimonials remain drafts and are excluded from public rendering.
- All six stored package prices are marked hidden and display as requests for a current quote.
- The six packages, all itineraries, service descriptions and Chennai contact details remain business-owner draft content pending final review.
- Temporary Coverr footage is documented in `public/media/README.md`.
- Static stock-image licensing still needs a complete production trail.

## Environment configuration

The live notification path requires:

- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`
- `BUSINESS_OWNER_PHONE_NUMBER`
- `META_MESSAGE_TEMPLATE`
- `META_TEMPLATE_LANGUAGE`
- `META_GRAPH_API_VERSION`
- `VITE_WHATSAPP_NUMBER`

Until the Meta values are configured on Sites, form submission intentionally offers the explicit WhatsApp fallback.

## Known remaining work

1. Decide whether mobile ambient video should be enabled under a controlled performance budget.
2. Add touch-visible microinteractions and scroll choreography that do not depend on hover.
3. Re-test motion on physical iOS and Android devices, including reduced motion and Data Saver.
4. Configure and verify the Meta WhatsApp template and production phone values on Sites.
5. Confirm all package prices, company facts, contact details and testimonials with the business owner.
6. Replace or license every temporary image and video.
7. Approve final privacy copy, canonical domain, Open Graph image and business structured data.
8. Complete the final Lighthouse, screen-reader and real-device launch review.

## Continuation rules

- Preserve the approved section order unless the owner explicitly changes it.
- Preserve one continuous ink theme, sparse cyan and restricted glass surfaces.
- Do not expose draft testimonials, hidden prices or unsupported numeric claims.
- Do not reintroduce automatic WhatsApp redirects.
- Keep native scrolling and accessible reduced-motion alternatives.
- Any mobile-video change must include a poster fallback, playback-failure state, off-screen pause behavior and a measurable media budget.
- Update both `design.md` and `memory.md` when a major design, architecture, deployment or content-verification decision changes.

## Useful commands

```bash
npm install
npm run dev
npm run build
npm test
npm run test:e2e
```

