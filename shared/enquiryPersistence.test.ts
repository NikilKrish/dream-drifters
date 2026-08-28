import { describe, expect, it, vi } from 'vitest';
import { normalizeBrief } from './brief';
import { createSubmissionId, persistEnquiry } from './enquiryPersistence';

const validBrief = normalizeBrief({
  interestKind: 'package',
  packageId: 'maldives',
  travelWindow: 'December 2026',
  durationDays: 6,
  adults: 2,
  children: 1,
  budgetBand: '200k-400k',
  name: 'Aarav Menon',
  mobile: '+91 98765 43210',
  email: 'aarav@example.com',
  notes: 'We would like help with flights, a family-friendly resort, and visa guidance if needed.',
  consent: true,
  startedAt: 1760000000000,
});

const config = {
  url: 'https://script.google.com/macros/s/test/exec',
  secret: 'server-secret',
};

describe('createSubmissionId', () => {
  it('creates an enquiry-prefixed identifier from the provided timestamp', () => {
    expect(createSubmissionId(1735689600000)).toMatch(/^enq_20250101_1735689600000_[a-z0-9]+$/);
  });

  it('adds entropy when two submissions share the same millisecond', () => {
    const first = createSubmissionId(1735689600000);
    const second = createSubmissionId(1735689600000);

    expect(second).not.toBe(first);
  });
});

describe('persistEnquiry', () => {
  it('posts the normalized brief with a server-only secret and returns stored state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      stored: true,
      notified: true,
      submissionId: 'provider-echoed-id',
      sheetUrl: 'https://docs.google.com/spreadsheets/d/restricted',
    }), { status: 200 }));

    const result = await persistEnquiry(validBrief, config, fetchMock, () => 1735689600000);

    expect(result).toEqual({
      stored: true,
      notified: true,
      submissionId: expect.stringMatching(/^enq_20250101_1735689600000_[a-z0-9]+$/),
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://script.google.com/macros/s/test/exec',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(JSON.stringify(fetchMock.mock.calls[0][1])).toContain('server-secret');
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      authToken: 'server-secret',
      submissionId: expect.stringMatching(/^enq_20250101_1735689600000_[a-z0-9]+$/),
      submittedAt: '2025-01-01T00:00:00.000Z',
      brief: validBrief,
    });
  });

  it('returns stored=true and notified=false when the Sheet saved but email is pending', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      stored: true,
      notified: false,
      submissionId: 'enq_20260825_0001',
    }), { status: 200 }));

    await expect(persistEnquiry(validBrief, config, fetchMock, () => 1735689600000)).resolves.toMatchObject({
      stored: true,
      notified: false,
      submissionId: expect.stringMatching(/^enq_20250101_1735689600000_[a-z0-9]+$/),
    });
  });

  it('does not retry the same request automatically after a timeout', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new DOMException('timeout', 'AbortError'));

    await expect(persistEnquiry(validBrief, config, fetchMock)).resolves.toMatchObject({
      stored: false,
      notified: false,
      errorCode: 'timeout',
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('returns invalid-response when the provider response shape is malformed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: true,
      stored: 'yes',
      notified: true,
    }), { status: 200 }));

    await expect(persistEnquiry(validBrief, config, fetchMock)).resolves.toEqual({
      stored: false,
      notified: false,
      submissionId: expect.any(String),
      errorCode: 'invalid-response',
    });
  });

  it('returns invalid-response when the provider returns invalid JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('not json', { status: 200 }));

    await expect(persistEnquiry(validBrief, config, fetchMock)).resolves.toEqual({
      stored: false,
      notified: false,
      submissionId: expect.any(String),
      errorCode: 'invalid-response',
    });
  });

  it('returns provider-error when the provider responds with a non-2xx status', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      ok: false,
      error: 'forbidden',
    }), { status: 403 }));

    await expect(persistEnquiry(validBrief, config, fetchMock)).resolves.toEqual({
      stored: false,
      notified: false,
      submissionId: expect.any(String),
      errorCode: 'provider-error',
    });
  });
});
