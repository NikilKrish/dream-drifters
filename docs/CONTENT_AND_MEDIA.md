# Content and media guide

## Approved public service names

1. Tour Packages
2. Flights
3. Accommodation
4. Visas
5. Meeting Incentive, Conference Event (MICE)
6. Corporate Travel

Travel Insurance is not a public service. Old `insurance`, `hotels` and `events` enquiry values remain accepted only for compatibility.

## Content verification

Proof, pricing and testimonial records carry a status in the typed data. Components must use the supplied selectors rather than deciding whether a claim is publishable.

- `verified`: approved to display with its source record.
- `draft`: retained for review but not presented as verified.
- `hidden`: not shown publicly.

Never change a status based on assumption. Record who approved the claim, its source and the verification date.

## Video backgrounds

Enhanced B requires three local media families:

- `discovery`: Hero
- `operations`: Services
- `travellers`: Reviews

Each family contains MP4 and WebM files. Hero also has a smaller phone encode; Services and Reviews have mobile-labelled files within their agreed budgets. Chrome receives MP4 first, with WebM as the alternate source.

The complete filename, byte size, source and licensing record is in `public/media/README.md`.

## Playback behavior

- A poster appears first and remains underneath the video.
- Muted autoplay is attempted only after the relevant loading threshold.
- Off-screen lower-page videos pause.
- If autoplay is rejected, the video stays mounted and a **Play video** control appears.
- Reduced motion, Data Saver, slow connection or low memory starts poster-first and paused; the visitor can explicitly request playback.
- A decoding or network error leaves the poster stable.

## Production replacement

The current Coverr clips and stock images are temporary. Before final commercial launch:

1. Obtain approved Dream Drifters photography and video or written usage rights.
2. Keep the same chapter assignments and responsive source structure.
3. Re-encode lightweight MP4 and WebM variants.
4. Update `public/media/README.md` with source, owner, date, file size and approval status.
5. Re-run the full release checklist.
