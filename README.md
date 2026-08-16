# Dream Drifters cinematic revamp

> **Codex project:** Designed, implemented and verified with OpenAI Codex.

> **Canonical experience:** Enhanced B is the sole production source of truth. It combines Editorial Intelligence, cinematic Services, a depth-of-field package carousel and attached Hero, Services and Reviews video backgrounds.

A Vite, React and TypeScript single-page experience that follows the original trust-first journey:

**Hero → Metrics → About → Vision & Mission → Services → Why Us → Packages → Reviews → Enquiry → Footer**

The interface uses one cinematic ink theme, self-hosted Instrument Serif and Manrope Variable fonts, responsive poster-first media, typed verification gates and breakpoint-specific service storytelling. Unsupported testimonials and pricing never render as verified content. The original A/B/C prototypes and external inspiration studies are historical references rather than active specifications.

The source-of-truth documents are:

- `design.md` for design, interaction, responsive and media behavior.
- `memory.md` for implementation history, deployment state and continuation rules.
- `public/media/README.md` for the attached video/poster inventory, loading policy and licensing status.

## Local development

```bash
npm install
npm run dev
```

The development server binds to `0.0.0.0`, so the same script works in Replit and can be opened from another device on the same network using the computer's LAN address and displayed port.

Copy `.env.example` to `.env.local` before testing the live WhatsApp integration. Submission always ends with an explicit WhatsApp continuation action and never redirects automatically.

## Verification

```bash
npm run build
npm test
npm run test:e2e
```

Playwright runs at 390px, 768px and 1440px. Coverage includes the exact restored section order, page-height and overflow budgets, anchor landing, mobile-menu focus containment, axe serious/critical findings, responsive poster selection, reduced motion, itinerary and privacy dialogs, package and service prefilling, conditional validation and API-failure WhatsApp handoff.

## Vercel and Meta configuration

Set these environment variables:

- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`
- `BUSINESS_OWNER_PHONE_NUMBER`
- `META_MESSAGE_TEMPLATE`
- `META_TEMPLATE_LANGUAGE`
- `META_GRAPH_API_VERSION`
- `VITE_WHATSAPP_NUMBER`

The approved Meta template must contain one body text parameter for the structured enquiry summary. The endpoint normalizes and conditionally validates submissions, rejects oversized requests, quietly absorbs likely bots, and never persists or logs personal information.

## Production checklist

- Replace the temporary local Coverr footage and all static stock imagery with licensed Dream Drifters media.
- Record a source and usage right for every production media asset.
- Verify package prices and testimonial drafts before changing their typed status to `verified`.
- Confirm the WhatsApp template and owner number in a Vercel preview.
- Approve the privacy notice, canonical domain and structured business data.
- Complete the physical-device mobile review and manual screen-reader pass.
