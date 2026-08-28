import { afterEach, describe, expect, it, vi } from 'vitest';
import { persistEnquiry } from '../shared/enquiryPersistence';
import worker from './index';

vi.mock('../shared/enquiryPersistence', () => ({
  createSubmissionId: vi.fn(),
  persistEnquiry: vi.fn(),
}));

const persistEnquiryMock = vi.mocked(persistEnquiry);

const packageBrief = {
  interestKind: 'package' as const,
  packageId: 'maldives',
  travelWindow: 'December 2026',
  durationDays: 5,
  adults: 2,
  children: 0,
  budgetBand: '200k-400k' as const,
  name: 'Asha Kumar',
  mobile: '+91 98765 43210',
  email: 'asha@example.com',
  consent: true,
  website: '',
  startedAt: Date.now() - 5_000,
};

function request(body: unknown, init: RequestInit = {}) {
  return new Request('https://example.com/api/enquiry', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...init,
  });
}

describe('worker enquiry endpoint', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('enforces POST requests', async () => {
    const response = await worker.fetch(new Request('https://example.com/api/enquiry'), {});

    expect(response.status).toBe(405);
    expect(await response.json()).toEqual({ ok: false, error: 'Method not allowed.' });
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('rejects invalid JSON bodies', async () => {
    const response = await worker.fetch(request('{', { body: '{' }), {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'Invalid request.' });
  });

  it('rejects validation failures before storage', async () => {
    const response = await worker.fetch(request({ ...packageBrief, travelWindow: '', budgetBand: undefined }), {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'Please check the trip details.' });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('rejects oversized requests before storage', async () => {
    const response = await worker.fetch(
      request({ ...packageBrief, notes: 'x'.repeat(20_100) }),
      {
        GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake-script/exec',
        GOOGLE_APPS_SCRIPT_SECRET: 'server-secret',
      },
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ ok: false, error: 'Request is too large.' });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('short-circuits bot submissions without storing them', async () => {
    const response = await worker.fetch(request({ ...packageBrief, website: 'spam-link' }), {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('short-circuits too-fast submissions without storing them', async () => {
    const response = await worker.fetch(request({ ...packageBrief, startedAt: Date.now() - 1_000 }), {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('short-circuits too-old submissions without storing them', async () => {
    const response = await worker.fetch(
      request({ ...packageBrief, startedAt: Date.now() - (24 * 60 * 60 * 1_000 + 1) }),
      {},
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('returns durable success when Google stores the row and sends email', async () => {
    persistEnquiryMock.mockResolvedValue({
      stored: true,
      notified: true,
      submissionId: 'enq_20260828_5',
    });

    const response = await worker.fetch(request(packageBrief), {
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake-script/exec',
      GOOGLE_APPS_SCRIPT_SECRET: 'server-secret',
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, stored: true, notified: true });
    expect(persistEnquiryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        interestKind: 'package',
        packageId: 'maldives',
        email: 'asha@example.com',
      }),
      {
        url: 'https://script.google.com/macros/s/fake-script/exec',
        secret: 'server-secret',
      },
    );
  });

  it('returns durable success with pending notification when the row is saved', async () => {
    persistEnquiryMock.mockResolvedValue({
      stored: true,
      notified: false,
      submissionId: 'enq_20260828_6',
    });

    const response = await worker.fetch(request(packageBrief), {
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake-script/exec',
      GOOGLE_APPS_SCRIPT_SECRET: 'server-secret',
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, stored: true, notified: false });
  });

  it('returns a configuration error when durable storage is unavailable', async () => {
    const response = await worker.fetch(request(packageBrief), {});

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: 'The enquiry service is not configured.' });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('does not claim success when Google storage fails', async () => {
    persistEnquiryMock.mockResolvedValue({
      stored: false,
      notified: false,
      submissionId: 'enq_20260828_7',
      errorCode: 'provider-error',
    });

    const response = await worker.fetch(request(packageBrief), {
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake-script/exec',
      GOOGLE_APPS_SCRIPT_SECRET: 'server-secret',
    });

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: 'The enquiry could not be saved.' });
  });

  it('does not leak the Sheet URL or automation secret', async () => {
    persistEnquiryMock.mockResolvedValue({
      stored: false,
      notified: false,
      submissionId: 'enq_20260828_8',
      errorCode: 'provider-error',
    });

    const response = await worker.fetch(request(packageBrief), {
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/fake-script/exec',
      GOOGLE_APPS_SCRIPT_SECRET: 'server-secret',
    });
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('script.google.com');
    expect(JSON.stringify(body)).not.toContain('server-secret');
  });
});
