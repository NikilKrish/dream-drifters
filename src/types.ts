export interface ItineraryDay {
  day: string;
  title: string;
  detail: string;
}

export interface PackageDepartureSchedule {
  caption: string;
  months: string[];
  programmes: Array<{
    name: string;
    duration: string;
    departures: Array<string | null>;
  }>;
}

export interface BrochureDetails {
  sourceFile: string;
  highlights?: string[];
  accommodation?: string[];
  exclusions?: string[];
  commercialNotes?: string[];
  minimumTravellers?: number;
  departureSchedule?: PackageDepartureSchedule;
  contentNotice?: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  editorialTitle: string;
  location: string;
  duration: string;
  durationDays?: number;
  price: string;
  priceStatus: 'verified' | 'indicative' | 'hidden';
  priceCheckedAt?: string;
  mood: string;
  summary: string;
  image: string;
  imageAvif: string;
  imageAlt: string;
  inclusions: string[];
  itinerary: ItineraryDay[];
  brochure?: BrochureDetails;
  layout: 'feature' | 'landscape' | 'portrait';
  badge?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  journey: string;
  status: VerificationStatus;
  source?: string;
  verifiedAt?: string;
}

export type VerificationStatus = 'verified' | 'draft' | 'hidden';

export interface ProofItem {
  label: string;
  detail: string;
  status: VerificationStatus;
  source?: string;
  verifiedAt?: string;
}

export interface TravelService {
  id: import('../shared/brief').ServiceId;
  title: string;
  shortTitle: string;
  summary: string;
  features: string[];
  image: string;
  imageAvif: string;
}

export type CapabilityId = 'tour-packages' | import('../shared/brief').ActiveServiceId;

export interface TravelCapability {
  id: CapabilityId;
  title: string;
  shortTitle: string;
  summary: string;
  features: string[];
  image: string;
  imageAvif: string;
  action: { kind: 'packages' } | { kind: 'enquiry'; serviceId: import('../shared/brief').ActiveServiceId };
}

export interface TrustReason { title: string; detail: string; }

export interface EnquirySelection {
  interestKind: import('../shared/brief').InterestKind;
  packageId?: string;
  serviceId?: import('../shared/brief').ServiceId;
  label: string;
  requestId: number;
}

export type MediaChapter = 'hero' | 'about' | 'direction' | 'services' | 'assurance' | 'enquiry';
export type MediaFormatKind = 'avif' | 'webp' | 'mp4' | 'webm';
export type MediaLicenceStatus = 'approved' | 'review-required';
export type MediaConsentStatus = 'confirmed' | 'not-applicable' | 'required';
export type MediaReplacementState = 'approved' | 'replace-before-production';

export interface MediaDimensions {
  width: number;
  height: number;
}

export interface MediaSourceCrop extends MediaDimensions {
  x: number;
  y: number;
  aspectRatio: '4:3' | '16:9';
  rationale: string;
}

export interface MediaOutput {
  label: 'master' | 'large' | 'small';
  dimensions: MediaDimensions;
  formats: MediaFormat[];
}

export type ResponsiveVideoLabel = 'mobile' | 'standard' | 'desktop' | 'ultra';

export interface ResponsiveVideoSelection {
  minViewportWidth?: number;
  maxViewportWidth?: number;
  minEffectiveWidth?: number;
  minDeviceMemory?: number;
  excludedEffectiveTypes?: string[];
}

export interface ResponsiveVideoOutput {
  label: ResponsiveVideoLabel;
  dimensions: MediaDimensions;
  formats: MediaFormat[];
  selection: ResponsiveVideoSelection;
  crop?: {
    aspectRatio: '16:9' | '9:16';
    focalPoint: { x: number; y: number };
    rationale: string;
  };
}

export interface MediaLicenceEvidence {
  name: string;
  url: string;
  termsUrl: string;
}

export interface MediaProductionMetadata {
  photographer: string;
  sourcePage: string;
  licence: MediaLicenceEvidence;
  downloadDate: string;
  originalDimensions: MediaDimensions;
  crop: MediaSourceCrop;
  outputs: MediaOutput[];
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  frameRate?: number;
  videoOutputs?: ResponsiveVideoOutput[];
  productionApproval: {
    approvedForProduction: boolean;
    approvedAt: string;
    rationale: string;
  };
  consentReleaseRationale: string;
}

export interface MediaFormat {
  kind: MediaFormatKind;
  path: string;
}

export interface MediaAsset {
  id: string;
  source: {
    family: string;
    origin: string;
    reference?: string;
  };
  chapter: MediaChapter;
  focalPoint: { x: number; y: number };
  formats: MediaFormat[];
  posters: MediaFormat[];
  mobileSources: MediaFormat[];
  licenceStatus: MediaLicenceStatus;
  consentStatus: MediaConsentStatus;
  replacementState: MediaReplacementState;
  productionMetadata?: MediaProductionMetadata;
}

export interface PackageMediaAsset {
  id: string;
  source: MediaAsset['source'];
  focalPoint: MediaAsset['focalPoint'];
  altText: string;
  productionMetadata: MediaProductionMetadata;
}

export interface ChapterMediaAssignment {
  chapter: MediaChapter;
  assetId: string;
  semanticUse: string;
  active: boolean;
}
