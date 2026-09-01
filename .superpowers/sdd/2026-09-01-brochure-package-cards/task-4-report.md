# Task 4 report: structured brochure package details

## Status

Implemented structured brochure details in the existing package sheet on branch `codex/brochure-package-cards`, based on commit `99ccb402e4ccf684f9e8c8614288ba4ec4498b43`.

Commit: `feat: render brochure package details`

## Changed files

- `src/components/PackageSheet.tsx`
- `src/components/PackageSheet.test.tsx`
- `src/prototype/prototype.css`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/task-4-report.md`

No catalogue, media, carousel, backend, or other unrelated files were edited. The pre-existing untracked `docs/superpowers/` directory was left untouched and excluded from the commit.

## RED → GREEN evidence

### RED

Command:

```text
npm test -- src/components/PackageSheet.test.tsx
```

Result: exit 1; 5 tests ran, 4 failed and 1 passed. The failures were the intended missing production behavior:

- Tanzania lacked minimum-traveller and commercial-note output and the structured headings/lists.
- USA lacked the captioned departure table and null-cell markers.
- Ramakkalmedu lacked structured highlight/itinerary sections.
- Empty inclusions and itinerary still produced empty headings/lists.

The preservation test for focus trapping, Escape, both close controls, and the quote callback passed before production changes.

### GREEN

Command:

```text
npm test -- src/components/PackageSheet.test.tsx
```

Result: exit 0; 1 test file passed, 5/5 tests passed.

## Implementation

Sections render in the required order: key facts, departure schedule, highlights, accommodation, inclusions, exclusions, day-by-day itinerary, and content notice. Optional lists, the schedule, itinerary, minimum travellers, commercial notes, and content notice are omitted when absent or empty. `durationDays` is neither derived nor displayed, and `brochure.contentNotice` is rendered verbatim.

The USA schedule maps one cell per supplied month. String dates are rendered verbatim; null or missing month values render a visible em dash with the accessible name `No departure`. The package-level image and responsive `<picture>` behavior are unchanged, including the current Ramakkalmedu proxy alt text.

Responsive CSS is scoped to `.editorial-production`. The panel uses dynamic viewport height and contained vertical overscroll, the body is prevented from forcing horizontal page overflow, and wide schedules scroll within a focusable table region at narrow widths.

## Accessibility decisions

- Each populated detail group is a labelled `<section>` with a semantic heading.
- Key facts use `<dl>`, `<dt>`, and `<dd>` markup.
- Commercial details, highlights, accommodation, inclusions, and exclusions use lists.
- The departure schedule uses a real `<table>` with `<caption>`, column headers, row headers, scoped header cells, and explicit accessible labels for non-departure cells.
- The horizontally scrollable table wrapper is keyboard-focusable and has a visible focus indicator.
- The itinerary remains an ordered list.
- Existing dialog labelling, focus trap, Escape handling, backdrop and close controls, body scroll lock, reduced-motion timing, and quote CTA behavior were preserved.

## Verification

Focused component, focus, and motion regression command:

```text
npm test -- src/components/PackageSheet.test.tsx src/components/Navigation.test.tsx src/components/CinematicVideo.test.tsx src/lib/motion.test.ts
```

Final result: exit 0; 4 test files passed, 24/24 tests passed. An initial combined run exposed a test-only GSAP timing race in the interaction test; retaining the already-accessible quote-button reference removed the race without changing production behavior.

TypeScript command:

```text
npx tsc -b
```

Result: exit 0 with no diagnostics.

Full unit command:

```text
npm test
```

Result: exit 0; 17 test files passed, 125/125 tests passed.

Diff validation:

```text
git diff --check
```

Result: exit 0. Git reported only the repository's LF-to-CRLF working-copy warning.

## Risks

- Wide departure schedules intentionally scroll inside the modal on narrow screens; keyboard users receive a labelled, focus-visible scroll region.
- Schedule rendering follows the supplied month array and does not invent dates. If a future programme has fewer departure entries than months, the unmatched cells are conservatively marked `No departure`.
- Core modal styles remain in the unowned `src/styles.css`; Task 4 adds scoped overrides in the owned prototype stylesheet only.
