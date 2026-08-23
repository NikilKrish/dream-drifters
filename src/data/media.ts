import type { ChapterMediaAssignment, MediaAsset, MediaChapter, MediaFormatKind } from '../types';

const temporary = {
  licenceStatus: 'review-required',
  replacementState: 'replace-before-production',
} as const;

export const mediaAssets: MediaAsset[] = [
  {
    id: 'hero-discovery', chapter: 'hero', focalPoint: { x: 50, y: 50 }, ...temporary, consentStatus: 'not-applicable',
    source: { family: 'discovery', origin: 'Temporary local poster and Coverr video family', reference: 'https://coverr.co/videos/a-tropical-landscape-0lb0joigvv' },
    formats: [{ kind: 'mp4', path: '/media/discovery.mp4' }, { kind: 'webm', path: '/media/discovery.webm' }],
    posters: [{ kind: 'avif', path: '/media/hero.avif' }, { kind: 'webp', path: '/media/hero.webp' }],
    mobileSources: [{ kind: 'mp4', path: '/media/discovery-mobile.mp4' }, { kind: 'webm', path: '/media/discovery-mobile.webm' }, { kind: 'avif', path: '/media/hero-mobile.avif' }, { kind: 'webp', path: '/media/hero-mobile.webp' }],
  },
  {
    id: 'about-people', chapter: 'about', focalPoint: { x: 62, y: 48 }, ...temporary, consentStatus: 'required',
    source: { family: 'travellers-frame', origin: 'Local frame derived from the temporary travellers video family', reference: 'https://coverr.co/videos/boarding-a-plane-5jd0b6okwj' },
    formats: [{ kind: 'avif', path: '/media/about-people.avif' }, { kind: 'webp', path: '/media/about-people.webp' }], posters: [], mobileSources: [],
  },
  {
    id: 'direction-horizon', chapter: 'direction', focalPoint: { x: 63, y: 45 }, ...temporary, consentStatus: 'not-applicable',
    source: { family: 'discovery-frame', origin: 'Local frame derived from the temporary discovery video family', reference: 'https://coverr.co/videos/a-tropical-landscape-0lb0joigvv' },
    formats: [{ kind: 'avif', path: '/media/direction-horizon.avif' }, { kind: 'webp', path: '/media/direction-horizon.webp' }], posters: [], mobileSources: [],
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
  { chapter: 'hero', assetId: 'hero-discovery', semanticUse: 'Open-ended discovery and the start of a journey', active: true },
  { chapter: 'about', assetId: 'about-people', semanticUse: 'People moving through a managed travel moment', active: true },
  { chapter: 'direction', assetId: 'direction-horizon', semanticUse: 'A broad horizon for vision and mission', active: true },
  { chapter: 'services', assetId: 'services-operations', semanticUse: 'Visible aviation operations and coordination', active: true },
  { chapter: 'assurance', assetId: 'assurance-travellers', semanticUse: 'Travellers supported through an active journey', active: true },
  { chapter: 'enquiry', assetId: 'enquiry-airport', semanticUse: 'Operational readiness behind a travel request', active: true },
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
