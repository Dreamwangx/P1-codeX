import type { Logger } from './logger';

export function trackDuration(logger: Logger, name: string, startedAt: number): void {
  const durationMs = Date.now() - startedAt;
  logger.info('perf.duration', { name, durationMs });
}
