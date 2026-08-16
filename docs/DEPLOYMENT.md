# Deployment guide

The same visitor experience can be released to Vercel and OpenAI Sites. Each platform has its own server entry point, but both use the same validation and WhatsApp summary rules from `shared/brief.ts`.

## Vercel

### Project settings

- Framework: Vite
- Install command: `npm install` or Vercel default
- Build command: `npm run build:vercel`
- Output folder: `dist`
- Node.js: 22
- Server function: `api/enquiry.ts`

These settings are already recorded in `vercel.json` and `package.json`.

Connect the public GitHub repository to Vercel so every pull request receives a preview and changes to `main` can produce a production release. The preferred project name is `dream-drifters`; if that name is unavailable, use a readable suffix while keeping `dream-drifters` in the domain.

### Environment variables

Set secrets in Vercel Project Settings, never in the repository:

- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`
- `BUSINESS_OWNER_PHONE_NUMBER`
- `META_MESSAGE_TEMPLATE`
- `META_TEMPLATE_LANGUAGE`
- `META_GRAPH_API_VERSION`
- `VITE_WHATSAPP_NUMBER`

The Meta template needs one body text parameter for the structured enquiry summary.

### Safe launch without Meta credentials

Meta credentials are optional for the first release. When they are absent, `POST /api/enquiry` returns `{ "ok": false, "fallback": "whatsapp" }` and the visitor receives the explicit **Continue in WhatsApp** action. No personal information is stored by the application.

## OpenAI Sites

The existing Sites project is linked through `.openai/hosting.json`.

- Build command: `npm run build:sites`
- Server entry: `worker/index.ts`
- Static and server output: generated under `dist/`

The Cloudflare worker mirrors the Vercel endpoint's method enforcement, request limit, validation, bot checks, Meta notification and WhatsApp fallback behavior.

## Release checklist

1. Run `npm test`.
2. Run `npm run build:vercel`.
3. Run `npm run build:sites` separately; both builds use `dist`, so do not run them at the same time.
4. Run `npm run test:e2e` across the configured phone, tablet and desktop browsers.
5. Confirm Hero, Services and Reviews each show video or a working manual play control.
6. Confirm the six packages, itineraries and enquiry handoffs work with keyboard, touch and mouse.
7. Submit one valid enquiry and verify either Meta success or the explicit WhatsApp fallback.
8. Confirm no price, testimonial or unsupported claim is accidentally published.
9. Check the final root address and `/api/enquiry` from the production domain.

## Rollback

Use the hosting platform's previous successful deployment. Do not delete source history or rewrite `main`. Record the rollback reason and deployment address in `memory.md`.
