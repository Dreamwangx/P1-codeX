import { createBridgeClient } from '../bridge/client';
import { createLogger } from '../telemetry/logger';
import { createHttpClient } from '../services/http/httpClient';
import { createAuthService } from '../services/auth/authService';
import { createAuthStore } from '../auth/tokenStore';
import { createPushService } from '../services/push/pushService';
import { createBleService } from '../services/ble/bleService';

export function createAppContext() {
  const logger = createLogger();
  const bridge = createBridgeClient({ logger });
  const tokenStore = createAuthStore();
  const http = createHttpClient({ tokenStore, logger });
  const auth = createAuthService({ http, tokenStore, logger });
  const push = createPushService(bridge, logger);
  const ble = createBleService(bridge, logger);

  return { logger, bridge, http, auth, push, ble };
}
