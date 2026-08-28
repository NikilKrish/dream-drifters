import type { EnquiryBrief } from '../shared/brief.js';
import { normalizeBrief, validateBrief } from '../shared/brief.js';
import { persistEnquiry } from '../shared/enquiryPersistence.js';

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: { ok: boolean; stored?: boolean; notified?: boolean; fallback?: 'whatsapp'; error?: string }): void;
}

const MAX_BODY_BYTES = 20_000;
const MIN_SUBMISSION_TIME_MS = 1_500;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1_000;

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

  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    return res.status(503).json({ ok: false, error: 'The enquiry service is not configured.' });
  }

  const result = await persistEnquiry(brief, { url, secret });
  if (!result.stored) {
    return res.status(502).json({ ok: false, error: 'The enquiry could not be saved.' });
  }

  return res.status(200).json({ ok: true, stored: true, notified: result.notified });
}
