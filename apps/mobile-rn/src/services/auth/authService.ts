import type { Logger } from '../../telemetry/logger';
import type { TokenStore, AuthTokens } from '../../auth/tokenStore';
import type { HttpClient } from '../http/httpClient';

interface AuthServiceDeps {
  logger: Logger;
  tokenStore: TokenStore;
  http: HttpClient;
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

  return {
    async restoreSession(): Promise<void> {
      const tokens = deps.tokenStore.get();
      if (!tokens) return;
      if (isExpired(tokens.expiresAt)) await this.refreshAccessToken();
    },
    async getAccessToken(): Promise<string | null> {
      const tokens = deps.tokenStore.get();
      if (!tokens) return null;
      if (isExpired(tokens.expiresAt)) return this.refreshAccessToken();
      return tokens.accessToken;
    },
    async refreshAccessToken(): Promise<string | null> {
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
          body: { refreshToken: current.refreshToken },
          skipAuth: true,
        });

        if (!response.ok) {
          deps.logger.warn('RN auth refresh failed', { code: response.code });
          deps.tokenStore.clear();
          return null;
        }

        const tokens: AuthTokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresAt: Date.now() + response.data.expiresIn * 1000,
        };

        deps.tokenStore.set(tokens);
        return tokens.accessToken;
      })();

      try {
        return await inflightRefresh;
      } finally {
        inflightRefresh = null;
      }
    },
    logout(): void {
      deps.tokenStore.clear();
    },
  };
}

function isExpired(expiresAt: number): boolean {
  const safetyWindow = 30 * 1000;
  return Date.now() + safetyWindow >= expiresAt;
}
