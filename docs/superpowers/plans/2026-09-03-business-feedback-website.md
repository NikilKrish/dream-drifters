# Business Feedback Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved public-facing package, brand, and copy changes without altering the enquiry backend.

**Architecture:** Keep brochure price values in the package records as internal provenance, but make the shared presentation helper return the same quote-only label for every package. Reuse the shared `BrandMark` component so navigation and footer receive the stacked wordmark together. Update verified copy only in `src/data/company.ts`.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-business-feedback-website.md`

## Global Constraints

- All eleven public package cards and detail sheets must expose `Request current quote`, never a numeric price or currency amount.
- Package durations and existing quote-action/enquiry-preselection behaviour remain unchanged.
- Preserve existing package `price`, `priceStatus`, and brochure provenance in data; they must not drive public price display.
- The wordmark must use the existing `/brand/dd-mark.png` icon, followed by `Dream` then `Drifters` on the next line.
- Use the two approved copy strings verbatim.
- Do not modify `api/`, `shared/`, `worker/`, Google Apps Script materials, Vercel environment configuration, or enquiry-recipient logic.

---

### Task 1: Make the package catalogue quote-only

**Files:**
- Modify: `src/components/PackagesSection.tsx`, `src/components/PackageSheet.tsx`, `src/components/DepthPackagesSection.tsx`
- Modify: `src/data/content.test.ts`, `src/components/PackageSheet.test.tsx`, `tests/e2e/editorial.spec.ts`
- Modify: `README.md` if it describes numeric package prices

**Interfaces:**
- Consumes: `TravelPackage.price` and `TravelPackage.priceStatus` only as preserved source metadata.
- Produces: `getPackagePriceLabel(item)` always returns `Request current quote`.

- [ ] **Step 1: Write failing public-content assertions**

```ts
expect(packages).toHaveLength(11);
expect(packages.every((item) => getPackagePriceLabel(item) === 'Request current quote')).toBe(true);
```

Add sheet assertions that `US $357`, `$1,513.00`, and `$2,185 PP` are absent while `Request current quote` remains visible.

- [ ] **Step 2: Run the focused tests to confirm RED**

Run: `npm test -- src/data/content.test.ts src/components/PackageSheet.test.tsx`

Expected: failure because Bali, Mexico, and Tanzania still expose their brochure prices.

- [ ] **Step 3: Implement quote-only presentation**

```ts
export function getPackagePriceLabel(_item: TravelPackage): string {
  return 'Request current quote';
}
```

Replace the depth-carousel note with `Availability and final pricing are confirmed before commitment.` In the detail sheet, replace `Current pricing` with `Current quote`; retain the quote label, duration, brochure sections, and quote button.

- [ ] **Step 4: Run focused content, component, and Chrome E2E checks**

Run: `npm test -- src/data/content.test.ts src/components/PackageSheet.test.tsx`

Run: `npx playwright test tests/e2e/editorial.spec.ts --project=desktop --grep "package"`

Expected: all checks pass and no numeric package price is publicly visible.

- [ ] **Step 5: Commit**

```bash
git add src/components/PackagesSection.tsx src/components/PackageSheet.tsx src/components/DepthPackagesSection.tsx src/data/content.test.ts src/components/PackageSheet.test.tsx tests/e2e/editorial.spec.ts README.md
git commit -m "fix: make package catalogue quote-only"
```

### Task 2: Reformat the shared Dream Drifters wordmark

**Files:**
- Modify: `src/components/BrandMark.tsx`, `src/styles.css`, `src/prototype/prototype.css`
- Create: `src/components/BrandMark.test.tsx`

**Interfaces:**
- Consumes: `BrandMark({ light?: boolean })` from navigation and footer.
- Produces: the same component API with separate visible `Dream` and `Drifters` word elements.

- [ ] **Step 1: Write a failing wordmark test**

```tsx
render(<BrandMark light />);
expect(screen.getByText('Dream')).toBeInTheDocument();
expect(screen.getByText('Drifters')).toBeInTheDocument();
expect(screen.getByText('Dream').parentElement).toHaveClass('brand-mark__words');
```

- [ ] **Step 2: Run the test to confirm RED**

Run: `npm test -- src/components/BrandMark.test.tsx`

Expected: failure because the component currently emits one `Dream Drifters` text node.

- [ ] **Step 3: Implement the stacked lock-up without changing the asset**

```tsx
<span className={light ? 'brand-mark__words is-light' : 'brand-mark__words'}>
  <span>Dream</span>
  <span>Drifters</span>
</span>
```

Use CSS so `.brand-mark` remains icon-left and `.brand-mark__words` is a compact vertical flex stack. Preserve light colour treatment, the navigation hit target, and responsive type floor.

- [ ] **Step 4: Run component and shared-brand regressions**

Run: `npm test -- src/components/BrandMark.test.tsx src/components/Navigation.test.tsx src/components/Footer.test.tsx`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/BrandMark.tsx src/styles.css src/prototype/prototype.css src/components/BrandMark.test.tsx
git commit -m "feat: stack Dream Drifters wordmark"
```

### Task 3: Publish the approved business copy

**Files:**
- Modify: `src/data/company.ts`, `src/data/content.test.ts`, `src/components/EditorialSections.test.tsx`

**Interfaces:**
- Consumes: `proofItems` rendered by `EditorialMetrics`.
- Produces: approved verified proof copy without changing labels, capability IDs, or enquiry actions.

- [ ] **Step 1: Write failing exact-copy assertions**

```ts
expect(proofItems.find((item) => item.label === 'Chennai based')?.detail)
  .toBe('A travel team in your city with direct support from first conversation to return.');
expect(proofItems.find((item) => item.label === 'Connected worldwide')?.detail)
  .toBe('Tour packages, Flights, Accommodation, Visas, MICE and Corporate Travel through an International partner network.');
```

- [ ] **Step 2: Run the test to confirm RED**

Run: `npm test -- src/data/content.test.ts src/components/EditorialSections.test.tsx`

Expected: failure because the previous `local` sentence and lower-case services sentence remain.

- [ ] **Step 3: Replace only the two approved details**

```ts
{ label: 'Chennai based', detail: 'A travel team in your city with direct support from first conversation to return.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
{ label: 'Connected worldwide', detail: 'Tour packages, Flights, Accommodation, Visas, MICE and Corporate Travel through an International partner network.', status: 'verified', source: 'Business corrections supplied by Dream Drifters' },
```

- [ ] **Step 4: Run focused tests**

Run: `npm test -- src/data/content.test.ts src/components/EditorialSections.test.tsx`

Expected: pass with exact approved wording.

- [ ] **Step 5: Commit**

```bash
git add src/data/company.ts src/data/content.test.ts src/components/EditorialSections.test.tsx
git commit -m "fix: publish approved business copy"
```

### Task 4: Full regression and visual verification

**Files:**
- Modify only if an existing E2E assertion is stale: `tests/e2e/editorial.spec.ts`, `tests/e2e/site.spec.ts`, `tests/e2e/visual-system.spec.ts`

**Interfaces:**
- Consumes: final quote-only price helper, stacked wordmark, and approved proof copy.
- Produces: evidence that all eleven packages, quote actions, responsive layout, accessibility, and enquiry preselection still work.

- [ ] **Step 1: Adjust only stale assertions**

```ts
await expect(section.getByText('Availability and final pricing are confirmed before commitment.', { exact: true })).toHaveCount(1);
await expect(section.getByText(/\$1,513\.00|\$2,185 PP|US \$357/)).toHaveCount(0);
```

- [ ] **Step 2: Run full verification**

Run: `npm test`

Run: `npm run build:vercel`

Run: `npm run build:sites`

Run: `npm run test:e2e`

Expected: all tests and both builds pass; the E2E suite reports no failures.

- [ ] **Step 3: Commit any necessary test update**

```bash
git add tests/e2e/editorial.spec.ts tests/e2e/site.spec.ts tests/e2e/visual-system.spec.ts
git commit -m "test: cover quote-only package presentation"
```

## Self-review

- Spec coverage: Tasks 1–3 cover every approved public change; Task 4 covers regression. Backend and persistence exclusions are explicit in Global Constraints.
- Placeholder scan: no TBD/TODO or unspecified code/test steps remain.
- Interface consistency: all presentation changes use the existing `TravelPackage`, `BrandMark`, and `proofItems` interfaces.
