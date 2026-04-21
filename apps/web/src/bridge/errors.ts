export class BridgeTimeoutError extends Error {
  constructor(public readonly method: string, timeoutMs: number) {
    super(`Bridge method ${method} timed out after ${timeoutMs}ms`);
    this.name = 'BridgeTimeoutError';
  }
}

export class BridgeUnsupportedError extends Error {
  constructor(public readonly method: string) {
    super(`Bridge method ${method} is not supported`);
    this.name = 'BridgeUnsupportedError';
  }
}
