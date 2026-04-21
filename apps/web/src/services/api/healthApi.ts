import type { HttpClient } from '../http/httpClient';

interface HealthResponse {
  status: 'ok';
  serverTime: string;
}

export async function fetchHealth(http: HttpClient) {
  return http.request<HealthResponse>({ method: 'GET', url: '/health' });
}
