# Task 5 report: eleven-card package carousel

## Status

Implemented and verified against base commit `f2be29d17f75d4e6426179a86228c2acbf6206a9`.

Commit message: `fix: scale package carousel for expanded catalogue`

## RED evidence

Command:

```text
npx playwright test tests/e2e/editorial.spec.ts --project=desktop --grep "package carousel restores desktop depth motion"
```

The unchanged implementation failed as expected in two focused runs:

- Copy RED: expected `Journeys for every kind of traveller.` but received `Six journeys. One world in motion.`
- Height RED: expected `5400px` (`540svh` at the 1000px desktop viewport) but received `3200px` (`320svh`).

Both runs exited 1 with one failing test. No production file was changed before these failures were observed.

## Formula implementation

Desktop depth height is derived from the runtime package count:

```text
100svh + max(0, package count - 1) * 44svh
```

For 11 packages this yields `100 + 10 * 44 = 540svh`. The component exposes the result through `--package-depth-height` only while the carousel is in depth mode; desktop CSS consumes that variable. Controlled mobile/tablet and reduced-motion modes receive neither the inline depth-height variable nor the depth height rule.

## GREEN evidence

- Primary desktop carousel test: 1 passed.
- Package-focused Chromium run across compact phone, mobile, tablet, desktop, and wide desktop: 9 passed, 16 project-inapplicable tests skipped.
- Complete `tests/e2e/editorial.spec.ts` on desktop Chromium: 11 passed, 1 phone-only test skipped.
- `npx tsc -b`: exit 0.
- `npm test`: 17 test files passed; 125 tests passed.

The focused E2E coverage verifies `1 of 11`, 11 rendered depth cards, exact heading and availability note, `540svh`, previous/next and keyboard endpoint wrapping, touch threshold/wrapping, active-card `aria-current`, itinerary opening, responsive presentation changes, sticky desktop choreography, and reduced-motion non-sticky controlled behavior. Compact phone, mobile, and tablet remained one-card controlled layouts below 2.2 viewport heights; desktop and wide desktop used the count-driven depth layout.

## Changed files

- `src/components/DepthPackagesSection.tsx`
- `src/prototype/prototype.css`
- `tests/e2e/editorial.spec.ts`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/task-5-report.md`

## Risks and follow-up

- The full cross-browser matrix was intentionally deferred to Task 6.
- Non-owned E2E files `tests/e2e/site.spec.ts` and `tests/e2e/visual-system.spec.ts` still contain six-card expectations; they were not edited because Task 5 ownership is limited to the files above and the full matrix is reserved for Task 6.
- Pre-existing untracked `docs/superpowers/` content was left untouched.
