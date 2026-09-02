# Brochure-Backed Travel Package Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Represent all six brochures within the existing package-card experience by adding five destinations and updating Bali, producing an 11-card carousel with structured brochure-derived details.

**Architecture:** Keep the existing catalogue, carousel, itinerary sheet, and enquiry flow. Extend the package model with optional brochure sections for schedules, accommodation, exclusions, commercial conditions, and honest incomplete-information notices.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, GSAP, Pexels package media, Vercel.

**Spec:** Conversation-approved plan dated 2026-09-01.

## Global Constraints

- Final catalogue order: Maldives, Japan, Switzerland, Bali, Paris, Dubai, Magnificent Mexico, Tanzania Escape, USA 2026, Machu Picchu Peru, Ramakkalmedu.
- Bali is updated rather than duplicated, yielding 11 package records.
- Verified prices are Mexico `$1,513.00`, Tanzania `$2,185 PP`, and Bali `US $357`; all other prices remain hidden.
- Preserve brochure currencies, dates, durations, minimum party sizes, inclusions, exclusions, and conditions without conversion or inference.
- Brochure pages are content sources only; cards use clean licensed destination photographs.
- Only visually verified brochure content may be published. Missing day-by-day content uses: `Detailed day-by-day itinerary will be confirmed by Dream Drifters.`
- The existing card visual language, focus behavior, quote flow, Google Sheet schema, and Apps Script deployment remain unchanged.
- Preserve unrelated working-tree changes.

---

### Task 1: Model brochure-backed content

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/packages.test.ts`
- Modify: `src/data/content.test.ts`

**Interfaces:**
- Produces `PackageDepartureSchedule`, `BrochureDetails`, and optional `TravelPackage.durationDays` for later tasks.

- [ ] Write failing tests expecting 11 unique packages, one Bali record, optional durations, exact brochure prices, and brochure provenance.
- [ ] Run `npm test -- src/data/packages.test.ts src/data/content.test.ts` and verify the new tests fail for missing data/model support.
- [ ] Add `PackageDepartureSchedule` and `BrochureDetails`; make `TravelPackage.durationDays` optional.
- [ ] Update price assertions so only brochure-verified prices are exposed.
- [ ] Re-run the targeted tests and commit `feat: model brochure-backed package content`.

### Task 2: Transcribe and add the brochure packages

**Files:**
- Modify: `src/data/packages.ts`
- Modify: `shared/brief.ts`
- Modify: `shared/brief.test.ts`

**Interfaces:**
- Consumes the Task 1 brochure interfaces.
- Produces IDs `mexico`, `tanzania`, `usa-2026`, `machu-picchu`, `ramakkalmedu`, and updated `bali`.

- [ ] Write failing assertions for the five new IDs, updated Bali, exact verified commercial values, and human-readable enquiry names.
- [ ] Add Mexico: 7 days/6 nights, Aug 25, double occupancy, `$1,513.00`, and the brochure highlights.
- [ ] Add Tanzania: 6 days/5 nights, `$2,185 PP`, minimum six travellers, hotels, inclusions, exclusions, and safari locations.
- [ ] Add USA 2026 with the six fixed-departure programmes and Aug-Nov schedule.
- [ ] Add Machu Picchu with verified service highlights and no inferred duration or itinerary.
- [ ] Add Ramakkalmedu with the verified 3-day/2-night itinerary.
- [ ] Update Bali to 6 nights/7 days, `US $357`, booking/stay dates, hotels, activities, and inclusions.
- [ ] Use empty itineraries plus the exact content notice where day-by-day content is absent.
- [ ] Run package, brief, and enquiry tests and commit `feat: add brochure travel packages`.

### Task 3: Add clean licensed destination media

**Files:**
- Create: responsive AVIF/WebP files under `public/media/`
- Modify: `src/data/media.ts`
- Modify: `src/data/media.test.ts`

**Interfaces:**
- Produces one `PackageMediaAsset` for every package ID and responsive source sets consumed by the carousel and sheet.

- [ ] Write a failing media test requiring one approved media record per package ID.
- [ ] Select Pexels landscape images for Chichen Itza, Serengeti safari, Statue of Liberty/New York, Machu Picchu, and Ramakkalmedu wind hills; require no logos or identifiable foreground people, at least 3840x2160, and safe 16:9 crops.
- [ ] Reuse the existing approved Bali image.
- [ ] Generate 3840x2160, 1920x1080, and 960x540 AVIF/WebP outputs.
- [ ] Register photographer, source URL, licence, download date, dimensions, crop rationale, focal point, and alt text.
- [ ] Run `npm test -- src/data/media.test.ts` and commit `feat: add brochure package media`.

### Task 4: Render structured brochure details

**Files:**
- Modify: `src/components/PackageSheet.tsx`
- Modify: `src/prototype/prototype.css`
- Create: `src/components/PackageSheet.test.tsx`

**Interfaces:**
- Consumes `TravelPackage.brochure` and conditionally renders only populated sections.

- [ ] Write failing component tests for commercial notes, accommodation, exclusions, accessible departure schedules, incomplete-content notices, and omitted empty sections.
- [ ] Render sections in order: key facts, departure schedule, highlights, accommodation, inclusions, exclusions, day-by-day itinerary, content notice.
- [ ] Render the USA schedule as an accessible table with caption and programme, duration, and month headers.
- [ ] Preserve focus trapping, Escape closing, reduced-motion behavior, and the quote CTA.
- [ ] Run the component tests and commit `feat: render brochure package details`.

### Task 5: Scale the carousel to eleven cards

**Files:**
- Modify: `src/components/DepthPackagesSection.tsx`
- Modify: `src/prototype/prototype.css`
- Modify: `tests/e2e/editorial.spec.ts`

**Interfaces:**
- Produces package-count-driven desktop scroll height while retaining the existing carousel input methods.

- [ ] Write failing assertions for `1 of 11`, keyboard/control wrapping, and package-count-driven scroll height.
- [ ] Replace the heading with `Journeys for every kind of traveller.` and update the availability note for brochure-published and quote-only prices.
- [ ] Set desktop scroll height to `540svh` for 11 cards, preserving about `44svh` per transition.
- [ ] Verify mobile and reduced-motion modes remain one-card, readable, and non-pinned.
- [ ] Run targeted carousel and E2E tests and commit `fix: scale package carousel for expanded catalogue`.

### Task 6: Regression, review, and rollout

**Files:**
- Modify tests only if a real regression is first reproduced by a failing test.

**Interfaces:**
- Validates the complete frontend, enquiry mapping, and production deployment.

- [ ] Run `npm test`, `npm run build:vercel`, and `npm run build:sites`.
- [ ] Run `npm run test:e2e` across all configured browser projects.
- [ ] Verify the six brochure-backed detail sheets against their sources and every quote CTA against its package ID.
- [ ] Check 320px, 390px, 768px, 1366px, and 1440px layouts for overflow, table readability, focus order, and modal scrolling.
- [ ] Complete whole-branch code review and resolve all load-bearing findings.
- [ ] Merge/push to `main`, wait for the Vercel production deployment, and run one synthetic package-enquiry smoke test.

