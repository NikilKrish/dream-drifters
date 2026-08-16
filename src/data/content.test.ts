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

  it('does not expose an unconfirmed package price', () => {
    expect(packages.every((item) => item.priceStatus === 'hidden')).toBe(true);
    expect(getPackagePriceLabel(packages[0])).toBe('Request current quote');
  });

  it('publishes the corrected capability taxonomy without Travel Insurance', () => {
    expect(capabilities.map((item) => item.id)).toEqual(['tour-packages', 'flights', 'accommodation', 'visa', 'mice', 'corporate-travel']);
    expect(capabilities.some((item) => item.title.includes('Insurance'))).toBe(false);
    expect(capabilities.find((item) => item.id === 'tour-packages')?.action.kind).toBe('packages');
    expect(proofItems.find((item) => item.label === 'Leisure and Corporate')).toBeTruthy();
  });
});
