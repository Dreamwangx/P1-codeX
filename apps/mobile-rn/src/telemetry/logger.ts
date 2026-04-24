export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export function createLogger(): Logger {
  return {
    info(message, meta) {
      console.info(`[info] ${message}`, meta ?? {});
    },
    warn(message, meta) {
      console.warn(`[warn] ${message}`, meta ?? {});
    },
    error(message, meta) {
      console.error(`[error] ${message}`, meta ?? {});
    },
  };
}
