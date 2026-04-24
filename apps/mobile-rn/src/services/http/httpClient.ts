import type { Logger } from '../../telemetry/logger';
import type { TokenStore } from '../../auth/tokenStore';
import { createTraceId } from './trace';
import { HttpTimeoutError } from './errors';
import type { HttpRequestConfig, HttpResult } from './types';

interface CreateHttpClientOptions {
  logger: Logger;
  tokenStore: TokenStore;
  baseUrl?: string;
}

export interface HttpClient {
  request<T>(config: HttpRequestConfig): Promise<HttpResult<T>>;
}

const DEFAULT_TIMEOUT = 10000;

export function createHttpClient(options: CreateHttpClientOptions): HttpClient {
  const baseUrl = options.baseUrl ?? 'https://api.example.com';

  return {
    async request<T>(config: HttpRequestConfig): Promise<HttpResult<T>> {
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

      try {
        const response = await withTimeout(
          fetch(buildUrl(`${baseUrl}${config.url}`, config.query), {
            method: config.method,
            headers,
            body: config.body ? JSON.stringify(config.body) : undefined,
          }),
          timeoutMs,
        );

        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            code: `HTTP_${response.status}`,
            message: await response.text(),
            traceId,
          };
        }

        return {
          ok: true,
          status: response.status,
          data: (await response.json()) as T,
          traceId,
        };
      } catch (error) {
        options.logger.error('RN http request failed', { error, traceId });
        return {
          ok: false,
          status: 0,
          code: error instanceof HttpTimeoutError ? 'HTTP_TIMEOUT' : 'HTTP_NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          traceId,
        };
      }
    },
  };
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

function buildUrl(url: string, query?: Record<string, string | number | boolean | undefined>): string {
  if (!query) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined) params.append(k, String(v));
  });
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}
