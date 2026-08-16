# Enhanced B Routes

The production experience is a Vite, React and TypeScript single page.

| URL | Entry | Purpose |
|---|---|---|
| `/` | `src/main.tsx` → `src/App.tsx` | Canonical Enhanced B experience |
| `/api/enquiry` | Vercel or Cloudflare server handler | Validated enquiry notification with safe WhatsApp fallback |

Navigation anchors are `#about`, `#services`, `#packages`, `#reviews` and `#contact`. The fixed content sequence is Hero, Metrics, About, Vision and Mission, Services, Why Us, Packages, Reviews, Enquiry and Footer.

There is no active variant query parameter, additional public route, booking flow, payment flow, account area or CMS.
