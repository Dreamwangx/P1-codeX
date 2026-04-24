import { getPushToken, registerPush } from '../../bridge/plugins/push';
import type { BridgeClient } from '../../bridge/types';
import type { Logger } from '../../telemetry/logger';

export interface PushService {
  initialize(): Promise<void>;
}

export function createPushService(bridge: BridgeClient, logger: Logger): PushService {
  return {
    async initialize(): Promise<void> {
      await registerPush(bridge);
      const token = await getPushToken(bridge);
      logger.info('RN push initialized', { token });
    },
  };
}
