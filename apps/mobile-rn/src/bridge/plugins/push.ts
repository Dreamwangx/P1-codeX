import type { BridgeClient } from '../types';

export async function registerPush(bridge: BridgeClient): Promise<void> {
  const result = await bridge.invoke<undefined, { ok: boolean }>('push.register', undefined);
  if (!result.success) throw new Error(`[${result.error.code}] ${result.error.message}`);
}

export async function getPushToken(bridge: BridgeClient): Promise<string> {
  const result = await bridge.invoke<undefined, { token: string }>('push.getToken', undefined);
  if (!result.success) throw new Error(`[${result.error.code}] ${result.error.message}`);
  return result.data.token;
}
