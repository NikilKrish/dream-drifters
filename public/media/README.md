# Enhanced B media manifest

This manifest is the operational companion to the typed registry in `src/data/media.ts`. The current files keep previews and tests complete, but **no current media asset is approved for production**.

## Approval gate

An asset may be approved only when all three registry conditions are true:

1. `licenceStatus` is `approved`.
2. `consentStatus` is `confirmed` or `not-applicable`.
3. `replacementState` is `approved`.

Every current record is `review-required` and `replace-before-production`. About and Assurance also remain `consentStatus: required` because recognisable people appear and no release record is present. `isMediaAssetApproved` therefore returns false for every current asset; the branch is not production-media ready.

## Active chapter assignments

Each active non-package chapter has one unique registry asset. Package destination files are reserved for Packages and are not reused by About, Services, Assurance or Enquiry.

| Chapter | Registry asset | Active files | Focal point | Semantic purpose | Status |
|---|---|---|---|---|---|
| Hero | `hero-discovery` | `discovery.mp4` / `.webm`; `hero.avif` / `.webp`; responsive mobile sources and posters | 50% 50% | Open-ended discovery and the start of a journey | Replace or establish complete provenance |
| About | `about-people` | `about-people.avif` (16,848 B), `.webp` (39,972 B) | 62% 48% | People moving through a managed travel moment | Replace with business-original team/client-consultation image; licence and consent unresolved |
| Direction | `direction-horizon` | `direction-horizon.avif` (22,292 B), `.webp` (52,900 B) | 63% 45% | Broad horizon for vision and mission | Replace or establish inherited source licence |
| Services | `services-operations` | `operations.mp4` / `.webm`; `operations-poster.avif` (17,006 B), `.webp` (41,690 B); mobile video sources | 56% 45% | Aviation operations and coordination | Replace with approved operational footage |
| Assurance | `assurance-travellers` | `travellers.mp4` / `.webm`; `travellers-poster.avif` (16,329 B), `.webp` (37,982 B); mobile video sources | 52% 50% | Travellers supported through an active journey | Replace with released support footage; licence and consent unresolved |
| Enquiry | `enquiry-airport` | `enquiry-airport.avif` (16,159 B), `.webp` (41,146 B) | 60% 42% | Operational readiness behind a request | Replace with business-original Chennai service image |

The About, Direction, Services-poster, Assurance-poster and Enquiry files are local frame derivatives from the existing video families. They do not create new licence rights; they inherit the unresolved approval status of their sources.

## Required ambient video families

| Chapter | Family and source record | Desktop video | Mobile video | Poster policy | Loading policy |
|---|---|---|---|---|---|
| Hero | `discovery` — [A tropical landscape](https://coverr.co/videos/a-tropical-landscape-0lb0joigvv) | `discovery.mp4` (1,809,240 B), `discovery.webm` (1,844,837 B) | `discovery-mobile.mp4` (602,909 B), `discovery-mobile.webm` (648,318 B) | Eager responsive `hero` poster remains until `canplay` | Delayed until after first paint |
| Services | `operations` — [Planes heading to the runway](https://coverr.co/videos/planes-heading-to-the-runway-s88pegx0yt) | `operations.mp4` (451,186 B), `operations.webm` (234,403 B) | `operations-mobile.mp4` (404,672 B), `operations-mobile.webm` (234,403 B) | Lazy frame-derived `operations-poster` remains through failure | Mounted near Services |
| Assurance | `travellers` — [Boarding a plane](https://coverr.co/videos/boarding-a-plane-5jd0b6okwj) | `travellers.mp4` (510,885 B), `travellers.webm` (377,979 B) | `travellers-mobile.mp4` (426,186 B), `travellers-mobile.webm` (377,979 B) | Lazy frame-derived `travellers-poster` remains through failure | Mounted near Assurance |

MP4 is offered before WebM for reliable Chrome playback. Videos are muted, looping, inline and audio-free. Off-screen lower-page videos pause automatically.

## Playback and fallback policy

- Capable phones may load mobile video below 700px after the poster is established.
- Reduced motion, Save-Data, 2G/slow-2G and device memory below 4GB start poster-first and paused. Visitors may explicitly request playback with the accessible Play video control.
- A video never replaces its poster until `canplay`; failed playback leaves the poster stable.
- Autoplay rejection retains the mounted video and exposes the same Play video control for a user-initiated retry.
- Hero is the only eager media chapter. Services and Assurance are observed and mounted near their sections.
- Poster-only presentation is an intentional accessibility/performance mode, not an error.

The MP4 files use H.264 Main profile, Level 3.1, 8-bit `yuv420p` and fast-start metadata. Chrome `canplay` verification was recorded on 16 August 2026.

## Production replacement briefs

- **Hero:** one approved establishing journey with calm directional movement, clean two-line-title space on the left and dedicated desktop/mobile crops.
- **About:** a business-original Dream Drifters consultation or team coordination moment in Chennai, 4:3 landscape, with written releases for recognisable people.
- **Direction:** a wide, quiet horizon or onward route with lower-third text contrast and no destination/package specificity.
- **Services:** real or licensed travel operations showing coordination rather than a destination montage; provide MP4, WebM, mobile derivatives and matching AVIF/WebP posters.
- **Assurance:** a credible human support moment with documented model consent; provide the same hybrid video/poster family and preserve foreground reading space.
- **Enquiry:** a business-original response/consultation image tied to the Chennai team, with a wide desktop crop and a portrait-safe focal point.

For every replacement, record the owner/source, licence terms, consent or release reference, capture/download date, focal point, dimensions, file sizes, format variants and approver. Update the registry statuses only after the evidence is stored.

## Package media boundary

`maldives`, `japan`, `switzerland`, `bali`, `paris` and `dubai` AVIF/WebP pairs remain temporary destination images used only by package cards and itinerary sheets in the active interface. Their original source records were not present in the supplied archive. They must be replaced or receive documented licensing provenance before production approval.
