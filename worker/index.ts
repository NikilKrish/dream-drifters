import type { EnquiryBrief } from '../shared/brief';
import { formatBrief, normalizeBrief, validateBrief } from '../shared/brief';

interface WorkerEnv {
  META_ACCESS_TOKEN?: string;
  META_PHONE_NUMBER_ID?: string;
  BUSINESS_OWNER_PHONE_NUMBER?: string;
  META_MESSAGE_TEMPLATE?: string;
  META_TEMPLATE_LANGUAGE?: string;
  META_GRAPH_API_VERSION?: string;
}

const MAX_BODY_BYTES = 20_000;
const MIN_SUBMISSION_TIME_MS = 1_500;
const MAX_SUBMISSION_AGE_MS = 24 * 60 * 60 * 1_000;
const responseHeaders = { 'Cache-Control': 'no-store' };

function json(body: { ok: boolean; fallback?: 'whatsapp'; error?: string }, status = 200, headers: Record<string, string> = {}) {
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

  const token = env.META_ACCESS_TOKEN;
  const phoneNumberId = env.META_PHONE_NUMBER_ID;
  const ownerNumber = env.BUSINESS_OWNER_PHONE_NUMBER;
  const template = env.META_MESSAGE_TEMPLATE;
  const language = env.META_TEMPLATE_LANGUAGE;
  const graphVersion = env.META_GRAPH_API_VERSION;
  if (!token || !phoneNumberId || !ownerNumber || !template || !language || !graphVersion) return json({ ok: false, fallback: 'whatsapp' }, 503);

  try {
    const providerResponse = await fetch(`https://graph.facebook.com/${encodeURIComponent(graphVersion)}/${encodeURIComponent(phoneNumberId)}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: ownerNumber,
        type: 'template',
        template: {
          name: template,
          language: { code: language },
          components: [{ type: 'body', parameters: [{ type: 'text', text: formatBrief(brief).slice(0, 1024) }] }],
        },
      }),
    });
    return providerResponse.ok ? json({ ok: true }) : json({ ok: false, fallback: 'whatsapp' }, 502);
  } catch {
    return json({ ok: false, fallback: 'whatsapp' }, 502);
  }
}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> | Response {
    const url = new URL(request.url);
    if (url.pathname === '/api/enquiry') return handleEnquiry(request, env);
    return new Response('Not found', { status: 404 });
  },
};
