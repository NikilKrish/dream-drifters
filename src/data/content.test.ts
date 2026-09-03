import { describe, expect, it } from 'vitest';
import { capabilities, proofItems } from './company';
import { packages } from './packages';
import { verifiedTestimonials } from './testimonials';
import { getPackagePriceLabel } from '../components/PackagesSection';

describe('publishable travel content', () => {
  it('renders only verified proof and testimonials', () => {
    expect(proofItems.every((item) => item.status === 'verified')).toBe(true);
    expect(verifiedTestimonials.every((item) => item.status === 'verified')).toBe(true);
    expect(verifiedTestimonials).toHaveLength(0);
  });

  it('presents all packages as quote-only while preserving brochure price metadata', () => {
    expect(packages).toHaveLength(11);
    expect(packages.every((item) => getPackagePriceLabel(item) === 'Request current quote')).toBe(true);
    expect(
      Object.fromEntries(packages.filter((item) => item.priceStatus === 'verified').map((item) => [item.id, item.price])),
    ).toEqual({ bali: 'US $357', mexico: '$1,513.00', tanzania: '$2,185 PP' });
    expect(packages.filter((item) => item.priceStatus === 'hidden').every((item) => item.price === '')).toBe(true);
  });

  it('publishes the corrected capability taxonomy without Travel Insurance', () => {
    expect(capabilities.map((item) => item.id)).toEqual(['tour-packages', 'flights', 'accommodation', 'visa', 'mice', 'corporate-travel']);
    expect(capabilities.some((item) => item.title.includes('Insurance'))).toBe(false);
    expect(capabilities.find((item) => item.id === 'tour-packages')?.action.kind).toBe('packages');
    expect(proofItems.find((item) => item.label === 'Leisure and Corporate')).toBeTruthy();
  });

  it('publishes Events & Incentives while preserving the MICE enquiry id', () => {
    expect(capabilities.find((item) => item.id === 'mice')).toEqual({
      id: 'mice',
      shortTitle: 'Events',
      title: 'Events & Incentives',
      summary: 'Purposeful business gatherings and incentive journeys, planned end to end.',
      image: '/media/bali.webp',
      imageAvif: '/media/bali.avif',
      features: [
        'Business meetings and conferences',
        'Rewards and recognition programmes',
        'Incentive travel and leadership retreats',
        'Employee engagement tours',
        'Corporate events and travel vouchers',
      ],
      action: { kind: 'enquiry', serviceId: 'mice' },
    });
  });
});
