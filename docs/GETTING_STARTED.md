# Getting started

This guide is for anyone who needs to open, review or make a small change to the Dream Drifters website.

## What you need

- Node.js 22
- npm, which is included with Node.js
- A current web browser

## Start the website on your computer

1. Download or clone this repository.
2. Open a terminal inside the project folder.
3. Install the project once:

   ```bash
   npm install
   ```

4. Start the local website:

   ```bash
   npm run dev
   ```

5. Open the local address printed in the terminal, normally `http://localhost:4173`.

The local address is only for development. Use a deployed Vercel or Sites address when sharing the website with someone outside your network.

## Make a safe content change

- Packages and itineraries are in `src/data/packages.ts`.
- Services and trust content are in `src/data/company.ts`.
- Testimonials are in `src/data/testimonials.ts`.
- Contact and interface content are in the React components under `src/components/`.

Do not mark a price, metric or testimonial as verified without written business approval and a recorded source.

## Check your change

Run these before asking for review:

```bash
npm test
npm run build:vercel
npm run build:sites
```

For a full visual and interaction check:

```bash
npx playwright install chrome firefox webkit
npm run test:e2e
```

## If you need the enquiry backend to work in a deployment

The enquiry form now succeeds only after the backend stores the normalized brief in the owner-controlled Google Sheet.

Set these server-only variables in Vercel and OpenAI Sites:

```text
GOOGLE_APPS_SCRIPT_URL=
GOOGLE_APPS_SCRIPT_SECRET=
```

Keep `VITE_WHATSAPP_NUMBER` as the only client-side enquiry variable. Never put the Apps Script URL or secret in any `VITE_` variable.

Use the [Deployment guide](DEPLOYMENT.md) for the full owner setup, Sheet protection, Apps Script deployment, retry trigger, backup/export, recovery and release verification steps.

## Common questions

### Why do I see a poster instead of moving video?

The website begins with a stable poster. It then tries muted inline playback. Chrome or a device preference may block autoplay; in that case a visible **Play video** control appears. Reduced-motion, Data Saver, slow-network and low-memory settings begin paused but still allow the visitor to request playback.

### Why are prices not displayed?

The stored prices have not been approved for public release. The site deliberately shows “Request current quote” until verification is recorded.

### Why does an enquiry still offer WhatsApp?

WhatsApp is now an explicit visitor-controlled continuation, not the owner notification channel. If the enquiry is stored successfully, the visitor may still choose **Continue in WhatsApp**. If storage fails, the form stays retryable and the visitor can choose WhatsApp explicitly instead of losing their message.

### Which design should I follow?

Follow **Enhanced B** as described in `design.md`. Earlier Explorer and A/B/C prototypes are historical references only.
