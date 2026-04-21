import type { BridgeClient } from '../types';

export interface BleDevice {
  id: string;
  name: string;
}

export async function requestBlePermission(bridge: BridgeClient): Promise<boolean> {
  const result = await bridge.invoke<undefined, { granted: boolean }>('ble.permission.request', undefined);
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
  return result.data.granted;
}

export async function scanBleDevices(bridge: BridgeClient): Promise<BleDevice[]> {
  const result = await bridge.invoke<undefined, { devices: BleDevice[] }>('ble.scan', undefined);
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
  return result.data.devices;
}

export async function connectBleDevice(bridge: BridgeClient, deviceId: string): Promise<void> {
  const result = await bridge.invoke<{ deviceId: string }, { connected: boolean }>('ble.connect', { deviceId });
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
}

export async function disconnectBleDevice(bridge: BridgeClient, deviceId: string): Promise<void> {
  const result = await bridge.invoke<{ deviceId: string }, { disconnected: boolean }>('ble.disconnect', { deviceId });
  if (!result.success) {
    throw new Error(`[${result.error.code}] ${result.error.message}`);
  }
}
