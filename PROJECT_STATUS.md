# Dream Drifters Project Status

Last updated: 23 August 2026

This is the plain-language checkpoint for the Dream Drifters Codex project. Use `design.md` for the canonical design specification and `memory.md` for the complete implementation and decision history.

## Where the project stands

- **Active design direction:** Enhanced B: Editorial Intelligence with cinematic Services, the depth package carousel and attached Hero, Services and Assurance video backgrounds.
- **Current implementation branch:** `codex/visual-system-scrutiny`.
- **Deployed production:** https://dream-drifters.vercel.app/ remains on the earlier validated `main` release.
- **OpenAI Sites preview:** https://dream-drifters-codex-preview.yenkay.chatgpt.site/ remains unchanged.
- **Public repository:** https://github.com/NikilKrish/dream-drifters.
- **Cloud handoff branch:** `origin/codex/visual-system-scrutiny`.
- **Stable cloud handoff tag:** `cloud-handoff-2026-08-23`.
- **Latest implementation checkpoint:** `b91bd38` (`feat: complete visual scrutiny rebaseline`); later commits only synchronize this documentation.
- **Deployment state:** the complete visual-scrutiny source and context are published to the feature branch for cloud continuation. They have not been merged into `main` or deployed.

## Completed on the visual-scrutiny branch

### Typography and viewport correction

- Rebalanced the Hero to a 96–144px desktop range with a 136px short-desktop cap, safer Instrument Serif line-height and explicit clearance above the lead copy.
- Raised functional text to at least 14px and body/input text to at least 16px.
- Made Hero a true one-scene `100svh` composition.
- Made About fit the tested 1424×696, 1366×768 and 1440×900 desktop viewports.
- Delayed the About split until 1000px so the 768px version remains a deliberate stacked layout.
- Made direct anchor destinations visible before animation enhancement and added stable deep-link correction around pinned scenes.

### Enquiry flow

- Preserved `EnquiryBrief`, `POST /api/enquiry`, bot checks, consent, privacy handling, analytics privacy and the explicit WhatsApp continuation.
- Added internal `interest` and `contact` presentation stages.
- Package enquiries are always staged.
- Custom and service enquiries remain compact only at 861px or wider and 820px or taller; short desktop, tablet and mobile use the staged flow.
- Back navigation preserves entered values; progress, focus and live announcements remain correct when the viewport changes.

### Assurance and media governance

- Replaced the misleading visible Reviews label with Assurance while preserving the compatible `#reviews` anchor.
- The chapter now uses `Support you can see.` and three operating commitments without exposing internal testimonial-verification language.
- Added typed media records for Hero, About, Direction, Services, Assurance and Enquiry.
- Removed package-image reuse from active non-package chapters and preserved the three ambient video families with their poster and mobile fallbacks.
- Current assets are explicitly preview-only. No asset passes the production approval gate because licensing, consent and/or replacement approval remains unresolved.

## Verification recorded on 23 August 2026

- Unit/component suite: **39 passed, 0 failed**.
- OpenAI Sites production build: **passed**.
- Vercel production build: **passed again during the GitHub cloud handoff**.
- Required visual-system gate in desktop Chrome: **8 passed**, covering all five required viewports, hero/About geometry, form visibility, type floors, direct anchors, reduced motion, horizontal overflow and serious/critical axe findings.
- Full seven-project Playwright run: **72 passed, 60 intentionally skipped, 1 Firefox timing failure**.
- The failed Firefox itinerary test passed immediately when rerun alone in **4.6 seconds**. A completely clean full-matrix rerun is still required before release.
- Verification used Node 25.1.0 although the project declares Node 22.x; production should build with Node 22.
- A tracked-file credential scan found no embedded access-token or private-key patterns. Only the intentionally blank `.env.example` is tracked.

## What is not complete

1. The full Playwright matrix needs one clean rerun before release because the long run recorded one transient Firefox timing failure.
2. Final business-original or fully licensed media has not been supplied.
3. Business approval is still required for package prices, testimonials, claims, contact information and privacy copy.
4. Meta WhatsApp production credentials and the approved message template still require environment verification.
5. The visual-scrutiny branch has not been merged into `main` or deployed.
6. Final real-device, screen-reader and Lighthouse launch review remains outstanding.

## Safe next sequence

1. Run the complete unit, Sites/Vercel build and seven-project browser matrix on Node 22.
2. Conduct the responsive visual review on phone, tablet, short laptop and wide desktop.
3. Obtain and approve the replacement media library and update its typed approval states.
4. Merge and push only after approval, then create a preview deployment before updating production.

## Canonical records

- `design.md`: current design and interaction specification.
- `memory.md`: implementation history, decisions, deployments and unresolved risks.
- `public/media/README.md`: active media assignments, file budgets, provenance and replacement briefs.
- `docs/CONTENT_AND_MEDIA.md`: business content and media editing rules.
- `docs/DEPLOYMENT.md`: Vercel and OpenAI Sites release procedure.
- `CLOUD_HANDOFF.md`: exact Git source and clean-cloud startup procedure.
