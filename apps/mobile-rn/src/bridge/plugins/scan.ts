import type { BridgeClient } from '../types';

export interface ScanResult {
  content: string;
  raw?: unknown;
}

export async function startScan(bridge: BridgeClient): Promise<ScanResult> {
  const result = await bridge.invoke<undefined, ScanResult>('scan.start', undefined);
  if (!result.success) throw new Error(`[${result.error.code}] ${result.error.message}`);
  return result.data;
}
