import type { EnquiryBrief } from './brief';

export interface EnquiryPersistenceResult {
  stored: boolean;
  notified: boolean;
  submissionId: string;
  errorCode?: 'not-configured' | 'timeout' | 'provider-error' | 'invalid-response';
}

export interface EnquiryPersistenceConfig {
  url: string;
  secret: string;
  timeoutMs?: number;
}

interface ProviderSuccessResponse {
  ok: true;
  stored: boolean;
  notified: boolean;
  submissionId: string;
}

const DEFAULT_TIMEOUT_MS = 8_000;

export function createSubmissionId(now: number = Date.now()): string {
  const date = new Date(now);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `enq_${year}${month}${day}_${now}`;
}

export async function persistEnquiry(
  brief: EnquiryBrief,
  config: EnquiryPersistenceConfig,
  fetchImpl: typeof fetch = fetch,
  now: () => number = Date.now,
): Promise<EnquiryPersistenceResult> {
  const submissionId = createSubmissionId(now());

  if (!config.url || !config.secret) {
    return {
      stored: false,
      notified: false,
      submissionId,
      errorCode: 'not-configured',
    };
  }

  const abortController = new AbortController();
  const timeoutHandle = setTimeout(() => abortController.abort(), config.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetchImpl(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authToken: config.secret,
        submissionId,
        submittedAt: new Date(now()).toISOString(),
        brief,
      }),
      signal: abortController.signal,
    });

    if (!response.ok) {
      return {
        stored: false,
        notified: false,
        submissionId,
        errorCode: 'provider-error',
      };
    }

    const payload = await parseProviderResponse(response);
    if (!isProviderSuccessResponse(payload)) {
      return {
        stored: false,
        notified: false,
        submissionId,
        errorCode: 'invalid-response',
      };
    }

    return {
      stored: payload.stored,
      notified: payload.notified,
      submissionId,
    };
  } catch (error) {
    return {
      stored: false,
      notified: false,
      submissionId,
      errorCode:
        error instanceof InvalidProviderResponseError
          ? 'invalid-response'
          : error instanceof DOMException && error.name === 'AbortError'
            ? 'timeout'
            : 'provider-error',
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
}

async function parseProviderResponse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new InvalidProviderResponseError();
  }
}

function isProviderSuccessResponse(value: unknown): value is ProviderSuccessResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ProviderSuccessResponse>;
  return (
    candidate.ok === true &&
    typeof candidate.stored === 'boolean' &&
    typeof candidate.notified === 'boolean' &&
    typeof candidate.submissionId === 'string'
  );
}

class InvalidProviderResponseError extends Error {}
