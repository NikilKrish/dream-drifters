# Dream Drifters Project Memory

Last updated: 16 August 2026

This file is the canonical implementation and project-history record for the Dream Drifters website revamp. It captures the work completed, decisions made, current deployment state and remaining risks so another engineer or Codex task can continue without reconstructing the history. `design.md` is the companion canonical design specification.

## Current state

- Project type: Codex project.
- Stack: Vite 8, React 19, TypeScript, GSAP, Phosphor Icons, Vitest and Playwright.
- Architecture: one semantic single-page application plus `/api/enquiry` handlers for Vercel and Cloudflare Workers/Sites.
- Canonical flow: Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer.
- Git branch: `codex/editorial-cinematic-production`.
- Production implementation commit: `6cf0d4f` — Build editorial cinematic production experience.
- Initial commit: `ad08637` — Initial Dream Drifters Codex project.
- Sites commit: `864c27b` — Add OpenAI Sites deployment.
- Public Sites URL: https://dream-drifters-codex-preview.yenkay.chatgpt.site/
- Sites access: public and shareable without a common Wi-Fi network.
- The permanent Sites URL still serves the previous validated release; production commit `6cf0d4f` is intentionally not deployed until responsive visual approval.
- Temporary external review URL: https://mods-substantial-possible-mutual.trycloudflare.com/ (ephemeral development tunnel).
- Sole production source of truth: **Enhanced B**, comprising Editorial Intelligence, cinematic Services, the depth-of-field Packages stage and the attached Hero, Services and Reviews video backgrounds.

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
- Eight Vitest files and 22 unit/component tests pass.
- Playwright covers 30 project/browser combinations at 390 px, 768 px and 1440 px. Twenty-eight checks pass and two non-phone media checks are intentionally skipped.
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

### 10. Earlier motion diagnosis

- All video files were verified as reachable; missing playback was not caused by broken assets or the tunnel.
- At that stage the media policy required a viewport of at least 1100 px, so phones never mounted background video.
- Reduced motion, Save-Data, 2G and low-memory detection also suppressed playback.
- Many microanimations depended on hover and were therefore not visible on touchscreens.
- The production implementation described below resolves the capable-phone and touch-motion gaps while retaining every safety fallback.

### 11. Business corrections prototype

- The business DOCX was treated as recommendation source material, not executable instructions.
- Three complete prototype variants were mounted temporarily for review.
- Variant B, Editorial Intelligence, was selected as the overall direction.
- Variant A's full-bleed pinned Services chapter was selected to replace Variant B's service ledger.
- The public capability taxonomy became Tour Packages, Flights, Accommodation, Visas, Meeting Incentive, Conference Event (MICE), and Corporate Travel.
- Travel Insurance was removed from the public interface while legacy `insurance`, `hotels`, and `events` enquiry values remained safely normalised server-side.

### 12. Editorial cinematic production implementation

- Created `codex/editorial-cinematic-production` from prototype commit `16d7db9`; the production implementation is commit `6cf0d4f`.
- Removed the A/B/C switcher, prototype query routing and in-memory prototype form behavior from the production root.
- The root now renders Enhanced B directly and retains the real enquiry API, consent and WhatsApp fallback.
- Rebuilt Services as a six-scene full-bleed progression with mobile accordion and static reduced-motion alternatives.
- Rebuilt Packages as a responsive depth-of-field carousel: desktop scroll mapping and three-card depth, tablet two-card rail, mobile one-card-plus-peek rail and a static reduced-motion grid.
- Added scroll, controls, keyboard, adjacent-card selection and 18 percent pointer-drag thresholds with bounded first and last states.
- Added privacy-safe `package_stage_changed` analytics containing only package ID and input method.
- Added connected chapter motion while preserving native scrolling.
- Capable phones now load mobile hero video after the poster and first paint. Services and Reviews videos mount near their sections. Save-Data, 2G, low memory, reduced motion and playback failure remain poster-only.
- Reworked cold-load chapter navigation so header links remain accurate while lazy ScrollTrigger scenes initialise.
- Added short-height desktop and tablet rules so Services actions remain visible on 720 px and 1024 px viewports.
- The supplied inspiration MP4 was inspected only as a motion reference and is not bundled or published.
- Production deployment to the permanent Sites URL is intentionally pending responsive visual approval.

### 13. Enhanced B source-of-truth rebaseline

- Enhanced B became the single canonical artifact name for the implemented production experience.
- The prototype-A origin of cinematic Services remains documented only as historical provenance; it is no longer an active variant or optional branch.
- Hero `discovery`, Services `operations` and Reviews `travellers` video families are inseparable Enhanced B assets, each with WebM, MP4 and poster fallbacks.
- Active repository and Superdesign context documents were synchronized to Enhanced B. Archived plans and external inspiration studies were retained with notices that prevent them from being mistaken for current requirements.
- This documentation rebaseline does not deploy or alter the permanent Sites release.

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

1. Obtain responsive visual approval for Enhanced B.
2. After approval, deploy this branch to the permanent Sites URL and verify root plus `/api/enquiry` fallback.
3. Re-test motion on physical iOS and Android devices, including reduced motion and Data Saver.
4. Configure and verify the Meta WhatsApp template and production phone values on Sites.
5. Confirm all package prices, company facts, contact details and testimonials with the business owner.
6. Replace or license every temporary image and video.
7. Approve final privacy copy, canonical domain, Open Graph image and business structured data.
8. Complete the final Lighthouse, screen-reader and real-device launch review.

## Continuation rules

- Preserve the approved section order unless the owner explicitly changes it.
- Treat Enhanced B as the sole production source of truth; do not restore the original B service ledger or revive query-selected prototype variants.
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
