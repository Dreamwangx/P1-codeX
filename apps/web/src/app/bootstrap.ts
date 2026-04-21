import { createAppContext } from './context';
import { setupGlobalErrorReporting } from '../telemetry/errorReporter';
import { trackDuration } from '../telemetry/perf';
import { getFeatureFlags } from '../services/release/featureFlags';

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

  trackDuration(app.logger, 'app.bootstrap', startedAt);
  app.logger.info('App bootstrapped', { bridgeVersion: app.bridge.version, flags });
}
