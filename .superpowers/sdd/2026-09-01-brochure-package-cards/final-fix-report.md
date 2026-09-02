# Brochure Package Cards Final Fix Report

## Scope

Resolved the final review's Important focus-management finding and Minor documentation finding without changing catalogue data, brochure content, media choices, pricing, persistence schemas, Google Sheets, Apps Script, or package order/count. The optional resource-budget recommendation was intentionally left out of scope.

## Implementation

- Package-sheet dismissal through Escape, the close button, or the backdrop continues to restore focus to the itinerary opener.
- The package-sheet quote action marks the exit as a forward navigation, suppressing opener restoration during focus-trap cleanup.
- After the sheet is removed and `main.inert` is cleared, the quote handoff waits for the selected package control to be mounted and focuses that control with `preventScroll`. The wait is bounded to four animation frames to cover Chromium's later React effect/render timing while remaining deterministic in Firefox and WebKit.
- The enquiry keeps the selected package ID and human-readable package name; the regression test uses Maldives (`maldives` / `Maldives Paradise`) as the observable contract.
- The root README now records eleven packages and the three brochure-verified published prices (Bali, Mexico, and Tanzania).
- The media manifest now distinguishes controlled phone/tablet/reduced-motion mounting (active image only) from desktop depth mounting (all eleven cards, first image eager and the remainder native-lazy).

## TDD Evidence

The existing uncommitted `tests/e2e/site.spec.ts` change was preserved and run before production edits.

### Initial RED

Command:

```text
npx playwright test tests/e2e/site.spec.ts --grep "itinerary scene restores dismissal focus and sends quote focus to the selected enquiry" --project=desktop --project=firefox-desktop --project=webkit-mobile
```

Result: 3 failed. Chromium desktop, Firefox desktop, and WebKit mobile all reached the final assertion with correct dismissal behavior and correct Maldives preselection, then timed out because `document.activeElement` was outside `#contact`.

The final-focus assertion was then tightened to require the package selector itself. With an interim heading target, Chromium produced the expected RED result: the selected `<select>` resolved correctly but remained inactive. This exposed the browser-specific mount timing that the bounded handoff now handles.

### Final GREEN

The same focused command passed 3/3 in 25.0 seconds:

- Chromium desktop: passed.
- Firefox desktop: passed.
- WebKit mobile: passed.

The test verifies Escape, close-button, and backdrop restoration; package ID/name preselection; selection-banner visibility; and final focus on the package selector.

## Full Verification

- `npm test`: passed — 17 test files, 125 tests, 0 failures (18.94 seconds).
- `npm run build:vercel`: passed — TypeScript and Vite production build exited 0.
- `npm run build:sites`: passed — TypeScript, Sites server build, and client build exited 0.
- `npm run test:e2e`: passed — 93 passed, 96 project-specific skips, 0 failures across all seven configured projects (6.8 minutes).
- `git diff --check`: passed before report creation; repeated at the commit gate.

## Changed Files

- `src/App.tsx`
- `src/components/PackageSheet.tsx`
- `src/hooks/useFocusTrap.ts`
- `tests/e2e/site.spec.ts`
- `README.md`
- `public/media/README.md`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/final-fix-report.md`

## Concerns

No unresolved functional concern was found. Playwright reports the suite's expected project-specific skips and a benign `NO_COLOR`/`FORCE_COLOR` warning. Production rollout remains controller-owned and was not performed in this fix.

## Regression Stabilization

A fresh controller full-suite run supplied RED evidence for the integrated visual-system gate at 1424×696: `sectionTop` was `-15.6875` while `navBottom` was `80`. The former poll only required `sectionTop < viewport.height`, so it could finish during a negative native-hash/GSAP transition. The test now polls the final geometry condition directly, re-reading the current navigation boundary until `sectionTop >= navBottom` and `sectionTop < viewport.height`; no production code or arbitrary delay was added.

Verification after the test-only change:

- Exact integrated test, desktop with `--repeat-each=3`: 3 passed (1.6 minutes).
- Full `npm run test:e2e`: 93 passed, 96 project-specific skips, 0 failures (7.3 minutes).
