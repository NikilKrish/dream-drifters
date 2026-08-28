import type { EnquiryBrief } from '../shared/brief';
import { normalizeBrief, validateBrief } from '../shared/brief';
import { persistEnquiry } from '../shared/enquiryPersistence';

interface WorkerEnv {
  GOOGLE_APPS_SCRIPT_URL?: string;
  GOOGLE_APPS_SCRIPT_SECRET?: string;
}

const MAX_BODY_BYTES = 20_000;
const MIN_SUBMISSION_TIME_MS = 1_500;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1_000;
const responseHeaders = { 'Cache-Control': 'no-store' };

function json(
  body: { ok: boolean; stored?: boolean; notified?: boolean; fallback?: 'whatsapp'; error?: string },
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, { status, headers: { ...responseHeaders, ...headers } });
}

async function readBody(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) throw new RangeError('body-too-large');
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BODY_BYTES) throw new RangeError('body-too-large');
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function handleEnquiry(request: Request, env: WorkerEnv) {
  if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });

  let input: unknown;
  try {
    input = await readBody(request);
  } catch (error) {
    return error instanceof RangeError
      ? json({ ok: false, error: 'Request is too large.' }, 413)
      : json({ ok: false, error: 'Invalid request.' }, 400);
  }

  if (!input || typeof input !== 'object') return json({ ok: false, error: 'Invalid request.' }, 400);
  const brief = normalizeBrief(input as Partial<EnquiryBrief>);
  if (Object.keys(validateBrief(brief)).length > 0) return json({ ok: false, error: 'Please check the trip details.' }, 400);

  const elapsed = Date.now() - brief.startedAt;
  if (brief.website || elapsed < MIN_SUBMISSION_TIME_MS || elapsed > MAX_SUBMISSION_AGE_MS) return json({ ok: true });

  const url = env.GOOGLE_APPS_SCRIPT_URL;
  const secret = env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret) return json({ ok: false, error: 'The enquiry service is not configured.' }, 503);

  const result = await persistEnquiry(brief, { url, secret });
  if (!result.stored) {
    return json({ ok: false, error: 'The enquiry could not be saved.' }, 502);
  }

  return json({ ok: true, stored: true, notified: result.notified });
}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.pathname === '/api/enquiry') return handleEnquiry(request, env);
    return new Response('Not found', { status: 404 });
  },
};
