export interface ItineraryDay {
  day: string;
  title: string;
  detail: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  editorialTitle: string;
  location: string;
  duration: string;
  durationDays: number;
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
}

export interface ChapterMediaAssignment {
  chapter: MediaChapter;
  assetId: string;
  semanticUse: string;
  active: boolean;
}
