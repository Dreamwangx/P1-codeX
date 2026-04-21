import type { BridgeClient } from '../types';

export interface PushTokenResult {
  token: string;
}

export interface PushMessageSubscription {
  subscriptionId: string;
}

export async function registerPush(bridge: BridgeClient): Promise<void> {
  const result = await bridge.invoke<undefined, { registered: boolean }>('push.register', undefined);
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
}

export async function getPushToken(bridge: BridgeClient): Promise<PushTokenResult> {
  const result = await bridge.invoke<undefined, PushTokenResult>('push.getToken', undefined);
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
  return result.data;
}

export async function subscribePushMessage(bridge: BridgeClient): Promise<PushMessageSubscription> {
  const result = await bridge.invoke<undefined, PushMessageSubscription>('push.onMessage.subscribe', undefined);
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
  return result.data;
}
