# Dream Drifters website

> A Codex project for Dream Drifters, a Chennai-based travel consultancy serving leisure, business and group travel.

This repository contains the complete public website, its enquiry service, all local images and videos, and the tests used before release. The approved experience is called **Enhanced B**: an editorial travel story with cinematic Services, a depth package carousel and video backgrounds in Hero, Services and Reviews.

The page follows one clear journey:

**Hero → Proof → About → Vision and Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer**

## What visitors can do

- Explore six travel and corporate capabilities.
- Browse six holiday packages on phone, tablet or desktop.
- Open complete itinerary details with a keyboard, mouse or touch.
- Select a package or service and send one inline enquiry.
- Continue in WhatsApp only after pressing an explicit button.
- Choose to play a background video if their browser blocks autoplay or accessibility/data settings start it paused.

There is no payment system, account, booking engine or automatic WhatsApp redirect.

## View and run the project

You need Node.js 22 and npm.

```bash
npm install
npm run dev
```

Open the address shown in the terminal. For a beginner-friendly walkthrough, see [Getting started](docs/GETTING_STARTED.md).

## Quality checks

```bash
npm test
npm run build:vercel
npm run build:sites
npm run test:e2e
```

The browser suite covers Chrome from a 320 px compact phone through tablet, desktop and 1920 px wide desktop, plus Firefox desktop and mobile Safari/WebKit checks.

## Where things live

| Folder or file | Plain-language purpose |
|---|---|
| `src/` | The visible website and interactions |
| `src/data/` | Packages, services, proof and testimonials |
| `public/media/` | Local video, image and poster files |
| `api/enquiry.ts` | The Vercel enquiry endpoint |
| `worker/index.ts` | The matching OpenAI Sites/Cloudflare endpoint |
| `shared/brief.ts` | Shared validation and WhatsApp summary rules |
| `tests/` | Browser checks for the full visitor journey |
| `design.md` | Canonical design and behavior specification |
| `memory.md` | Project history, decisions and release record |

See [Content and media](docs/CONTENT_AND_MEDIA.md) before editing copy, prices, testimonials or footage.

## Deployment

The repository supports two independent release paths:

- **Vercel:** `npm run build:vercel`, with `api/enquiry.ts` as the server function.
- **OpenAI Sites:** `npm run build:sites`, with `worker/index.ts` as the server function.

Full setup, environment variables, fallback behavior and verification steps are in [Deployment guide](docs/DEPLOYMENT.md).

## Important launch notes

- Package prices and supplied testimonials remain hidden until the business owner verifies them.
- Current stock photos and Coverr video loops are temporary. Their source status is documented, but all production media still needs final approval.
- If Meta WhatsApp credentials are absent, the form safely offers the visitor an explicit WhatsApp continuation link.
- Never commit `.env` files, access tokens, phone credentials or generated build folders.

## Canonical records

- [Design specification](design.md)
- [Implementation memory](memory.md)
- [Media manifest](public/media/README.md)

Historical prototypes and research remain in `reference/` and `.superdesign/` for provenance. They are not current implementation instructions.

## Ownership

Copyright © 2026 Dream Drifters. All rights reserved. See [LICENSE.md](LICENSE.md).
