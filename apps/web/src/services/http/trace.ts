export function createTraceId(): string {
  return `trace_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
