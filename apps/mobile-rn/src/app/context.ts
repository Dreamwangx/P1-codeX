import { createBridgeClient } from '../bridge/client';
import { createLogger } from '../telemetry/logger';
import { createHttpClient } from '../services/http/httpClient';
import { createAuthService } from '../services/auth/authService';
import { createTokenStore } from '../auth/tokenStore';
import { createPushService } from '../services/push/pushService';
import { createBleService } from '../services/ble/bleService';

export function createAppContext() {
  const logger = createLogger();
  const bridge = createBridgeClient({ logger });
  const tokenStore = createTokenStore();
  const http = createHttpClient({ logger, tokenStore });
  const auth = createAuthService({ http, logger, tokenStore });
  const push = createPushService(bridge, logger);
  const ble = createBleService(bridge, logger);

  return { logger, bridge, http, auth, push, ble };
}
