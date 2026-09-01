# Task 3 Implementation Report

## Summary

Added one approved media registration for each of the eleven package IDs. Five new official Pexels photographs were downloaded, visually inspected, cropped to safe 16:9 compositions, and encoded as responsive AVIF and WebP files at 3840x2160, 1920x1080, and 960x540. The existing approved Bali photograph and all other approved media records were preserved unchanged.

No package content or UI files were edited. No dependency was added; the repository's existing `ffmpeg-static` binary performed every transformation.

## Selected sources and download evidence

Pexels source and licence pages were checked online on 2026-09-01. Each selected photo page displayed `Free download`, `Free to use`, the named photographer, and the photographed location where Pexels supplied one.

| Package | Official Pexels photo page | Photographer | Pexels location | Original dimensions | Direct original download | SHA-256 |
| --- | --- | --- | --- | ---: | --- | --- |
| Mexico | https://www.pexels.com/photo/mayan-ruins-of-chichen-itza-under-blue-sky-33126211/ | Cristian Aragón | Mexico; page description identifies Chichén Itzá, Yucatán | 5937x3958 | https://images.pexels.com/photos/33126211/pexels-photo-33126211.jpeg | `87CA586DBA97BE80B9937C397979B46E84E6B104D4378972BD33929667EDB37E` |
| Tanzania | https://www.pexels.com/photo/african-elephants-in-serengeti-landscape-35327180/ | Prince III | Tanzania; page description identifies Serengeti National Park | 4288x2848 | https://images.pexels.com/photos/35327180/pexels-photo-35327180.jpeg | `6AB5E60D8D232FE393E6E93EFBD65B3DE4B8B4ABADC8BADD77F371C8D47FA1F2` |
| USA 2026 | https://www.pexels.com/photo/the-statue-of-liberty-against-the-background-of-the-new-york-city-18468673/ | Artem Zhukov | New York City, USA | 6243x4162 | https://images.pexels.com/photos/18468673/pexels-photo-18468673.jpeg | `149D976EF957616FA6EB8F1A0085B672875F10AB3FF23A3E5D821DF87A673741` |
| Machu Picchu | https://www.pexels.com/photo/machu-picchu-peru-1570610/ | Paula Nardini | Peru; page description identifies Machu Picchu | 6000x4000 | https://images.pexels.com/photos/1570610/pexels-photo-1570610.jpeg | `7D71CCE66C13AA02563ACA26AC36FBF6BA1648510B7972B6CCB32C0978562743` |
| Ramakkalmedu visual proxy | https://www.pexels.com/photo/lush-green-hills-with-wind-turbines-under-blue-sky-37161611/ | 幼聪 戴 | Japan | 8256x5504 | https://images.pexels.com/photos/37161611/pexels-photo-37161611.jpeg | `62CEF9F26C6EC84DED4B2E29AA0E6E023678B6EED52E6861249B50EBD308F2D9` |

Original downloads were used as temporary transformation inputs and were not added to the repository.

### Licensing evidence

- Pexels License: https://www.pexels.com/license/
- Pexels Terms of Service: https://www.pexels.com/terms-of-service/
- The licence page checked on 2026-09-01 says Pexels photos are free to use, may be modified, and may be used on websites and in promotional material. Attribution is not required, although photographer credit is appreciated.
- The Terms of Service page checked on 2026-09-01 was marked last updated 2024-11-15. Section 5 grants an irrevocable, worldwide, non-exclusive, royalty-free right to download, use, copy, modify, or adapt Pexels-licensed content, subject to prohibited uses. The selected use does not redistribute standalone originals or imply endorsement.
- Every selected crop was visually checked for logos and identifiable foreground people. Mexico's crop excludes the source's lone edge visitor. Machu Picchu retains only distant incidental visitors who are not identifiable.

### Rejected candidates

- Chichén Itzá photo 20616344 met the pixel requirement but contained several identifiable foreground visitors in its fixed 16:9 frame.
- Chichén Itzá photo 16987124 was portrait and only 3681 pixels wide.
- Machu Picchu photo 4880888 was only 3000x2000.
- Munnar/Kerala wind-turbine photo 31566043 was portrait and only 2640x3520.
- No true Ramakkalmedu-specific official Pexels photo meeting all of the clean, landscape, and minimum 3840x2160 constraints was found. The selected Japan photograph is registered and described only as a visual proxy; neither its media alt text nor provenance claims it was photographed in Ramakkalmedu.

## Crop and focal-point decisions

| Package | Source crop (`x:y:w:h`) | Focal point | Rationale |
| --- | --- | --- | --- |
| Mexico | `0:404:5600:3150` | `38% 61%` | Near-centred crop removes the edge visitor and retains the Chichén Itzá ruins, green foreground, and sky. |
| Tanzania | `0:218:4288:2412` | `52% 61%` | Centred crop retains the elephant family and layered Serengeti plains. |
| USA 2026 | `0:326:6240:3510` | `48% 51%` | Centred crop balances the Statue of Liberty, skyline, harbour, and cloud field. |
| Machu Picchu | `8:0:5984:3366` | `49% 61%` | Top-aligned crop retains Huayna Picchu and the terraces while excluding nearby foreground visitors. |
| Ramakkalmedu proxy | `0:430:8256:4644` | `54% 58%` | Centred crop preserves Japan's rolling green hills and distant turbines. The provenance explicitly states that the photo is not Ramakkalmedu. |

## Transformations

The installed encoder support was verified with:

```powershell
& 'node_modules\ffmpeg-static\ffmpeg.exe' -hide_banner -encoders 2>&1 | Select-String -Pattern 'libaom-av1|libwebp'
```

For each source crop and each output size (`3840x2160`, `1920x1080`, and `960x540`), the following command forms were run. `SUFFIX` was empty for the 4K master, `-1920`, or `-960`.

```powershell
& $ffmpeg -hide_banner -loglevel error -y -i $source `
  -vf "crop=CROP_W:CROP_H:CROP_X:CROP_Y,scale=WIDTH:HEIGHT:flags=lanczos" `
  -frames:v 1 -c:v libaom-av1 -still-picture 1 -cpu-used 6 -crf 28 `
  -pix_fmt yuv420p "public\media\PACKAGE$SUFFIX.avif"

& $ffmpeg -hide_banner -loglevel error -y -i $source `
  -vf "crop=CROP_W:CROP_H:CROP_X:CROP_Y,scale=WIDTH:HEIGHT:flags=lanczos" `
  -frames:v 1 -c:v libwebp -quality 85 -compression_level 6 -preset photo `
  -pix_fmt yuv420p "public\media\PACKAGE$SUFFIX.webp"
```

All 30 outputs were decoded with the same repository `ffmpeg-static` binary. Every file was present and matched its registered dimensions: ten files at 3840x2160, ten at 1920x1080, and ten at 960x540.

## Files changed

- `src/data/media.test.ts`
- `src/data/media.ts`
- `.superpowers/sdd/2026-09-01-brochure-package-cards/task-3-report.md`
- Six responsive files per new package under `public/media/`:
  - `mexico{,-1920,-960}.{avif,webp}`
  - `tanzania{,-1920,-960}.{avif,webp}`
  - `usa-2026{,-1920,-960}.{avif,webp}`
  - `machu-picchu{,-1920,-960}.{avif,webp}`
  - `ramakkalmedu{,-1920,-960}.{avif,webp}`

The pre-existing untracked `docs/superpowers/` plan directory was read and preserved without modification.

## RED evidence

Command:

```text
npm test -- src/data/media.test.ts --pool=threads
```

Result: exit 1. One test file ran; 5 tests passed and 1 failed. The package-media contract expected the literal approved order of eleven IDs but received only the existing six. The failure diff specifically showed missing `mexico`, `tanzania`, `usa-2026`, `machu-picchu`, and `ramakkalmedu` registrations.

The RED run was repeated after adding the literal photographer/dimension expectations and the truthful Japan-proxy assertion; it failed for the same expected missing-registration reason.

## GREEN and verification evidence

- Targeted media tests: `npm test -- src/data/media.test.ts --pool=threads` — exit 0; 1 file and 6 tests passed.
- Full deterministic unit suite: `npm test -- --pool=threads` — exit 0; 16 files and 118 tests passed.
- TypeScript: `npx tsc -b --pretty false` — exit 0.
- Generated-file verification: all 30 new AVIF/WebP paths existed and decoded to their expected dimensions.
- Visual review: all five 3840x2160 WebP masters were inspected at original detail after transformation.
- Whitespace check before report: `git diff --check` — exit 0; only Git's existing LF-to-CRLF working-copy notices were emitted.

## Commit

- Requested commit: `feat: add brochure package media`
- This report is included in that commit; the resulting hash is reported in the final handoff.

## Risks and follow-up

- The Ramakkalmedu media record truthfully identifies the selected photograph as Japan and describes it as a visual proxy. The pre-existing `TravelPackage.imageAlt` in `src/data/packages.ts` still says Ramakkalmedu, because package content and UI files were explicitly outside Task 3 ownership. A later authorized package/UI task should consume `PackageMediaAsset.altText` or correct that package-level alt before production so the rendered alt text cannot misstate the photographed location.
- Pexels availability and terms can change. The source URLs, exact download URLs, download date, dimensions, and original-file SHA-256 hashes above preserve the provenance checked for this task.
- Original JPEG downloads are intentionally not committed; only transformed site assets are included.
