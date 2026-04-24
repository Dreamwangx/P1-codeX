import { createCapabilityChecker } from './capabilities';
import { BridgeTimeoutError, BridgeUnsupportedError } from './errors';
import { createNativeBridge } from './nativeBridge';
import type { BridgeClient, BridgeInvokeOptions, BridgeMethod, BridgeResult } from './types';
import type { Logger } from '../telemetry/logger';

interface CreateBridgeClientOptions {
  logger: Logger;
}

const DEFAULT_TIMEOUT_MS = 8000;

export function createBridgeClient(options: CreateBridgeClientOptions): BridgeClient {
  const capability = createCapabilityChecker();
  const nativeBridge = createNativeBridge();

  async function invoke<TParams, TResult>(
    method: BridgeMethod,
    params: TParams,
    invokeOptions: BridgeInvokeOptions = {},
  ): Promise<BridgeResult<TResult>> {
    if (!capability.isSupported(method)) {
      const error = new BridgeUnsupportedError(method);
      return {
        success: false,
        error: { code: 'BRIDGE_UNSUPPORTED', message: error.message, traceId: invokeOptions.traceId },
        traceId: invokeOptions.traceId,
      };
    }

    try {
      const data = await withTimeout(
        nativeBridge.call<TParams, TResult>(method, params),
        invokeOptions.timeoutMs ?? DEFAULT_TIMEOUT_MS,
        method,
      );
      return { success: true, data, traceId: invokeOptions.traceId };
    } catch (error) {
      options.logger.error('RN bridge invoke failed', { method, error });
      const message = error instanceof Error ? error.message : 'Unknown bridge error';
      const code = error instanceof BridgeTimeoutError ? 'BRIDGE_TIMEOUT' : 'NATIVE_EXECUTION';
      return {
        success: false,
        error: { code, message, traceId: invokeOptions.traceId },
        traceId: invokeOptions.traceId,
      };
    }
  }

  return {
    version: 'rn-1.0.0-mvp',
    invoke,
    isSupported(method: BridgeMethod): boolean {
      return capability.isSupported(method);
    },
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, method: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new BridgeTimeoutError(method, timeoutMs)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
