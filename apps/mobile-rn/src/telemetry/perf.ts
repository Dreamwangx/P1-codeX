import type { Logger } from './logger';

export function trackDuration(logger: Logger, name: string, startedAt: number): void {
  logger.info('rn.perf.duration', { name, durationMs: Date.now() - startedAt });
}
