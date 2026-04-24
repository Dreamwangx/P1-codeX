export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TokenStore {
  get(): AuthTokens | null;
  set(tokens: AuthTokens): void;
  clear(): void;
}

let inMemoryTokens: AuthTokens | null = null;

export function createTokenStore(): TokenStore {
  // TODO: replace with AsyncStorage/Keychain-backed store when native dependencies are installed.
  return {
    get() {
      return inMemoryTokens;
    },
    set(tokens: AuthTokens) {
      inMemoryTokens = tokens;
    },
    clear() {
      inMemoryTokens = null;
    },
  };
}
