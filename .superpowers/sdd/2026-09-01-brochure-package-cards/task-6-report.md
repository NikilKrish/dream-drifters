# Task 6 report: local regression gate

## Status and scope

The local regression half of Task 6 is complete on `codex/brochure-package-cards`, based on `53ede5da596295f57192c2084ef75b0f2ca3870a`.

Commit message: `test: align expanded package regressions` (the containing commit hash is reported by Git after this report is committed).

This task did not push, deploy, wait for Vercel, or submit a production enquiry. Those whole-branch and production actions remain controller-owned. No brochure facts, media, backend schema, Sheets, or Apps Script were changed.

## Recovered stale-assertion evidence

Task 5's committed report explicitly carried three stale six-card expectations into Task 6. The inherited uncommitted diff independently reconstructs those exact corrections:

- `tests/e2e/site.spec.ts`: package live status `Maldives Paradise, 1 of 6` to `1 of 11`.
- `tests/e2e/visual-system.spec.ts`: package card count `6` to `11`.
- `tests/e2e/visual-system.spec.ts`: package live status `1 of 6` to `1 of 11`.

All three assertions concern package cards or package status. The service-card assertion remains unchanged at six: `.editorial-services__mobile > article` has `toHaveCount(6)` in `tests/e2e/site.spec.ts`.

The prior worker's exact stale-failure console output and pass/fail totals were not preserved in repository artifacts or history, so they cannot be independently reconstructed. What can be reconstructed is the original stale expectation text, its exact locations, and Task 5's written handoff identifying those expectations.

## Additional RED/GREEN evidence

### Package-sheet focus return

Focused RED command after adding the opener-focus assertion and before the production fix:

```text
npx playwright test tests/e2e/site.spec.ts --project=compact-phone --grep "itinerary scene supports Escape and package-to-form prefilling"
```

Result: exit 1; 0 passed, 1 failed. `expect(itineraryButton).toBeFocused()` found focus on `body` after Escape even though the itinerary opener remained connected and visible. The modal's inert-page cleanup occurred after the focus-trap cleanup had captured the wrong prior element.

Minimal production correction: capture the actual itinerary trigger, pass it to `PackageSheet` and `useFocusTrap`, and restore it on the next animation frame after modal/inert cleanup. Direct scope review found no unrelated production behavior in the four-file prop thread.

Focused GREEN command:

```text
npx playwright test tests/e2e/site.spec.ts --project=compact-phone --grep "itinerary scene supports Escape and package-to-form prefilling"
```

Result: exit 0; 1 passed, 0 failed in 6.6s.

### Firefox service-prefill stabilization

The first complete matrix reproduced a separate test timing race in Firefox:

```text
npm run test:e2e
```

Result: exit 1; 92 passed, 96 skipped, 1 failed in 6.2m. The Firefox service-prefill test rapidly advanced the service control while ScrollTrigger could also change the active service, yielding `Events & Incentives` instead of `Corporate Travel`.

Focused reproduction:

```text
npx playwright test tests/e2e/site.spec.ts --project=firefox-desktop --grep "service prefilling and WhatsApp fallback work inline" --repeat-each=5
```

Result: exit 1; 4 passed, 1 failed. The test now requests reduced motion so it tests service-to-enquiry mapping without competing scroll animation. The same focused command with `--repeat-each=10` then exited 0 with 10 passed, 0 failed. No production change was made for this test-only race.

## Brochure sheet and quote boundary audit

All six supplied brochure JPEGs were visually inspected at original resolution from `C:\Users\Nikil Krishnan\Documents\Projects\Harish Athai Biz\brochures`. Existing catalogue unit coverage and a focused browser audit then checked the rendered sheet content:

- Bali: seven days/six nights, US $357, stay/activity/inclusion details, booking/stay notes, and incomplete-itinerary notice.
- Mexico: seven days/six nights, $1,513.00, highlights, Aug 25 fixed departure, occupancy note, and incomplete-itinerary notice.
- Tanzania: six days/five nights, $2,185 PP, minimum six travellers, highlights/accommodation/exclusions, ambiguity warning, and incomplete-itinerary notice.
- USA 2026: guaranteed fixed-departure table with six programmes, four month headers, and seven rendered rows including the header.
- Machu Picchu: duration-to-be-confirmed treatment, supplied inclusions, and incomplete-itinerary notice without an invented itinerary.
- Ramakkalmedu: three brochure itinerary days and no incomplete-content notice.

Focused browser command: `node -` with an inline Playwright audit script (the script body was not persisted as a repository file). Result: exit 0. Advancing through the six brochure-backed sheets via the real package controls and activating each quote CTA produced the exact package-selection boundary:

| Sheet | Selected package ID |
| --- | --- |
| Bali | `bali` |
| Mexico | `mexico` |
| Tanzania | `tanzania` |
| USA 2026 | `usa-2026` |
| Machu Picchu | `machu-picchu` |
| Ramakkalmedu | `ramakkalmedu` |

## Layout, table, focus, and modal audit

The same focused browser audit checked page overflow, modal bounds and scrolling, initial close-button focus, Shift+Tab wrap to the quote CTA, table-region focusability, horizontal table scrolling, vertical modal scrolling, Escape close, and opener-focus restoration.

| Viewport | Page overflow | Panel client/scroll height | Table client/scroll width | Sheet font | X scroll exercised | Y scroll exercised |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 320x700 | 0px | 682 / 2856 | 253 / 720 | 16px | 452px | 2174px |
| 390x844 | 0px | 826 / 2873 | 323 / 720 | 16.062px | 382px | 2047px |
| 768x1024 | 0px | 990 / 992 | 285 / 720 | 16.7424px | 420px | 2px |
| 1366x768 | 0px | 734 / 736 | 592 / 720 | 17.8188px | 113px | 2px |
| 1440x1000 | 0px | 966 / 968 | 626 / 720 | 17.952px | 79px | 2px |

The final complete Playwright matrix also covered responsive overflow/type-floor/axe checks, desktop package-sheet geometry, modal Escape behavior, focus return, and package-to-form prefilling.

## Fresh final commands and results

All commands below ran after the focus fix in the final code state.

```text
npm run build:vercel
```

Exit 0. TypeScript and Vite completed; 4,590 modules transformed and the Vercel client bundle built in 657ms.

```text
npm run build:sites
```

Exit 0. TypeScript, Sites server build (6 modules), and Sites client build (4,590 modules) completed; Vite reported 26ms server and 596ms client build times.

```text
npm run test:e2e
```

Exit 0 in 5.6m: 93 passed, 96 skipped, 0 failed across all 189 configured project/test combinations.

| Project | Passed | Skipped | Failed |
| --- | ---: | ---: | ---: |
| compact-phone | 11 | 16 | 0 |
| mobile | 12 | 15 | 0 |
| tablet | 11 | 16 | 0 |
| desktop | 26 | 1 | 0 |
| wide-desktop | 11 | 16 | 0 |
| firefox-desktop | 11 | 16 | 0 |
| webkit-mobile | 11 | 16 | 0 |
| **Total** | **93** | **96** | **0** |

Skips are intentional project applicability guards in the configured suite, not runtime failures.

```text
npm test
```

Exit 0 in 13.71s: 17 test files passed; 125 tests passed, 0 failed.

## Changed files

- `src/App.tsx`
- `src/components/DepthPackagesSection.tsx`
- `src/components/PackageSheet.tsx`
- `src/hooks/useFocusTrap.ts`
- `tests/e2e/site.spec.ts`
- `tests/e2e/visual-system.spec.ts`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/task-6-report.md`

Pre-existing untracked `docs/superpowers/` content was not inspected as task output, modified, or staged.

## Risks and warnings

- Focus restoration is intentionally deferred by one animation frame so the page's `inert` state is removed before focusing the opener; the focused regression and all seven browser projects pass this behavior.
- Playwright emits a benign warning that `NO_COLOR` is ignored because `FORCE_COLOR` is set.
- Git warns that LF working-copy files may be converted to CRLF when Git next writes them; `git diff --check` reports no whitespace errors.
- Historical stale-failure console output is unavailable, as described above.
- Controller-owned whole-branch review, push to `main`, Vercel deployment wait, and production enquiry smoke test remain outstanding by design.
