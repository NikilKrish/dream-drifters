# Dream Drifters Cloud Handoff

Last updated: 23 August 2026

This document is the starting point for a new Codex cloud conversation. It identifies the complete Git source, the authoritative project records and the safe route to a new deployment.

## Source to use

- Repository: https://github.com/NikilKrish/dream-drifters
- Branch: `codex/visual-system-scrutiny`
- Stable handoff tag: `cloud-handoff-2026-08-23`
- Latest implementation checkpoint inside that history: `b91bd38`
- Production branch: `main`, which remains on the earlier public release and must not be treated as the latest visual-scrutiny implementation.

Clone the repository and check out the handoff tag for an exact snapshot, or use the named branch if continuing the work:

```bash
git clone https://github.com/NikilKrish/dream-drifters.git
cd dream-drifters
git checkout cloud-handoff-2026-08-23
npm ci
```

Use Node 22.x. The project declares that version in `package.json`.

## Read these records first

1. `PROJECT_STATUS.md` for the current plain-language checkpoint, verification results and unresolved launch gates.
2. `design.md` for the canonical Enhanced B design and interaction specification.
3. `memory.md` for the complete project history, decisions, previous deployments and continuation rules.
4. `public/media/README.md` for every active image and video assignment, file budget, provenance and replacement requirement.
5. `docs/CONTENT_AND_MEDIA.md` before changing business copy, prices, testimonials or media.
6. `docs/DEPLOYMENT.md` before creating a Vercel or OpenAI Sites deployment.

Historical concepts under `reference/` and `.superdesign/website/` are provenance only. They are not current requirements.

## Current product state

The sole active direction is **Enhanced B**:

**Hero → Metrics → About → Vision and Mission → Services → Why Us → Packages → Assurance → Enquiry → Footer**

The handoff includes:

- responsive Hero and editorial typography corrections;
- height-aware desktop and tablet compositions;
- cinematic Services progression and mobile accordion;
- restored desktop package depth progression with a complete opening rest state, plus controlled tablet/mobile and reduced-motion fallbacks with wraparound, keyboard and swipe input;
- adaptive inline enquiry stages with the existing secure API and explicit WhatsApp continuation;
- Assurance commitments in place of unverified public review language;
- typed media governance and unique chapter assignments;
- Hero, Services and Assurance video families with MP4, WebM, AVIF and WebP fallbacks;
- unit, component, accessibility and responsive Playwright coverage.

## Verification commands

```bash
npm test
npm run build:vercel
npm run build:sites
npm run test:e2e
```

The latest local checkpoint recorded 46 passing unit/component tests, both production builds passing, and a clean seven-project browser run with 83 applicable passes and 78 intentional skips.

## Environment configuration

Copy `.env.example` into the cloud deployment environment. Never commit the actual values.

Required Vercel settings are documented in `docs/DEPLOYMENT.md` and include:

- `VITE_WHATSAPP_NUMBER`
- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`
- `BUSINESS_OWNER_PHONE_NUMBER`
- `META_MESSAGE_TEMPLATE`
- `META_TEMPLATE_LANGUAGE`
- `META_GRAPH_API_VERSION`

The website still offers an explicit WhatsApp fallback when Meta notification is unavailable. Confirm the approved Meta template in a preview environment before production.

## Deployment boundary

The branch and tag are a complete cloud handoff, not production approval. Before replacing the live website:

1. Run the full checks on Node 22.
2. Review phone, tablet, short-laptop and wide-desktop layouts.
3. Confirm keyboard, screen-reader and reduced-motion journeys.
4. Replace or formally approve every preview-only media asset and update the typed approval records.
5. Obtain business approval for prices, claims, contact information, privacy wording and testimonials.
6. Verify the Meta environment and `/api/enquiry` fallback.
7. Create a Vercel preview from this branch before merging to `main`.

The existing Vercel and OpenAI Sites addresses remain earlier releases until a new deployment is explicitly approved.

