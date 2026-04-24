export type DeviceKind = 'phone' | 'tablet';

const TABLET_WIDTH = 900;

export function detectDeviceKind(width: number): DeviceKind {
  return width >= TABLET_WIDTH ? 'tablet' : 'phone';
}

export function getLayoutMode(width: number): 'single-pane' | 'dual-pane' {
  return detectDeviceKind(width) === 'tablet' ? 'dual-pane' : 'single-pane';
}
