import type { Logger } from './logger';

export function setupGlobalErrorReporting(logger: Logger): void {
  globalThis.addEventListener?.('error', (event) => {
    logger.error('rn.global.error', { message: event.message });
  });

  globalThis.addEventListener?.('unhandledrejection', (event) => {
    logger.error('rn.global.unhandledrejection', { reason: String(event.reason) });
  });
}
