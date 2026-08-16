import { describe, expect, it } from 'vitest';
import { formatBrief, normalizeBrief, validateBrief } from './brief';

const validPackage = normalizeBrief({
  interestKind: 'package',
  packageId: 'maldives',
  travelWindow: 'December 2026',
  durationDays: 5,
  adults: 2,
  children: 1,
  budgetBand: '200k-400k',
  name: 'Asha Kumar',
  mobile: '+91 98765 43210',
  email: 'asha@example.com',
  notes: 'A quiet water villa',
  consent: true,
  website: '',
  startedAt: Date.now() - 5_000,
});

describe('enquiry brief', () => {
  it('normalizes unsafe input and enforces package/service exclusivity', () => {
    const brief = normalizeBrief({
      interestKind: 'service',
      packageId: 'maldives',
      serviceId: 'visa',
      adults: 100,
      children: -3,
      durationDays: 500,
      name: '  Asha   Kumar  ',
    });
    expect(brief.packageId).toBeUndefined();
    expect(brief.serviceId).toBe('visa');
    expect(brief.adults).toBe(20);
    expect(brief.children).toBe(0);
    expect(brief.durationDays).toBe(60);
    expect(brief.name).toBe('Asha Kumar');
  });

  it('conditionally validates package details but not custom travel details', () => {
    expect(validateBrief(validPackage)).toEqual({});
    const incompletePackage = normalizeBrief({ interestKind: 'package', name: 'Asha Kumar', mobile: '+91 98765 43210', email: 'asha@example.com', consent: true });
    expect(validateBrief(incompletePackage)).toMatchObject({ packageId: expect.any(String), travelWindow: expect.any(String), adults: expect.any(String), budgetBand: expect.any(String) });
    const custom = normalizeBrief({ interestKind: 'custom', name: 'Asha Kumar', mobile: '+91 98765 43210', email: 'asha@example.com', consent: true });
    expect(validateBrief(custom)).toEqual({});
  });

  it('requires complete core contact fields for every interest', () => {
    const invalid = normalizeBrief({ interestKind: 'service', serviceId: 'flights', name: '', mobile: '12', email: 'bad', consent: false });
    expect(validateBrief(invalid)).toMatchObject({ name: expect.any(String), mobile: expect.any(String), email: expect.any(String), consent: expect.any(String) });
  });

  it('formats package and service WhatsApp summaries', () => {
    expect(formatBrief(validPackage)).toContain('Maldives Paradise');
    expect(formatBrief(validPackage)).toContain('December 2026');
    const service = normalizeBrief({ interestKind: 'service', serviceId: 'visa', name: 'Asha Kumar', mobile: '+91 98765 43210', email: 'asha@example.com', consent: true });
    expect(formatBrief(service)).toContain('Visas');
  });

  it('normalizes renamed services while preserving legacy insurance requests', () => {
    expect(normalizeBrief({ interestKind: 'service', serviceId: 'hotels' }).serviceId).toBe('accommodation');
    expect(normalizeBrief({ interestKind: 'service', serviceId: 'events' }).serviceId).toBe('mice');
    const legacy = normalizeBrief({ interestKind: 'service', serviceId: 'insurance', name: 'Asha Kumar', mobile: '+91 98765 43210', email: 'asha@example.com', consent: true });
    expect(legacy.serviceId).toBe('insurance');
    expect(formatBrief(legacy)).toContain('Travel Insurance (legacy request)');
  });
});
