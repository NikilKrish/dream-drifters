# Enhanced B cinematic media manifest

This manifest is the operational source of truth for Enhanced B's attached video backgrounds and poster fallbacks. The media families are part of the canonical experience, although the current footage remains temporary launch material.

## Chapter assignments

| Chapter | Family and source | Desktop video | Mobile video | Poster treatment | Loading priority |
|---|---|---|---|---|---|
| Hero | `discovery` — [A tropical landscape](https://coverr.co/videos/a-tropical-landscape-0lb0joigvv) | `discovery.webm` (1,844,837 B), `discovery.mp4` (1,809,240 B) | `discovery-mobile.webm` (648,318 B), `discovery-mobile.mp4` (602,909 B) | `hero.avif` (555,549 B), `hero.webp` (1,420,950 B), `hero-mobile.avif` (155,295 B), `hero-mobile.webp` (275,400 B) | Poster eager; video delayed until after first paint |
| Services | `operations` — [Planes heading to the runway](https://coverr.co/videos/planes-heading-to-the-runway-s88pegx0yt) | `operations.webm` (234,403 B), `operations.mp4` (451,186 B) | `operations-mobile.webm` (234,403 B), `operations-mobile.mp4` (404,672 B) | `dubai.avif` (204,251 B), `dubai.webp` (328,132 B) | Poster lazy; video mounted within 240 px of the chapter |
| Reviews | `travellers` — [Boarding a plane](https://coverr.co/videos/boarding-a-plane-5jd0b6okwj) | `travellers.webm` (377,979 B), `travellers.mp4` (510,885 B) | `travellers-mobile.webm` (377,979 B), `travellers-mobile.mp4` (426,186 B) | `bali.avif` (417,778 B), `bali.webp` (568,518 B) | Poster lazy; video mounted within 240 px of the chapter |

MP4 is offered first for reliable Chrome playback and WebM remains the alternate source. All videos are muted, looping, inline and audio-free. Off-screen lower-page videos pause automatically.

The MP4 files use H.264 Main profile, Level 3.1, 8-bit `yuv420p` and a fast-start metadata layout. This compatibility export was verified through actual `canplay` events in desktop Chrome on 16 August 2026.

## Playback and fallback policy

- Capable phones may load mobile video below 700 px after the poster is established.
- Reduced motion, Save-Data, 2G or slow-2G, and device memory below 4 GB start poster-first and paused. The visitor may explicitly request playback with the accessible Play video control.
- A video never replaces its poster until `canplay`; failed playback leaves the poster stable.
- If Chrome or another browser rejects autoplay, the mounted video is retained and the same Play video control provides a user-initiated retry.
- The Hero is the only eager media chapter. Services and Reviews are observed and mounted near their sections.
- The interface must not imply that a poster-only state is an error; it is an intentional accessibility and performance mode.

## Licensing and replacement status

The Coverr loops were downloaded on 14 August 2026, resized to 720p/24fps and exported locally as MP4 and WebM. Each source page was marked “Free Commercial Rights” when downloaded. Reconfirm the source terms or replace all three families with approved Dream Drifters footage before production launch.

The mobile encodes are locally derived versions of the same temporary clips. The discovery mobile files remain below 700 KB; operations and travellers mobile files remain below 450 KB each.

Static AVIF and WebP destination imagery is also temporary. Original source records were not present in the supplied archive, so every image must be replaced or receive documented licensing provenance before production launch.
