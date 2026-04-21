export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const KEY = 'enterprise_mobile_tokens';

export interface AuthTokenStore {
  get(): AuthTokens | null;
  set(tokens: AuthTokens): void;
  clear(): void;
}

export function createAuthStore(): AuthTokenStore {
  return {
    get() {
      const raw = globalThis.localStorage?.getItem(KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthTokens;
      } catch {
        return null;
      }
    },
    set(tokens) {
      globalThis.localStorage?.setItem(KEY, JSON.stringify(tokens));
    },
    clear() {
      globalThis.localStorage?.removeItem(KEY);
    },
  };
}
