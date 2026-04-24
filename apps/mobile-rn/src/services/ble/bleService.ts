import { requestBlePermission, scanBleDevices } from '../../bridge/plugins/ble';
import type { BridgeClient } from '../../bridge/types';
import type { Logger } from '../../telemetry/logger';

export interface BleService {
  warmup(): Promise<void>;
}

export function createBleService(bridge: BridgeClient, logger: Logger): BleService {
  return {
    async warmup(): Promise<void> {
      const granted = await requestBlePermission(bridge);
      if (!granted) {
        logger.warn('RN BLE permission denied');
        return;
      }

      const devices = await scanBleDevices(bridge);
      logger.info('RN BLE scan completed', { deviceCount: devices.length });
    },
  };
}
