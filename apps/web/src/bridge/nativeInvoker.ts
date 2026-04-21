import type { BridgeMethod } from './types';

export interface NativeInvoker {
  call<TParams, TResult>(method: BridgeMethod, params: TParams): Promise<TResult>;
}

export function createNativeInvoker(): NativeInvoker {
  // Week 5-8 mock adapter for integration development before native plugin wiring.
  return {
    async call<TParams, TResult>(method: BridgeMethod, params: TParams): Promise<TResult> {
      switch (method) {
        case 'scan.start':
          return { content: 'MOCK_SCAN_RESULT', raw: params } as TResult;
        case 'push.register':
          return { registered: true } as TResult;
        case 'push.getToken':
          return { token: 'mock-push-token' } as TResult;
        case 'push.onMessage.subscribe':
          return { subscriptionId: 'push-subscription-mock' } as TResult;
        case 'ble.permission.request':
          return { granted: true } as TResult;
        case 'ble.scan':
          return { devices: [{ id: 'ble-device-1', name: 'Mock Sensor' }] } as TResult;
        case 'ble.connect':
          return { connected: true, deviceId: (params as { deviceId: string }).deviceId } as TResult;
        case 'ble.disconnect':
          return { disconnected: true, deviceId: (params as { deviceId: string }).deviceId } as TResult;
        default:
          return { method, params } as TResult;
      }
    },
  };
}
