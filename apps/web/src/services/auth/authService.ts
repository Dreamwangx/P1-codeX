import type { AuthTokens, AuthTokenStore } from '../../auth/tokenStore';
import type { Logger } from '../../telemetry/logger';
import type { HttpClient } from '../http/httpClient';

interface AuthServiceDeps {
  http: HttpClient;
  tokenStore: AuthTokenStore;
  logger: Logger;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthService {
  restoreSession(): Promise<void>;
  getAccessToken(): Promise<string | null>;
  refreshAccessToken(): Promise<string | null>;
  logout(): void;
}

export function createAuthService(deps: AuthServiceDeps): AuthService {
  let inflightRefresh: Promise<string | null> | null = null;

  async function restoreSession(): Promise<void> {
    const tokens = deps.tokenStore.get();
    if (!tokens) return;
    if (isExpired(tokens.expiresAt)) {
      await refreshAccessToken();
    }
  }

  async function getAccessToken(): Promise<string | null> {
    const tokens = deps.tokenStore.get();
    if (!tokens) return null;
    if (isExpired(tokens.expiresAt)) {
      return refreshAccessToken();
    }
    return tokens.accessToken;
  }

  async function refreshAccessToken(): Promise<string | null> {
    if (inflightRefresh) return inflightRefresh;

    inflightRefresh = (async () => {
      const current = deps.tokenStore.get();
      if (!current?.refreshToken) {
        deps.tokenStore.clear();
        return null;
      }

      const response = await deps.http.request<RefreshResponse>({
        method: 'POST',
        url: '/auth/refresh',
        skipAuth: true,
        body: { refreshToken: current.refreshToken },
      });

      if (!response.ok) {
        deps.logger.warn('Refresh token failed', { code: response.code, traceId: response.traceId });
        deps.tokenStore.clear();
        return null;
      }

      const nextTokens: AuthTokens = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresAt: Date.now() + response.data.expiresIn * 1000,
      };
      deps.tokenStore.set(nextTokens);
      return nextTokens.accessToken;
    })();

    try {
      return await inflightRefresh;
    } finally {
      inflightRefresh = null;
    }
  }

  function logout(): void {
    deps.tokenStore.clear();
  }

  return { restoreSession, getAccessToken, refreshAccessToken, logout };
}

function isExpired(expiresAt: number): boolean {
  const safetyWindowMs = 30 * 1000;
  return Date.now() + safetyWindowMs >= expiresAt;
}
