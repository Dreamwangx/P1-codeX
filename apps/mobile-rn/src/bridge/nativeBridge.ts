import type { BridgeMethod } from './types';

export interface NativeBridge {
  call<TParams, TResult>(method: BridgeMethod, params: TParams): Promise<TResult>;
}

export function createNativeBridge(): NativeBridge {
  // Placeholder adapter for RN NativeModule/TurboModule integration.
  return {
    async call<TParams, TResult>(method: BridgeMethod, params: TParams): Promise<TResult> {
      switch (method) {
        case 'scan.start':
          return { content: 'RN_MOCK_SCAN', raw: params } as TResult;
        case 'push.register':
          return { ok: true } as TResult;
        case 'push.getToken':
          return { token: 'rn-mock-token' } as TResult;
        case 'ble.permission.request':
          return { granted: true } as TResult;
        case 'ble.scan':
          return { devices: [{ id: 'device-1', name: 'RN BLE' }] } as TResult;
        case 'ble.connect':
          return { connected: true } as TResult;
        case 'ble.disconnect':
          return { disconnected: true } as TResult;
        default:
          return { method, params } as TResult;
      }
    },
  };
}
