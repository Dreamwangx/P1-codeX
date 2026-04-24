import { createAppContext } from './context';
import { getFeatureFlags } from '../services/release/featureFlags';
import { setupGlobalErrorReporting } from '../telemetry/errorReporter';
import { trackDuration } from '../telemetry/perf';

export async function bootstrap(): Promise<void> {
  const startedAt = Date.now();
  const app = createAppContext();
  const flags = getFeatureFlags();

  setupGlobalErrorReporting(app.logger);
  await app.auth.restoreSession();

  if (flags.pushEnabled) {
    await app.push.initialize();
  }

  if (flags.bleEnabled) {
    await app.ble.warmup();
  }

  trackDuration(app.logger, 'rn.bootstrap', startedAt);
  app.logger.info('RN bootstrap done', { bridgeVersion: app.bridge.version, flags });
}
