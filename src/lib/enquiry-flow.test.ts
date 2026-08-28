import { describe, expect, it } from 'vitest';
import { getEnquirySequence, getPreviousEnquiryStep } from './enquiry-flow';

describe('enquiry flow', () => {
  it('splits package enquiries into journey, travellers, and contact stages', () => {
    expect(getEnquirySequence('package', false)).toEqual(['interest', 'travellers', 'contact']);
    expect(getEnquirySequence('package', true)).toEqual(['interest', 'travellers', 'contact']);
  });

  it('keeps short custom and service enquiries in two stages', () => {
    expect(getEnquirySequence('custom', false)).toEqual(['interest', 'contact']);
    expect(getEnquirySequence('service', false)).toEqual(['interest', 'contact']);
  });

  it('keeps tall-desktop custom and service enquiries compact', () => {
    expect(getEnquirySequence('custom', true)).toEqual(['interest']);
    expect(getEnquirySequence('service', true)).toEqual(['interest']);
  });

  it('returns to travellers before journey details in a package enquiry', () => {
    const sequence = getEnquirySequence('package', false);
    expect(getPreviousEnquiryStep('contact', sequence)).toBe('travellers');
    expect(getPreviousEnquiryStep('travellers', sequence)).toBe('interest');
  });
});
