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

## Common questions

### Why do I see a poster instead of moving video?

The website begins with a stable poster. It then tries muted inline playback. Chrome or a device preference may block autoplay; in that case a visible **Play video** control appears. Reduced-motion, Data Saver, slow-network and low-memory settings begin paused but still allow the visitor to request playback.

### Why are prices not displayed?

The stored prices have not been approved for public release. The site deliberately shows “Request current quote” until verification is recorded.

### Why does an enquiry offer WhatsApp instead of sending silently?

If the Meta server credentials are not configured, the protected endpoint returns a safe fallback. The visitor can review the enquiry and choose **Continue in WhatsApp**. The site never opens WhatsApp without an explicit action.

### Which design should I follow?

Follow **Enhanced B** as described in `design.md`. Earlier Explorer and A/B/C prototypes are historical references only.
