# Enhanced B media manifest

This manifest is the operational companion to the typed registry in `src/data/media.ts`. The Hero aerial, About still and all eleven package destination families are approved for their recorded editorial placements. The remaining ambient chapter media is still preview-only.

## Approval gate

An asset may be approved only when all three registry conditions are true:

1. `licenceStatus` is `approved`.
2. `consentStatus` is `confirmed` or `not-applicable`.
3. `replacementState` is `approved`.

Hero is now `approved` / `not-applicable` / `approved`; About is `approved` / `confirmed` / `approved`. Both pass `isMediaAssetApproved`. Direction, Services, Assurance and Enquiry remain `review-required` and `replace-before-production`; Assurance also remains `consentStatus: required`. Package still approval is recorded separately in `packageMediaAssets`. The branch is not fully production-media ready until the remaining chapter families are cleared.

## Active chapter assignments

Each active non-package chapter has one unique registry asset. Package destination files are reserved for Packages and are not reused by About, Services, Assurance or Enquiry.

| Chapter | Registry asset | Active files | Focal point | Semantic purpose | Status |
|---|---|---|---|---|---|
| Hero | `hero-tropical-aerial` | 3840×2160, 2560×1440, 1920×1080 and 1080×1920 MP4/WebM loops with matched AVIF/WebP posters | 56% 50% | Open-ended discovery and the start of a journey | Approved Pexels source by Adrien JACTA; empty shoreline, illustrative use only |
| About | `about-people` | 4096×3072 AVIF/WebP master plus 1920×1440 and 960×720 variants | 68% 50% | Generic advisor/client consultation | Approved Pexels source by Kindel Media; illustrative use only, with no endorsement or affiliation implied |
| Direction | `direction-train` | `direction-train.mp4` (3,356,270 B), `.webm` (2,311,061 B); desktop and mobile AVIF/WebP posters | 48% 42% | Forward movement seen through a train window | User-supplied generated source; confirm usage rights before production |
| Services | `services-operations` | `operations.mp4` / `.webm`; `operations-poster.avif` (17,006 B), `.webp` (41,690 B); mobile video sources | 56% 45% | Aviation operations and coordination | Replace with approved operational footage |
| Assurance | `assurance-travellers` | `travellers.mp4` / `.webm`; `travellers-poster.avif` (16,329 B), `.webp` (37,982 B); mobile video sources | 52% 50% | Travellers supported through an active journey | Replace with released support footage; licence and consent unresolved |
| Enquiry | `enquiry-airport` | `enquiry-airport.avif` (16,159 B), `.webp` (41,146 B) | 60% 42% | Operational readiness behind a request | Replace with business-original Chennai service image |

The Services-poster, Assurance-poster and Enquiry files are local frame derivatives from the existing video families. The Direction derivatives come from the user-supplied train-window source. Derivatives do not create new licence rights; each inherits the unresolved approval status of its source. About is a separately licensed Pexels still.

## Required ambient video families

| Chapter | Family and source record | Desktop video | Mobile video | Poster policy | Loading policy |
|---|---|---|---|---|---|
| Hero | `pexels-video-14920039` — Adrien JACTA, [empty tropical beach aerial](https://www.pexels.com/video/drone-footage-of-an-empty-tropical-beach-14920039/) | Adaptive 3840×2160, 2560×1440 or 1920×1080 MP4-first pairs | Dedicated 1080×1920 MP4/WebM crop | Eager responsive first-frame poster remains until `loadeddata` | Delayed until after first paint; Save-Data, slow links, reduced motion and low-memory devices remain poster-only |
| Direction | `train-window` — user-supplied generated video | `direction-train.mp4` (3,356,270 B), `direction-train.webm` (2,311,061 B) | Poster only: `direction-train-mobile.avif` (9,780 B), `.webp` (29,312 B) | Lazy desktop and portrait mobile posters | Mounted near Direction; no mobile loop |
| Services | `operations` — [Planes heading to the runway](https://coverr.co/videos/planes-heading-to-the-runway-s88pegx0yt) | `operations.mp4` (451,186 B), `operations.webm` (234,403 B) | `operations-mobile.mp4` (404,672 B), `operations-mobile.webm` (234,403 B) | Lazy frame-derived `operations-poster` remains through failure | Mounted near Services |
| Assurance | `travellers` — [Boarding a plane](https://coverr.co/videos/boarding-a-plane-5jd0b6okwj) | `travellers.mp4` (510,885 B), `travellers.webm` (377,979 B) | `travellers-mobile.mp4` (426,186 B), `travellers-mobile.webm` (377,979 B) | Lazy frame-derived `travellers-poster` remains through failure | Mounted near Assurance |

MP4 is offered before WebM for reliable Chrome playback. Videos are muted, looping, inline and audio-free. Off-screen lower-page videos pause automatically.

## Playback and fallback policy

- Capable phones may load the dedicated portrait video below 700px after the poster is established.
- Hero remains poster-only for reduced motion, Save-Data, 2G/slow-2G and device memory below 4GB. Later chapter videos retain their accessible manual playback recovery.
- A video never replaces its poster until the browser has decoded its first frame (`loadeddata`); failed playback leaves the poster stable.
- Autoplay rejection retains the mounted video and exposes the same Play video control for a user-initiated retry.
- Hero is the only eager media chapter. Services and Assurance are observed and mounted near their sections.
- Poster-only presentation is an intentional accessibility/performance mode, not an error.

The Hero MP4 files use H.264 `yuv420p` with fast-start metadata; WebM fallbacks use VP9. All Hero outputs are 12 seconds at 25fps and loop through a matched forward/reverse edit. The remaining legacy chapter encodes retain their existing profiles.

## Production replacement briefs

- **Hero:** approved tropical shoreline aerial is in place. Future replacements must retain calm directional movement, clean two-line-title contrast and dedicated desktop/mobile crops.
- **About:** approved Pexels consultation still is in place as an illustrative, non-endorsement image. A business-original Dream Drifters consultation remains an optional future authenticity upgrade.
- **Direction:** a wide, quiet horizon or onward route with lower-third text contrast and no destination/package specificity.
- **Services:** real or licensed travel operations showing coordination rather than a destination montage; provide MP4, WebM, mobile derivatives and matching AVIF/WebP posters.
- **Assurance:** a credible human support moment with documented model consent; provide the same hybrid video/poster family and preserve foreground reading space.
- **Enquiry:** a business-original response/consultation image tied to the Chennai team, with a wide desktop crop and a portrait-safe focal point.

For every replacement, record the owner/source, licence terms, consent or release reference, capture/download date, focal point, dimensions, file sizes, format variants and approver. Update the registry statuses only after the evidence is stored.

## Approved responsive stills

The About still and eleven package families are registered with source page, photographer, Pexels licence and terms links, download date, original dimensions, source crop, focal point, output dimensions, production approval and consent/release rationale. The About and original six package families were downloaded on 25 August 2026; the five brochure-backed additions were downloaded on 1 September 2026. Package masters use AVIF and WebP with `-1920` and `-960` variants. The [Pexels licence](https://www.pexels.com/license/) permits website and commercial use and modification, subject to its restrictions; the [terms](https://www.pexels.com/terms-of-service/) remain the controlling record. Depicted people must never be presented as endorsing or being affiliated with Dream Drifters.

| Family | Photographer / source | Original | Source crop | Outputs |
|---|---|---:|---:|---|
| `about-people` | Kindel Media, [Pexels 7979588](https://www.pexels.com/photo/man-couple-love-people-7979588/) | 5196×3464 | 4616×3462 at 290,1 (4:3 centred) | 4096×3072, 1920×1440, 960×720 |
| `maldives` | Ken Cheung, [Pexels 32807065](https://www.pexels.com/photo/aerial-view-of-pristine-maldives-beach-at-daytime-32807065/) | 4770×2680 | 4752×2673 at 9,3 | 3840×2160, 1920×1080, 960×540 |
| `japan` | Brellbell PJ, [Pexels 918275](https://www.pexels.com/photo/mount-fuji-918275/) | 4896×3264 | 4896×2754 at 0,180 | 3840×2160, 1920×1080, 960×540 |
| `switzerland` | Ákos Szűcs, [Pexels 36614033](https://www.pexels.com/photo/stunning-alpine-lake-scenery-in-swiss-alps-36614033/) | 4775×2985 | 4768×2682 at 3,150 | 3840×2160, 1920×1080, 960×540 |
| `bali` | Tom Fisk, [Pexels 36699649](https://www.pexels.com/photo/lush-green-rice-fields-in-bali-s-tropical-paradise-36699649/) | 8640×5760 | 8640×4860 at 0,450 | 3840×2160, 1920×1080, 960×540 |
| `paris` | Denitsa Kireva, [Pexels 15576446](https://www.pexels.com/photo/the-eiffel-tower-at-sunset-15576446/) | 6720×4480 | 6720×3780 at 0,0 | 3840×2160, 1920×1080, 960×540 |
| `dubai` | Michael Kabus, [Pexels 5288791](https://www.pexels.com/photo/the-dubai-skyline-during-sunset-5288791/) | 4912×3264 | 4896×2754 at 8,350 | 3840×2160, 1920×1080, 960×540 |
| `mexico` | Cristian Aragón, [Pexels 33126211](https://www.pexels.com/photo/mayan-ruins-of-chichen-itza-under-blue-sky-33126211/) | 5937×3958 | 5600×3150 at 0,404 | 3840×2160, 1920×1080, 960×540 |
| `tanzania` | Prince III, [Pexels 35327180](https://www.pexels.com/photo/african-elephants-in-serengeti-landscape-35327180/) | 4288×2848 | 4288×2412 at 0,218 | 3840×2160, 1920×1080, 960×540 |
| `usa-2026` | Artem Zhukov, [Pexels 18468673](https://www.pexels.com/photo/the-statue-of-liberty-against-the-background-of-the-new-york-city-18468673/) | 6243×4162 | 5120×2880 at 700,500; excludes the left-edge branded ferry | 3840×2160, 1920×1080, 960×540 |
| `machu-picchu` | Paula Nardini, [Pexels 1570610](https://www.pexels.com/photo/machu-picchu-peru-1570610/) | 6000×4000 | 5984×3366 at 8,0 | 3840×2160, 1920×1080, 960×540 |
| `ramakkalmedu` | 幼聪 戴, [Pexels 37161611](https://www.pexels.com/photo/lush-green-hills-with-wind-turbines-under-blue-sky-37161611/) | 8256×5504 | 8256×4644 at 0,430; Japan visual proxy, not Ramakkalmedu | 3840×2160, 1920×1080, 960×540 |

The canonical package family order is `maldives`, `japan`, `switzerland`, `bali`, `paris`, `dubai`, `mexico`, `tanzania`, `usa-2026`, `machu-picchu`, and `ramakkalmedu`. Each family publishes `<id>.avif`, `<id>.webp`, `<id>-1920.avif`, `<id>-1920.webp`, `<id>-960.avif`, and `<id>-960.webp`. Responsive package markup selects the 960, 1920, or 3840-wide variant. Controlled presentations, including phone, tablet and reduced-motion modes, mount only the active package image; desktop depth mode mounts all eleven cards, with the first image eager and the remaining images using native lazy loading.
