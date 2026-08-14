import type { EnquiryBrief } from '../shared/brief';
import { formatBrief, normalizeBrief, validateBrief } from '../shared/brief';

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: { ok: boolean; fallback?: 'whatsapp'; error?: string }): void;
}

const MAX_BODY_BYTES = 20_000;
const MIN_SUBMISSION_TIME_MS = 1_500;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1_000;

function fallback(res: ApiResponse, status = 502) {
  return res.status(status).json({ ok: false, fallback: 'whatsapp' });
}

function bodyByteLength(body: unknown) {
  try {
    return new TextEncoder().encode(JSON.stringify(body)).length;
  } catch {
    return MAX_BODY_BYTES + 1;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  if (bodyByteLength(req.body) > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, error: 'Request is too large.' });
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request.' });
  }

  const brief = normalizeBrief(req.body as Partial<EnquiryBrief>);
  const errors = validateBrief(brief);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, error: 'Please check the trip details.' });
  }

  const elapsed = Date.now() - brief.startedAt;
  if (brief.website || elapsed < MIN_SUBMISSION_TIME_MS || elapsed > MAX_SUBMISSION_AGE_MS) {
    return res.status(200).json({ ok: true });
  }

  const token = process.env.META_ACCESS_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const ownerNumber = process.env.BUSINESS_OWNER_PHONE_NUMBER;
  const template = process.env.META_MESSAGE_TEMPLATE;
  const language = process.env.META_TEMPLATE_LANGUAGE;
  const graphVersion = process.env.META_GRAPH_API_VERSION;

  if (!token || !phoneNumberId || !ownerNumber || !template || !language || !graphVersion) {
    return fallback(res, 503);
  }

  try {
    const providerResponse = await fetch(
      `https://graph.facebook.com/${encodeURIComponent(graphVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: ownerNumber,
          type: 'template',
          template: {
            name: template,
            language: { code: language },
            components: [{
              type: 'body',
              parameters: [{ type: 'text', text: formatBrief(brief).slice(0, 1024) }],
            }],
          },
        }),
      },
    );

    if (!providerResponse.ok) return fallback(res);
    return res.status(200).json({ ok: true });
  } catch {
    return fallback(res);
  }
}
