import { afterEach, describe, expect, it, vi } from 'vitest';
import { persistEnquiry } from '../shared/enquiryPersistence.js';
import handler from './enquiry.js';

vi.mock('../shared/enquiryPersistence.js', () => ({
  createSubmissionId: vi.fn(),
  persistEnquiry: vi.fn(),
}));

function responseDouble() {
  const state = {
    status: 200,
    body: {} as Record<string, unknown>,
    headers: {} as Record<string, string>,
  };
  const response = {
    setHeader(name: string, value: string) {
      state.headers[name] = value;
    },
    status(code: number) {
      state.status = code;
      return response;
    },
    json(body: Record<string, unknown>) {
      state.body = body;
    },
  };
  return { response, state };
}

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

describe('POST /api/enquiry', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('returns durable success when Google stores the row and sends email', async () => {
    vi.stubEnv('GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/fake-script/exec');
    vi.stubEnv('GOOGLE_APPS_SCRIPT_SECRET', 'server-secret');
    persistEnquiryMock.mockResolvedValue({
      stored: true,
      notified: true,
      submissionId: 'enq_20260828_1',
    });
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(state.status).toBe(200);
    expect(state.body).toEqual({ ok: true, stored: true, notified: true });
    expect(persistEnquiryMock).toHaveBeenCalledOnce();
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
    vi.stubEnv('GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/fake-script/exec');
    vi.stubEnv('GOOGLE_APPS_SCRIPT_SECRET', 'server-secret');
    persistEnquiryMock.mockResolvedValue({
      stored: true,
      notified: false,
      submissionId: 'enq_20260828_2',
    });
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(state.status).toBe(200);
    expect(state.body).toEqual({ ok: true, stored: true, notified: false });
  });

  it('does not claim success when Google storage fails', async () => {
    vi.stubEnv('GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/fake-script/exec');
    vi.stubEnv('GOOGLE_APPS_SCRIPT_SECRET', 'server-secret');
    persistEnquiryMock.mockResolvedValue({
      stored: false,
      notified: false,
      submissionId: 'enq_20260828_3',
      errorCode: 'provider-error',
    });
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(state.status).toBe(502);
    expect(state.body).toEqual({ ok: false, error: 'The enquiry could not be saved.' });
  });

  it('does not leak the Sheet URL or automation secret', async () => {
    vi.stubEnv('GOOGLE_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/fake-script/exec');
    vi.stubEnv('GOOGLE_APPS_SCRIPT_SECRET', 'server-secret');
    persistEnquiryMock.mockResolvedValue({
      stored: false,
      notified: false,
      submissionId: 'enq_20260828_4',
      errorCode: 'provider-error',
    });
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(JSON.stringify(state.body)).not.toContain('script.google.com');
    expect(JSON.stringify(state.body)).not.toContain('server-secret');
  });

  it('returns a configuration error when durable storage is unavailable', async () => {
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(state.status).toBe(503);
    expect(state.body).toEqual({ ok: false, error: 'The enquiry service is not configured.' });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });

  it('accepts a service enquiry without package travel fields', async () => {
    const { response, state } = responseDouble();

    await handler(
      {
        method: 'POST',
        headers: {},
        body: {
          interestKind: 'service',
          serviceId: 'visa',
          name: 'Asha Kumar',
          mobile: '+91 98765 43210',
          email: 'asha@example.com',
          consent: true,
          startedAt: Date.now() - 5_000,
        },
      },
      response,
    );

    expect(state.status).toBe(503);
    expect(state.body).toEqual({ ok: false, error: 'The enquiry service is not configured.' });
  });

  it('rejects incomplete package enquiries', async () => {
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: { ...packageBrief, travelWindow: '', budgetBand: undefined } }, response);

    expect(state.status).toBe(400);
    expect(state.body).toEqual({ ok: false, error: 'Please check the trip details.' });
  });

  it('enforces the method without exposing provider details', async () => {
    const { response, state } = responseDouble();

    await handler({ method: 'GET', headers: {} }, response);

    expect(state.status).toBe(405);
    expect(state.body).toEqual({ ok: false, error: 'Method not allowed.' });
  });

  it('short-circuits bot submissions without touching storage', async () => {
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: { ...packageBrief, website: 'spam-link' } }, response);

    expect(state.status).toBe(200);
    expect(state.body).toEqual({ ok: true });
    expect(persistEnquiryMock).not.toHaveBeenCalled();
  });
});
