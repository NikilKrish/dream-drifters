import { describe, expect, it } from 'vitest';
import { proofItems } from './company';
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
});
