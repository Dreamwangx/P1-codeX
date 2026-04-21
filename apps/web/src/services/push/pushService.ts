import type { BridgeClient } from '../../bridge/types';
import { getPushToken, registerPush, subscribePushMessage } from '../../bridge/plugins/push';
import type { Logger } from '../../telemetry/logger';

export interface PushService {
  initialize(): Promise<void>;
}

export function createPushService(bridge: BridgeClient, logger: Logger): PushService {
  return {
    async initialize(): Promise<void> {
      await registerPush(bridge);
      const token = await getPushToken(bridge);
      const subscription = await subscribePushMessage(bridge);

      logger.info('Push initialized', {
        token: token.token,
        subscriptionId: subscription.subscriptionId,
      });
    },
  };
}
