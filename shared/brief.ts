export type InterestKind = 'package' | 'service' | 'custom';
export type ActiveServiceId = 'flights' | 'accommodation' | 'visa' | 'mice' | 'corporate-travel';
export type LegacyServiceId = 'hotels' | 'events' | 'insurance';
export type ServiceId = ActiveServiceId | LegacyServiceId;
export type BudgetBand = 'under-100k' | '100k-200k' | '200k-400k' | '400k-plus' | 'discuss';

export interface EnquiryBrief {
  interestKind: InterestKind;
  packageId?: string;
  serviceId?: ServiceId;
  travelWindow?: string;
  durationDays?: number;
  adults?: number;
  children?: number;
  budgetBand?: BudgetBand;
  name: string;
  mobile: string;
  email: string;
  notes?: string;
  consent: boolean;
  website?: string;
  startedAt: number;
}

export interface ValidationErrors { [key: string]: string; }

const phonePattern = /^\+?[0-9\s()-]{8,18}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const packageNames: Record<string, string> = {
  maldives: 'Maldives Paradise', switzerland: 'Swiss Alps Adventure', japan: 'Japan Cultural Journey',
  dubai: 'Dubai Luxury Escape', bali: 'Bali Tropical Paradise', paris: 'Paris Romantic Getaway',
};

const serviceNames: Record<ServiceId, string> = {
  'corporate-travel': 'Corporate Travel', flights: 'Flights', accommodation: 'Accommodation',
  visa: 'Visas', mice: 'Meeting Incentive, Conference Event (MICE)',
  hotels: 'Accommodation', events: 'Meeting Incentive, Conference Event (MICE)',
  insurance: 'Travel Insurance (legacy request)',
};

export function normalizeServiceId(value: unknown): ServiceId | undefined {
  if (value === 'hotels') return 'accommodation';
  if (value === 'events') return 'mice';
  if (typeof value === 'string' && value in serviceNames) return value as ServiceId;
  return undefined;
}

const budgetLabels: Record<BudgetBand, string> = {
  'under-100k': 'Under ₹1 lakh per person', '100k-200k': '₹1 to ₹2 lakh per person',
  '200k-400k': '₹2 to ₹4 lakh per person', '400k-plus': '₹4 lakh or more per person', discuss: 'Let’s discuss',
};

export function normalizeText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength) : '';
}

export function normalizeBrief(input: Partial<EnquiryBrief>): EnquiryBrief {
  const interestKind: InterestKind = input.interestKind === 'package' || input.interestKind === 'service' ? input.interestKind : 'custom';
  return {
    interestKind,
    packageId: interestKind === 'package' ? normalizeText(input.packageId, 80) || undefined : undefined,
    serviceId: interestKind === 'service' ? normalizeServiceId(input.serviceId) : undefined,
    travelWindow: normalizeText(input.travelWindow, 100) || undefined,
    durationDays: Number.isFinite(Number(input.durationDays)) ? Math.max(1, Math.min(60, Number(input.durationDays))) : undefined,
    adults: Number.isFinite(Number(input.adults)) ? Math.max(1, Math.min(20, Number(input.adults))) : undefined,
    children: Number.isFinite(Number(input.children)) ? Math.max(0, Math.min(20, Number(input.children))) : undefined,
    budgetBand: input.budgetBand,
    name: normalizeText(input.name, 100),
    mobile: normalizeText(input.mobile, 24),
    email: normalizeText(input.email, 160),
    notes: normalizeText(input.notes, 1200) || undefined,
    consent: input.consent === true,
    website: normalizeText(input.website, 120),
    startedAt: Number(input.startedAt) || Date.now(),
  };
}

export function validateBrief(brief: EnquiryBrief): ValidationErrors {
  const errors: ValidationErrors = {};
  if (brief.interestKind === 'package') {
    if (!brief.packageId) errors.packageId = 'Choose the journey you would like us to shape.';
    if (!brief.travelWindow) errors.travelWindow = 'Tell us roughly when you would like to travel.';
    if (!brief.adults) errors.adults = 'Add at least one adult traveller.';
    if (!brief.budgetBand) errors.budgetBand = 'Choose a budget range or select “Let’s discuss”.';
  }
  if (brief.interestKind === 'service' && !brief.serviceId) errors.serviceId = 'Choose the service you need.';
  if (!brief.name || brief.name.length < 2) errors.name = 'Please enter your full name.';
  if (!phonePattern.test(brief.mobile)) errors.mobile = 'Mobile number needs 8 to 18 digits. Example: +91 98765 43210.';
  if (!brief.email) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(brief.email)) errors.email = 'Email address needs a complete format. Example: name@example.com.';
  if (!brief.consent) errors.consent = 'Please agree so our team can respond to this enquiry.';
  return errors;
}

export function formatBrief(brief: EnquiryBrief): string {
  const interest = brief.interestKind === 'package'
    ? `Travel package: ${packageNames[brief.packageId ?? ''] ?? brief.packageId}`
    : brief.interestKind === 'service'
      ? `Service: ${brief.serviceId ? serviceNames[brief.serviceId] : ''}`
      : 'Interest: A custom travel request';
  const lines = [
    'Hello Dream Drifters. I would like help with an enquiry.', '', interest,
    brief.travelWindow ? `Travel window: ${brief.travelWindow}` : undefined,
    brief.durationDays ? `Duration: ${brief.durationDays} days` : undefined,
    brief.adults ? `Travellers: ${brief.adults} adult${brief.adults === 1 ? '' : 's'}${brief.children ? `, ${brief.children} child${brief.children === 1 ? '' : 'ren'}` : ''}` : undefined,
    brief.budgetBand ? `Budget: ${budgetLabels[brief.budgetBand]}` : undefined,
    '', `Name: ${brief.name}`, `Mobile: ${brief.mobile}`, `Email: ${brief.email}`,
    brief.notes ? `Message: ${brief.notes}` : undefined,
  ];
  return lines.filter(Boolean).join('\n');
}
