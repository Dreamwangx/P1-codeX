export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export type HttpResult<T> =
  | { ok: true; status: number; data: T; traceId: string }
  | { ok: false; status: number; code: string; message: string; traceId: string };
