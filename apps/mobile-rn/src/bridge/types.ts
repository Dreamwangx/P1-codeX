export type BridgeMethod =
  | 'scan.start'
  | 'scan.stop'
  | 'push.register'
  | 'push.getToken'
  | 'ble.permission.request'
  | 'ble.scan'
  | 'ble.connect'
  | 'ble.disconnect';

export interface BridgeInvokeOptions {
  timeoutMs?: number;
  traceId?: string;
}

export interface BridgeError {
  code: `BRIDGE_${string}` | `NATIVE_${string}` | `BIZ_${string}`;
  message: string;
  traceId?: string;
}

export type BridgeResult<T> =
  | { success: true; data: T; traceId?: string }
  | { success: false; error: BridgeError; traceId?: string };

export interface BridgeClient {
  readonly version: string;
  invoke<TParams, TResult>(method: BridgeMethod, params: TParams, options?: BridgeInvokeOptions): Promise<BridgeResult<TResult>>;
  isSupported(method: BridgeMethod): boolean;
}
