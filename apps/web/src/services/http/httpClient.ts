import { HttpTimeoutError } from './errors';
import { createTraceId } from './trace';
import type { HttpRequestConfig, HttpResult } from './types';
import type { AuthTokenStore } from '../../auth/tokenStore';
import type { Logger } from '../../telemetry/logger';

interface CreateHttpClientOptions {
  baseUrl?: string;
  tokenStore: AuthTokenStore;
  logger: Logger;
}

export interface HttpClient {
  request<T>(config: HttpRequestConfig): Promise<HttpResult<T>>;
}

const DEFAULT_TIMEOUT = 10000;

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const baseUrl = options.baseUrl ?? 'https://api.example.com';

  async function request<T>(config: HttpRequestConfig): Promise<HttpResult<T>> {
    const traceId = createTraceId();
    const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT;
    const tokens = options.tokenStore.get();

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'x-trace-id': traceId,
      ...config.headers,
    };

    if (!config.skipAuth && tokens?.accessToken) {
      headers.authorization = `Bearer ${tokens.accessToken}`;
    }

    const url = buildUrl(`${baseUrl}${config.url}`, config.query);

    try {
      const response = await withTimeout(
        fetch(url, {
          method: config.method,
          headers,
          body: config.body ? JSON.stringify(config.body) : undefined,
        }),
        timeoutMs,
      );

      if (!response.ok) {
        const message = await response.text();
        return {
          ok: false,
          status: response.status,
          code: `HTTP_${response.status}`,
          message: message || response.statusText,
          traceId,
        };
      }

      const data = (await response.json()) as T;
      return { ok: true, status: response.status, data, traceId };
    } catch (error) {
      options.logger.error('HTTP request failed', { url, error, traceId });
      const message = error instanceof Error ? error.message : 'Unknown request error';
      const code = error instanceof HttpTimeoutError ? 'HTTP_TIMEOUT' : 'HTTP_NETWORK_ERROR';
      return { ok: false, status: 0, code, message, traceId };
    }
  }

  return { request };
}

function buildUrl(url: string, query?: Record<string, string | number | boolean | undefined>): string {
  if (!query) return url;
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const q = searchParams.toString();
  return q ? `${url}?${q}` : url;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new HttpTimeoutError(timeoutMs)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
