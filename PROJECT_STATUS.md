# Dream Drifters Project Status

Last updated: 28 August 2026

This is the plain-language checkpoint for the Dream Drifters Codex project. Use `design.md` for the canonical design specification and `memory.md` for the complete implementation and decision history.

## Where the project stands

- **Active design direction:** Enhanced B: Editorial Intelligence with cinematic Services, a desktop scroll-linked package depth carousel with a stable opening rest state, and attached ambient video backgrounds.
- **Current workspace branch:** `codex/premium-hero-nav` at local checkpoint `d5f3cc3`, with the cinematic cleanup and Hero/navigation repair present as uncommitted working-tree changes.
- **Deployed production:** https://dreamdrifters.in/ is the public custom-domain address for the validated `main` release; the Vercel alias remains available as a technical fallback.
- **OpenAI Sites preview:** https://dream-drifters-codex-preview.yenkay.chatgpt.site/ remains unchanged.
- **Public repository:** https://github.com/NikilKrish/dream-drifters.
- **Cloud handoff branch:** `origin/codex/visual-system-scrutiny`.
- **Stable cloud handoff tag:** `cloud-handoff-2026-08-23`.
- **Latest committed checkpoint:** `d5f3cc3`; the current cleanup remains local and uncommitted.
- **Deployment state:** this cleanup is implemented and verified locally but has not been committed, pushed or deployed by this task.

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
- Hero now uses an approved Pexels tropical shoreline aerial with native 4K, 1440p, 1080p and portrait-mobile MP4/WebM loops plus matching AVIF/WebP posters. About and all six package still families retain their recorded Pexels provenance and responsive 4K approval. Direction, Services, Assurance and Enquiry remain review-required.

## Verification recorded on 27 August 2026

- Unit/component suite after the Direction repair: **70 passed, 0 failed** across 14 files.
- OpenAI Sites production build: **passed**.
- Vercel production build: **passed again during the GitHub cloud handoff**.
- Required visual-system gate in desktop Chrome: **9 passed**, now also covering Direction geometry and a clean Direction → Services media-control handoff alongside all five required viewports, hero/About geometry, form visibility, type floors, direct anchors, reduced motion, horizontal overflow and serious/critical axe findings.
- The post-Direction seven-project Playwright run completed **91 applicable passes** and **96 intentional project-scoped skips**; two desktop visual harness checks failed from a navigation timeout and a conditional-control lookup. Both assumptions were hardened and the complete desktop visual-system file then passed **9/9**.
- Verification used Node 25.1.0 although the project declares Node 22.x; production should build with Node 22.
- A tracked-file credential scan found no embedded access-token or private-key patterns. Only the intentionally blank `.env.example` is tracked.

## What is not complete

1. Direction, Services, Assurance and Enquiry still need final production media approval or replacement.
2. A real-device and screen-reader launch review remains outstanding.
3. Business approval is still required for package prices, testimonials, claims, contact information and privacy copy.
4. Meta WhatsApp production credentials and the approved message template still require environment verification.
5. The current working-tree cleanup has not been committed, pushed or deployed.
6. Lighthouse launch review remains outstanding.

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
- `LOCAL_SESSION_HANDOFF_2026-08-27.md`: exact uncommitted local source state, approved requirements, implementation map, current verification, evidence and next-session startup procedure.
