import type { BridgeMethod } from './types';

const SUPPORTED_METHODS: BridgeMethod[] = [
  'scan.start',
  'scan.stop',
  'push.register',
  'push.getToken',
  'push.onMessage.subscribe',
  'ble.permission.request',
  'ble.scan',
  'ble.connect',
  'ble.disconnect',
];

export function createCapabilityChecker() {
  const set = new Set<BridgeMethod>(SUPPORTED_METHODS);
  return {
    isSupported(method: BridgeMethod): boolean {
      return set.has(method);
    },
  };
}
