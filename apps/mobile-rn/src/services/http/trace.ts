export function createTraceId(): string {
  return `rn_trace_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
