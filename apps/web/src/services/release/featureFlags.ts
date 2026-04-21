export interface FeatureFlags {
  bleEnabled: boolean;
  pushEnabled: boolean;
  dualPaneEnabled: boolean;
}

const defaults: FeatureFlags = {
  bleEnabled: true,
  pushEnabled: true,
  dualPaneEnabled: true,
};

export function getFeatureFlags(overrides?: Partial<FeatureFlags>): FeatureFlags {
  return { ...defaults, ...overrides };
}
