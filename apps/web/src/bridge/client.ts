import { BridgeTimeoutError, BridgeUnsupportedError } from './errors';
import { createCapabilityChecker } from './capabilities';
import { createNativeInvoker } from './nativeInvoker';
import type { BridgeClient, BridgeInvokeOptions, BridgeMethod, BridgeResult } from './types';
import type { Logger } from '../telemetry/logger';

const DEFAULT_TIMEOUT = 8000;

interface CreateBridgeClientOptions {
  logger: Logger;
}

export function createBridgeClient(options: CreateBridgeClientOptions): BridgeClient {
  const capability = createCapabilityChecker();
  const invoker = createNativeInvoker();

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

    const timeoutMs = invokeOptions.timeoutMs ?? DEFAULT_TIMEOUT;

    try {
      const response = await promiseWithTimeout(invoker.call<TParams, TResult>(method, params), timeoutMs, method);
      return { success: true, data: response, traceId: invokeOptions.traceId };
    } catch (error) {
      options.logger.error('Bridge invoke failed', { method, error });
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
    version: '1.0.0-mvp',
    invoke,
    isSupported(method: BridgeMethod) {
      return capability.isSupported(method);
    },
  };
}

async function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number, method: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new BridgeTimeoutError(method, timeoutMs)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
