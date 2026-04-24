import type { BridgeMethod } from './types';

const METHODS: BridgeMethod[] = [
  'scan.start',
  'scan.stop',
  'push.register',
  'push.getToken',
  'ble.permission.request',
  'ble.scan',
  'ble.connect',
  'ble.disconnect',
];

export function createCapabilityChecker() {
  const methodSet = new Set<BridgeMethod>(METHODS);
  return {
    isSupported(method: BridgeMethod): boolean {
      return methodSet.has(method);
    },
  };
}
