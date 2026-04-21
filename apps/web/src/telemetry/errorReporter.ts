import type { Logger } from './logger';

export function setupGlobalErrorReporting(logger: Logger): void {
  globalThis.addEventListener?.('error', (event) => {
    logger.error('global.error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  globalThis.addEventListener?.('unhandledrejection', (event) => {
    logger.error('global.unhandledrejection', {
      reason: String(event.reason),
    });
  });
}
