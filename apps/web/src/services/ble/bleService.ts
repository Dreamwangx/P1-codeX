import {
  connectBleDevice,
  disconnectBleDevice,
  requestBlePermission,
  scanBleDevices,
  type BleDevice,
} from '../../bridge/plugins/ble';
import type { BridgeClient } from '../../bridge/types';
import type { Logger } from '../../telemetry/logger';

export interface BleService {
  warmup(): Promise<BleDevice[]>;
  connect(deviceId: string): Promise<void>;
  disconnect(deviceId: string): Promise<void>;
}

export function createBleService(bridge: BridgeClient, logger: Logger): BleService {
  return {
    async warmup(): Promise<BleDevice[]> {
      const granted = await requestBlePermission(bridge);
      if (!granted) {
        logger.warn('BLE permission denied');
        return [];
      }
      const devices = await scanBleDevices(bridge);
      logger.info('BLE warmup done', { devices: devices.length });
      return devices;
    },
    async connect(deviceId: string): Promise<void> {
      await connectBleDevice(bridge, deviceId);
      logger.info('BLE connected', { deviceId });
    },
    async disconnect(deviceId: string): Promise<void> {
      await disconnectBleDevice(bridge, deviceId);
      logger.info('BLE disconnected', { deviceId });
    },
  };
}
