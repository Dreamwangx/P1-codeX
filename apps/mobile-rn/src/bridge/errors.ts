export class BridgeTimeoutError extends Error {
  constructor(method: string, timeoutMs: number) {
    super(`Bridge method ${method} timed out after ${timeoutMs}ms`);
  }
}

export class BridgeUnsupportedError extends Error {
  constructor(method: string) {
    super(`Bridge method ${method} is not supported`);
  }
}
