# Tasks 1–2 Implementation Report

## Summary

Implemented the combined brochure-backed package model and catalogue data unit. The catalogue now contains exactly eleven unique packages in the approved order, updates the existing Bali record, exposes only the three brochure-verified prices, records brochure provenance, represents the USA fixed-departure schedule, and formats all new package IDs with human-readable enquiry names.

All six supplied brochure images were inspected visually at original resolution. No media or UI files were changed, and no Google Sheets or Apps Script behavior or schema was changed.

## Exact files changed

- `src/types.ts`
- `src/data/packages.ts`
- `src/data/packages.test.ts`
- `src/data/content.test.ts`
- `shared/brief.ts`
- `shared/brief.test.ts`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/task-1-2-report.md`

The pre-existing untracked `docs/superpowers/` plan directory was read and preserved without modification.

## RED checkpoints

### Task 1 RED

Command:

```text
npm test -- src/data/packages.test.ts src/data/content.test.ts --pool=threads
```

Result: exit 1. Two test files failed; 3 tests failed and 4 passed. The failures correctly showed that the catalogue still had six rather than eleven IDs, brochure provenance was absent, and the set of brochure-verified prices was empty.

The first run using Vitest's default fork pool emitted the expected package failures but did not terminate. The orphaned test processes were stopped, and the command was rerun with `--pool=threads` to capture a complete deterministic failure result.

### Task 2 RED

Command:

```text
npm test -- src/data/packages.test.ts shared/brief.test.ts --pool=threads
```

Result: exit 1. Two test files failed; 13 tests failed and 6 passed. The failures correctly showed that all five new package records, the Bali brochure update, the USA schedule, detailed commercial values, and the six brochure-package enquiry labels were missing.

## GREEN checkpoints

### Task 1 GREEN

Command:

```text
npm test -- src/data/packages.test.ts src/data/content.test.ts --pool=threads
```

Result: exit 0. Two test files passed; 12 tests passed.

### Task 2 GREEN

Command:

```text
npm test -- src/data/packages.test.ts shared/brief.test.ts --pool=threads
```

Result: exit 0. Two test files passed; 19 tests passed.

## Additional tests and verification

- Baseline before edits: `npm test` — exit 0; 16 files and 103 tests passed.
- TypeScript: `npx tsc -b --pretty false` — exit 0.
- Broader package/enquiry/backend regression set: `npm test -- src/data/packages.test.ts src/data/content.test.ts shared/brief.test.ts shared/enquiryPersistence.test.ts src/lib/enquiry-flow.test.ts src/components/EnquirySection.test.tsx api/enquiry.test.ts worker/index.test.ts --pool=threads` — exit 0; 8 files and 75 tests passed.
- Production build: `npm run build:vercel` — exit 0; 4,590 modules transformed and the Vercel bundle built successfully.
- Full unit suite: `npm test -- --pool=threads` — exit 1; 15 files passed, 1 file failed, with 115 tests passed and 1 failed. The sole failure is the expected Task 3 boundary in `src/data/media.test.ts`: the five new package IDs do not yet have `PackageMediaAsset` registrations. Media work is explicitly deferred and was outside this unit's ownership.
- Whitespace check: `git diff --check` — exit 0.

## Decisions

- Used one cohesive commit because Task 1's eleven-package, price, and provenance tests cannot become green independently of Task 2's brochure data.
- Added `PackageDepartureSchedule` as an accessible-table-ready structure with a caption, ordered month headers, programme rows, durations, and nullable departure cells.
- Added optional brochure sections for source filename, highlights, accommodation, exclusions, commercial notes, minimum travellers, departure schedule, and incomplete-content notice.
- Made `TravelPackage.durationDays` optional so Machu Picchu and USA 2026 do not receive invented numeric durations.
- Cleared raw price strings for every hidden/quote-only package. Only Bali `US $357`, Mexico `$1,513.00`, and Tanzania `$2,185 PP` remain in publishable data.
- Preserved the USA schedule's printed day values and represented brochure dashes as `null` rather than inventing departures.
- Preserved Mexico's printed `Aug 25` without adding a year.
- Preserved Tanzania's ambiguous printed tipping wording as two source lines, `Tipping norms = USD 15\n25 per guide per day`, and added a commercial warning requiring confirmation before use rather than inferring a range or currency conversion.
- Normalized the visually obvious Machu Picchu service-label misspelling to `Sightseeing`; no destination facts were added.
- Used the exact required incomplete-itinerary notice for Bali, Mexico, Tanzania, USA 2026, and Machu Picchu. Ramakkalmedu uses its visually verified three-day itinerary.
- Added future-compatible `/media/<package-id>.webp` and `.avif` references only; no media was sourced, generated, or registered.

## Commits

- One cohesive commit: `feat: add brochure-backed travel packages`

## Risks and follow-up

- Until Task 3 lands, the five new package cards reference media paths that do not exist yet and the full unit suite intentionally fails the package-media parity assertion.
- Task 4 must render the new optional brochure sections and handle empty itinerary arrays with `contentNotice`.
- The Tanzania tipping wording remains ambiguous in the source artwork; the structured data now explicitly requires confirmation with Dream Drifters before use.
- Brochure commercial values remain subject to the source's own `T&C` and availability language; no conversion or independent commercial validation was performed.

## Independent review correction

### Summary

- Preserved the Tanzania tipping exclusion as the two printed source lines with no inserted separator: `Tipping norms = USD 15\n25 per guide per day`.
- Added the commercial note: `Tipping amount is ambiguous in the source artwork and must be confirmed with Dream Drifters before use.`
- Removed the duplicate minimum-six-travellers commercial note; `minimumTravellers: 6` remains the single source of truth.

### RED

Command:

```text
npm test -- src/data/packages.test.ts --pool=threads
```

Result: exit 1. One test file failed; 3 tests failed and 7 passed. The failures correctly showed that the source line break and ambiguity warning were absent and the minimum-party condition remained duplicated in `commercialNotes`.

### GREEN

Command:

```text
npm test -- src/data/packages.test.ts src/data/content.test.ts --pool=threads
```

Result: exit 0. Two test files passed; 14 tests passed.

### Commit

- `fix: clarify Tanzania brochure conditions`
