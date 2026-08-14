import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './enquiry';

function responseDouble() {
  const state = { status: 200, body: {} as Record<string, unknown>, headers: {} as Record<string, string> };
  const response = {
    setHeader(name: string, value: string) { state.headers[name] = value; },
    status(code: number) { state.status = code; return response; },
    json(body: Record<string, unknown>) { state.body = body; },
  };
  return { response, state };
}

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
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

  it('sends only an approved template payload and returns provider-safe success', async () => {
    vi.stubEnv('META_ACCESS_TOKEN', 'secret-token');
    vi.stubEnv('META_PHONE_NUMBER_ID', 'phone-id');
    vi.stubEnv('BUSINESS_OWNER_PHONE_NUMBER', '919999999999');
    vi.stubEnv('META_MESSAGE_TEMPLATE', 'new_enquiry');
    vi.stubEnv('META_TEMPLATE_LANGUAGE', 'en_US');
    vi.stubEnv('META_GRAPH_API_VERSION', 'v23.0');
    const provider = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', provider);
    const { response, state } = responseDouble();

    await handler({ method: 'POST', headers: {}, body: packageBrief }, response);

    expect(state.status).toBe(200);
    expect(state.body).toEqual({ ok: true });
    expect(provider).toHaveBeenCalledOnce();
    expect(provider.mock.calls[0][0]).toContain('/phone-id/messages');
    const payload = JSON.parse(provider.mock.calls[0][1].body);
    expect(payload).toMatchObject({ type: 'template', template: { name: 'new_enquiry' } });
    expect(JSON.stringify(payload)).not.toContain('secret-token');
  });

  it('accepts a service enquiry without package travel fields', async () => {
    const { response, state } = responseDouble();
    await handler({ method: 'POST', headers: {}, body: { interestKind: 'service', serviceId: 'visa', name: 'Asha Kumar', mobile: '+91 98765 43210', email: 'asha@example.com', consent: true, startedAt: Date.now() - 5_000 } }, response);
    expect(state.status).toBe(503);
    expect(state.body).toEqual({ ok: false, fallback: 'whatsapp' });
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
});
