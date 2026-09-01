import type { ChapterMediaAssignment, MediaAsset, MediaChapter, MediaFormatKind, MediaOutput, MediaProductionMetadata, PackageMediaAsset, ResponsiveVideoOutput } from '../types';

const temporary = {
  licenceStatus: 'review-required',
  replacementState: 'replace-before-production',
} as const;

const pexelsLicence = {
  name: 'Pexels License',
  url: 'https://www.pexels.com/license/',
  termsUrl: 'https://www.pexels.com/terms-of-service/',
} as const;

function responsiveOutputs(id: string, master: { width: number; height: number }): MediaOutput[] {
  const aspectHeight = master.width === 4096 ? { large: 1440, small: 720 } : { large: 1080, small: 540 };
  return [
    { label: 'master', dimensions: master, formats: [{ kind: 'avif', path: `/media/${id}.avif` }, { kind: 'webp', path: `/media/${id}.webp` }] },
    { label: 'large', dimensions: { width: 1920, height: aspectHeight.large }, formats: [{ kind: 'avif', path: `/media/${id}-1920.avif` }, { kind: 'webp', path: `/media/${id}-1920.webp` }] },
    { label: 'small', dimensions: { width: 960, height: aspectHeight.small }, formats: [{ kind: 'avif', path: `/media/${id}-960.avif` }, { kind: 'webp', path: `/media/${id}-960.webp` }] },
  ];
}

const approval = {
  approvedForProduction: true,
  approvedAt: '2026-08-25',
  rationale: 'Approved for the selected editorial placement under the recorded Pexels licence, crop and non-endorsement constraints.',
} as const;

const heroVideoOutputs: ResponsiveVideoOutput[] = [
  {
    label: 'mobile', dimensions: { width: 1080, height: 1920 }, selection: { maxViewportWidth: 699 },
    formats: [{ kind: 'mp4', path: '/media/hero-tropical-mobile-1080.mp4' }, { kind: 'webm', path: '/media/hero-tropical-mobile-1080.webm' }],
    crop: { aspectRatio: '9:16', focalPoint: { x: 55, y: 50 }, rationale: 'Dedicated central shoreline crop keeps both the beach and water readable behind the compact mobile headline.' },
  },
  {
    label: 'standard', dimensions: { width: 1920, height: 1080 }, selection: { minViewportWidth: 700 },
    formats: [{ kind: 'mp4', path: '/media/hero-tropical-1080.mp4' }, { kind: 'webm', path: '/media/hero-tropical-1080.webm' }],
    crop: { aspectRatio: '16:9', focalPoint: { x: 56, y: 50 }, rationale: 'Full-width source crop for tablets and constrained desktops.' },
  },
  {
    label: 'desktop', dimensions: { width: 2560, height: 1440 }, selection: { minViewportWidth: 1100, excludedEffectiveTypes: ['3g'] },
    formats: [{ kind: 'mp4', path: '/media/hero-tropical-1440.mp4' }, { kind: 'webm', path: '/media/hero-tropical-1440.webm' }],
    crop: { aspectRatio: '16:9', focalPoint: { x: 56, y: 50 }, rationale: 'Full native frame scaled for standard high-density desktop delivery.' },
  },
  {
    label: 'ultra', dimensions: { width: 3840, height: 2160 }, selection: { minViewportWidth: 1920, minEffectiveWidth: 2560, minDeviceMemory: 8, excludedEffectiveTypes: ['3g'] },
    formats: [{ kind: 'mp4', path: '/media/hero-tropical-2160.mp4' }, { kind: 'webm', path: '/media/hero-tropical-2160.webm' }],
    crop: { aspectRatio: '16:9', focalPoint: { x: 56, y: 50 }, rationale: 'Native-resolution frame for large capable displays only.' },
  },
];

const heroPosterOutputs: MediaOutput[] = [
  { label: 'master', dimensions: { width: 3840, height: 2160 }, formats: [{ kind: 'avif', path: '/media/hero-tropical-2160.avif' }, { kind: 'webp', path: '/media/hero-tropical-2160.webp' }] },
  { label: 'large', dimensions: { width: 2560, height: 1440 }, formats: [{ kind: 'avif', path: '/media/hero-tropical-1440.avif' }, { kind: 'webp', path: '/media/hero-tropical-1440.webp' }] },
  { label: 'small', dimensions: { width: 1920, height: 1080 }, formats: [{ kind: 'avif', path: '/media/hero-tropical-1080.avif' }, { kind: 'webp', path: '/media/hero-tropical-1080.webp' }] },
];

type PexelsMetadataInput = Omit<MediaProductionMetadata, 'licence' | 'downloadDate' | 'productionApproval'> & {
  downloadDate?: string;
  approvedAt?: string;
};

function pexelsMetadata({ downloadDate = '2026-08-25', approvedAt = downloadDate, ...metadata }: PexelsMetadataInput): MediaProductionMetadata {
  return { ...metadata, licence: pexelsLicence, downloadDate, productionApproval: { ...approval, approvedAt } };
}

export const mediaAssets: MediaAsset[] = [
  {
    id: 'hero-tropical-aerial', chapter: 'hero', focalPoint: { x: 56, y: 50 }, licenceStatus: 'approved', consentStatus: 'not-applicable', replacementState: 'approved',
    source: { family: 'pexels-video-14920039', origin: 'Pexels tropical shoreline aerial by Adrien JACTA', reference: 'https://www.pexels.com/video/drone-footage-of-an-empty-tropical-beach-14920039/' },
    formats: [{ kind: 'mp4', path: '/media/hero-tropical-2160.mp4' }, { kind: 'webm', path: '/media/hero-tropical-2160.webm' }],
    posters: [{ kind: 'avif', path: '/media/hero-tropical-2160.avif' }, { kind: 'webp', path: '/media/hero-tropical-2160.webp' }],
    mobileSources: [{ kind: 'avif', path: '/media/hero-tropical-mobile-1080.avif' }, { kind: 'webp', path: '/media/hero-tropical-mobile-1080.webp' }],
    productionMetadata: pexelsMetadata({
      photographer: 'Adrien JACTA', sourcePage: 'https://www.pexels.com/video/drone-footage-of-an-empty-tropical-beach-14920039/', originalDimensions: { width: 3840, height: 2160 },
      crop: { x: 0, y: 0, width: 3840, height: 2160, aspectRatio: '16:9', rationale: 'The full aerial frame retains the quiet shoreline, ocean horizon and protected left-side contrast for the existing hero composition.' },
      outputs: heroPosterOutputs, durationSeconds: 12, sourceDurationSeconds: 28, frameRate: 25, videoOutputs: heroVideoOutputs,
      consentReleaseRationale: 'The source is explicitly tagged as an empty beach with no identifiable people; no brand affiliation or endorsement is implied.',
    }),
  },
  {
    id: 'about-people', chapter: 'about', focalPoint: { x: 68, y: 50 }, licenceStatus: 'approved', consentStatus: 'confirmed', replacementState: 'approved',
    source: { family: 'pexels-photo-7979588', origin: 'Pexels still photo by Kindel Media', reference: 'https://www.pexels.com/photo/man-couple-love-people-7979588/' },
    formats: [{ kind: 'avif', path: '/media/about-people.avif' }, { kind: 'webp', path: '/media/about-people.webp' }], posters: [], mobileSources: [],
    productionMetadata: pexelsMetadata({
      photographer: 'Kindel Media', sourcePage: 'https://www.pexels.com/photo/man-couple-love-people-7979588/', originalDimensions: { width: 5196, height: 3464 },
      crop: { x: 290, y: 1, width: 4616, height: 3462, aspectRatio: '4:3', rationale: 'Centred 4:3 crop retains the advisor and both clients without manufacturing an association with Dream Drifters.' },
      outputs: responsiveOutputs('about-people', { width: 4096, height: 3072 }),
      consentReleaseRationale: 'The Pexels contributor terms require uploaders to retain necessary releases. Use remains illustrative and generic; neither the alt text nor surrounding copy identifies the people or implies that they endorse or are affiliated with Dream Drifters.',
    }),
  },
  {
    id: 'direction-train', chapter: 'direction', focalPoint: { x: 48, y: 42 }, ...temporary, consentStatus: 'not-applicable',
    source: { family: 'train-window', origin: 'User-supplied generated train-window video', reference: 'hf_20260815_075404_79760989-b635-43ea-a303-9328302990f3.mp4' },
    formats: [{ kind: 'mp4', path: '/media/direction-train.mp4' }, { kind: 'webm', path: '/media/direction-train.webm' }],
    posters: [{ kind: 'avif', path: '/media/direction-train-poster.avif' }, { kind: 'webp', path: '/media/direction-train-poster.webp' }],
    mobileSources: [{ kind: 'avif', path: '/media/direction-train-mobile.avif' }, { kind: 'webp', path: '/media/direction-train-mobile.webp' }],
  },
  {
    id: 'services-operations', chapter: 'services', focalPoint: { x: 56, y: 45 }, ...temporary, consentStatus: 'not-applicable',
    source: { family: 'operations', origin: 'Temporary Coverr video family and local frame-derived poster', reference: 'https://coverr.co/videos/planes-heading-to-the-runway-s88pegx0yt' },
    formats: [{ kind: 'mp4', path: '/media/operations.mp4' }, { kind: 'webm', path: '/media/operations.webm' }],
    posters: [{ kind: 'avif', path: '/media/operations-poster.avif' }, { kind: 'webp', path: '/media/operations-poster.webp' }],
    mobileSources: [{ kind: 'mp4', path: '/media/operations-mobile.mp4' }, { kind: 'webm', path: '/media/operations-mobile.webm' }],
  },
  {
    id: 'assurance-travellers', chapter: 'assurance', focalPoint: { x: 52, y: 50 }, ...temporary, consentStatus: 'required',
    source: { family: 'travellers', origin: 'Temporary Coverr video family and local frame-derived poster', reference: 'https://coverr.co/videos/boarding-a-plane-5jd0b6okwj' },
    formats: [{ kind: 'mp4', path: '/media/travellers.mp4' }, { kind: 'webm', path: '/media/travellers.webm' }],
    posters: [{ kind: 'avif', path: '/media/travellers-poster.avif' }, { kind: 'webp', path: '/media/travellers-poster.webp' }],
    mobileSources: [{ kind: 'mp4', path: '/media/travellers-mobile.mp4' }, { kind: 'webm', path: '/media/travellers-mobile.webm' }],
  },
  {
    id: 'enquiry-airport', chapter: 'enquiry', focalPoint: { x: 60, y: 42 }, ...temporary, consentStatus: 'not-applicable',
    source: { family: 'operations-frame', origin: 'Local frame derived from the temporary operations video family', reference: 'https://coverr.co/videos/planes-heading-to-the-runway-s88pegx0yt' },
    formats: [{ kind: 'avif', path: '/media/enquiry-airport.avif' }, { kind: 'webp', path: '/media/enquiry-airport.webp' }], posters: [], mobileSources: [],
  },
];

export const activeChapterMedia: ChapterMediaAssignment[] = [
  { chapter: 'hero', assetId: 'hero-tropical-aerial', semanticUse: 'Open-ended discovery and the start of a journey', active: true },
  { chapter: 'about', assetId: 'about-people', semanticUse: 'People moving through a managed travel moment', active: true },
  { chapter: 'direction', assetId: 'direction-train', semanticUse: 'Forward movement seen through a train window', active: true },
  { chapter: 'services', assetId: 'services-operations', semanticUse: 'Visible aviation operations and coordination', active: true },
  { chapter: 'assurance', assetId: 'assurance-travellers', semanticUse: 'Travellers supported through an active journey', active: true },
  { chapter: 'enquiry', assetId: 'enquiry-airport', semanticUse: 'Operational readiness behind a travel request', active: true },
];

export const packageMediaAssets: PackageMediaAsset[] = [
  {
    id: 'maldives', focalPoint: { x: 61, y: 51 }, altText: 'A pale sandbar curving through turquoise water in the Maldives',
    source: { family: 'pexels-photo-32807065', origin: 'Pexels still photo by Ken Cheung', reference: 'https://www.pexels.com/photo/aerial-view-of-pristine-maldives-beach-at-daytime-32807065/' },
    productionMetadata: pexelsMetadata({ photographer: 'Ken Cheung', sourcePage: 'https://www.pexels.com/photo/aerial-view-of-pristine-maldives-beach-at-daytime-32807065/', originalDimensions: { width: 4770, height: 2680 }, crop: { x: 9, y: 3, width: 4752, height: 2673, aspectRatio: '16:9', rationale: 'Near-centred edge trim preserves the full curve of the sandbar.' }, outputs: responsiveOutputs('maldives', { width: 3840, height: 2160 }), consentReleaseRationale: 'Landscape-led aerial scene; tiny incidental figures are not identified and no affiliation or endorsement is implied.' }),
  },
  {
    id: 'japan', focalPoint: { x: 53, y: 39 }, altText: 'Mount Fuji rising beyond a sunlit lake in Japan',
    source: { family: 'pexels-photo-918275', origin: 'Pexels still photo by Brellbell PJ', reference: 'https://www.pexels.com/photo/mount-fuji-918275/' },
    productionMetadata: pexelsMetadata({ photographer: 'Brellbell PJ', sourcePage: 'https://www.pexels.com/photo/mount-fuji-918275/', originalDimensions: { width: 4896, height: 3264 }, crop: { x: 0, y: 180, width: 4896, height: 2754, aspectRatio: '16:9', rationale: 'Top-biased landscape crop keeps Mount Fuji dominant while retaining the lake reflection and shoreline.' }, outputs: responsiveOutputs('japan', { width: 3840, height: 2160 }), consentReleaseRationale: 'Unpeopled landscape; model consent is not applicable and no brand endorsement is implied.' }),
  },
  {
    id: 'switzerland', focalPoint: { x: 52, y: 59 }, altText: 'A turquoise lake between green hills in the Swiss Alps',
    source: { family: 'pexels-photo-36614033', origin: 'Pexels still photo by Ákos Szűcs', reference: 'https://www.pexels.com/photo/stunning-alpine-lake-scenery-in-swiss-alps-36614033/' },
    productionMetadata: pexelsMetadata({ photographer: 'Ákos Szűcs', sourcePage: 'https://www.pexels.com/photo/stunning-alpine-lake-scenery-in-swiss-alps-36614033/', originalDimensions: { width: 4775, height: 2985 }, crop: { x: 3, y: 150, width: 4768, height: 2682, aspectRatio: '16:9', rationale: 'Centred landscape crop prioritises the lake basin and inhabited alpine slopes.' }, outputs: responsiveOutputs('switzerland', { width: 3840, height: 2160 }), consentReleaseRationale: 'Unpeopled landscape; model consent is not applicable and no brand endorsement is implied.' }),
  },
  {
    id: 'bali', focalPoint: { x: 57, y: 57 }, altText: 'Lush green rice fields and palms in Bali',
    source: { family: 'pexels-photo-36699649', origin: 'Pexels still photo by Tom Fisk', reference: 'https://www.pexels.com/photo/lush-green-rice-fields-in-bali-s-tropical-paradise-36699649/' },
    productionMetadata: pexelsMetadata({ photographer: 'Tom Fisk', sourcePage: 'https://www.pexels.com/photo/lush-green-rice-fields-in-bali-s-tropical-paradise-36699649/', originalDimensions: { width: 8640, height: 5760 }, crop: { x: 0, y: 450, width: 8640, height: 4860, aspectRatio: '16:9', rationale: 'Centred 16:9 crop balances the rice terraces with the palm canopy.' }, outputs: responsiveOutputs('bali', { width: 3840, height: 2160 }), consentReleaseRationale: 'Unpeopled landscape; model consent is not applicable and no brand endorsement is implied.' }),
  },
  {
    id: 'paris', focalPoint: { x: 52, y: 47 }, altText: 'The Eiffel Tower framed by winter trees at sunset',
    source: { family: 'pexels-photo-15576446', origin: 'Pexels still photo by Denitsa Kireva', reference: 'https://www.pexels.com/photo/the-eiffel-tower-at-sunset-15576446/' },
    productionMetadata: pexelsMetadata({ photographer: 'Denitsa Kireva', sourcePage: 'https://www.pexels.com/photo/the-eiffel-tower-at-sunset-15576446/', originalDimensions: { width: 6720, height: 4480 }, crop: { x: 0, y: 0, width: 6720, height: 3780, aspectRatio: '16:9', rationale: 'Top-aligned crop protects the Eiffel Tower tip and tree framing while trimming foreground water.' }, outputs: responsiveOutputs('paris', { width: 3840, height: 2160 }), consentReleaseRationale: 'Architecture-led city scene; distant incidental people are not identified and no affiliation or endorsement is implied.' }),
  },
  {
    id: 'dubai', focalPoint: { x: 49, y: 62 }, altText: 'Dubai skyline across the water in evening light',
    source: { family: 'pexels-photo-5288791', origin: 'Pexels still photo by Michael Kabus', reference: 'https://www.pexels.com/photo/the-dubai-skyline-during-sunset-5288791/' },
    productionMetadata: pexelsMetadata({ photographer: 'Michael Kabus', sourcePage: 'https://www.pexels.com/photo/the-dubai-skyline-during-sunset-5288791/', originalDimensions: { width: 4912, height: 3264 }, crop: { x: 8, y: 350, width: 4896, height: 2754, aspectRatio: '16:9', rationale: 'Vertically biased crop balances the skyline, evening sky and waterline.' }, outputs: responsiveOutputs('dubai', { width: 3840, height: 2160 }), consentReleaseRationale: 'Unpeopled skyline; model consent is not applicable and no brand endorsement is implied.' }),
  },
  {
    id: 'mexico', focalPoint: { x: 38, y: 61 }, altText: 'Chichén Itzá rising above a green landscape in Mexico',
    source: { family: 'pexels-photo-33126211', origin: 'Pexels still photo by Cristian Aragón', reference: 'https://www.pexels.com/photo/mayan-ruins-of-chichen-itza-under-blue-sky-33126211/' },
    productionMetadata: pexelsMetadata({ photographer: 'Cristian Aragón', sourcePage: 'https://www.pexels.com/photo/mayan-ruins-of-chichen-itza-under-blue-sky-33126211/', downloadDate: '2026-09-01', originalDimensions: { width: 5937, height: 3958 }, crop: { x: 0, y: 404, width: 5600, height: 3150, aspectRatio: '16:9', rationale: 'Near-centred landscape crop excludes the lone edge visitor while retaining the Chichén Itzá ruins, green foreground and dramatic sky.' }, outputs: responsiveOutputs('mexico', { width: 3840, height: 2160 }), consentReleaseRationale: 'The approved crop contains no identifiable people or logos; no affiliation or endorsement is implied.' }),
  },
  {
    id: 'tanzania', focalPoint: { x: 52, y: 61 }, altText: 'A safari landscape with wildlife in Tanzania',
    source: { family: 'pexels-photo-35327180', origin: 'Pexels still photo by Prince III', reference: 'https://www.pexels.com/photo/african-elephants-in-serengeti-landscape-35327180/' },
    productionMetadata: pexelsMetadata({ photographer: 'Prince III', sourcePage: 'https://www.pexels.com/photo/african-elephants-in-serengeti-landscape-35327180/', downloadDate: '2026-09-01', originalDimensions: { width: 4288, height: 2848 }, crop: { x: 0, y: 218, width: 4288, height: 2412, aspectRatio: '16:9', rationale: 'Centred landscape crop keeps the elephant family and layered Serengeti plains readable across responsive card treatments.' }, outputs: responsiveOutputs('tanzania', { width: 3840, height: 2160 }), consentReleaseRationale: 'Wildlife landscape with no people or logos; model consent is not applicable and no endorsement is implied.' }),
  },
  {
    id: 'usa-2026', focalPoint: { x: 48, y: 51 }, altText: 'The Statue of Liberty and New York skyline in the USA',
    source: { family: 'pexels-photo-18468673', origin: 'Pexels still photo by Artem Zhukov', reference: 'https://www.pexels.com/photo/the-statue-of-liberty-against-the-background-of-the-new-york-city-18468673/' },
    productionMetadata: pexelsMetadata({ photographer: 'Artem Zhukov', sourcePage: 'https://www.pexels.com/photo/the-statue-of-liberty-against-the-background-of-the-new-york-city-18468673/', downloadDate: '2026-09-01', originalDimensions: { width: 6243, height: 4162 }, crop: { x: 700, y: 500, width: 5120, height: 2880, aspectRatio: '16:9', rationale: 'Right-shifted landscape crop excludes the left-edge Statue City Cruises ferry and preserves the Statue of Liberty, New York skyline, harbour and cloud field.' }, outputs: responsiveOutputs('usa-2026', { width: 3840, height: 2160 }), consentReleaseRationale: 'The ferry wordmark is outside the crop; the remaining unpeopled harbour cityscape has no visible logos, requires no model consent and implies no endorsement.' }),
  },
  {
    id: 'machu-picchu', focalPoint: { x: 49, y: 61 }, altText: 'The stone terraces and mountain setting of Machu Picchu in Peru',
    source: { family: 'pexels-photo-1570610', origin: 'Pexels still photo by Paula Nardini', reference: 'https://www.pexels.com/photo/machu-picchu-peru-1570610/' },
    productionMetadata: pexelsMetadata({ photographer: 'Paula Nardini', sourcePage: 'https://www.pexels.com/photo/machu-picchu-peru-1570610/', downloadDate: '2026-09-01', originalDimensions: { width: 6000, height: 4000 }, crop: { x: 8, y: 0, width: 5984, height: 3366, aspectRatio: '16:9', rationale: 'Top-aligned landscape crop preserves Huayna Picchu and the stone terraces while excluding nearby foreground visitors; only distant incidental visitors remain.' }, outputs: responsiveOutputs('machu-picchu', { width: 3840, height: 2160 }), consentReleaseRationale: 'Landscape-led scene; remaining visitors are distant and not identifiable, no logos are visible, and no affiliation or endorsement is implied.' }),
  },
  {
    id: 'ramakkalmedu', focalPoint: { x: 54, y: 58 }, altText: 'Wind turbines across rolling green hills in Japan',
    source: { family: 'pexels-photo-37161611', origin: 'Pexels still photo by 幼聪 戴', reference: 'https://www.pexels.com/photo/lush-green-hills-with-wind-turbines-under-blue-sky-37161611/' },
    productionMetadata: pexelsMetadata({ photographer: '幼聪 戴', sourcePage: 'https://www.pexels.com/photo/lush-green-hills-with-wind-turbines-under-blue-sky-37161611/', downloadDate: '2026-09-01', originalDimensions: { width: 8256, height: 5504 }, crop: { x: 0, y: 430, width: 8256, height: 4644, aspectRatio: '16:9', rationale: 'This clean Pexels wind-hills landscape was photographed in Japan, not Ramakkalmedu; it is used only as the closest verified visual proxy after no Ramakkalmedu-specific 4K landscape source was found. The centred crop preserves the rolling green hills and distant turbines.' }, outputs: responsiveOutputs('ramakkalmedu', { width: 3840, height: 2160 }), consentReleaseRationale: 'Unpeopled landscape with no visible logos; model consent is not applicable and no affiliation or endorsement is implied.' }),
  },
];

export function isMediaAssetApproved(asset: MediaAsset): boolean {
  return asset.licenceStatus === 'approved'
    && asset.consentStatus !== 'required'
    && asset.replacementState === 'approved';
}

export function getChapterMedia(chapter: MediaChapter): MediaAsset {
  const assignment = activeChapterMedia.find((item) => item.active && item.chapter === chapter);
  const asset = assignment && mediaAssets.find((item) => item.id === assignment.assetId);
  if (!asset) throw new Error(`Missing active media assignment for ${chapter}`);
  return asset;
}

export function getMediaPath(asset: MediaAsset, kind: MediaFormatKind, collection: 'formats' | 'posters' | 'mobileSources' = 'formats'): string | undefined {
  return asset[collection].find((format) => format.kind === kind)?.path;
}

export function getResponsiveImageSrcSet(asset: MediaAsset, kind: Extract<MediaFormatKind, 'avif' | 'webp'>): string | undefined {
  const candidates = asset.productionMetadata?.outputs
    .slice()
    .sort((a, b) => a.dimensions.width - b.dimensions.width)
    .flatMap((output) => {
      const format = output.formats.find((candidate) => candidate.kind === kind);
      return format ? [`${format.path} ${output.dimensions.width}w`] : [];
    });
  return candidates?.length ? candidates.join(', ') : undefined;
}

export function getPackageResponsiveImageSrcSet(id: string, kind: Extract<MediaFormatKind, 'avif' | 'webp'>): string | undefined {
  const asset = packageMediaAssets.find((candidate) => candidate.id === id);
  if (!asset) return undefined;
  const candidates = asset.productionMetadata.outputs
    .slice()
    .sort((a, b) => a.dimensions.width - b.dimensions.width)
    .flatMap((output) => {
      const format = output.formats.find((candidate) => candidate.kind === kind);
      return format ? [`${format.path} ${output.dimensions.width}w`] : [];
    });
  return candidates.length ? candidates.join(', ') : undefined;
}
