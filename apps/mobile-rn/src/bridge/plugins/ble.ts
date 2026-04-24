import type { BridgeClient } from '../types';

export interface BleDevice {
  id: string;
  name: string;
}

export async function requestBlePermission(bridge: BridgeClient): Promise<boolean> {
  const result = await bridge.invoke<undefined, { granted: boolean }>('ble.permission.request', undefined);
  if (!result.success) throw new Error(`[${result.error.code}] ${result.error.message}`);
  return result.data.granted;
}

export async function scanBleDevices(bridge: BridgeClient): Promise<BleDevice[]> {
  const result = await bridge.invoke<undefined, { devices: BleDevice[] }>('ble.scan', undefined);
  if (!result.success) throw new Error(`[${result.error.code}] ${result.error.message}`);
  return result.data.devices;
}
