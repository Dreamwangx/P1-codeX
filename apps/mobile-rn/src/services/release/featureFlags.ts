export interface FeatureFlags {
  pushEnabled: boolean;
  bleEnabled: boolean;
  dualPaneEnabled: boolean;
}

const defaults: FeatureFlags = {
  pushEnabled: true,
  bleEnabled: true,
  dualPaneEnabled: true,
};

export function getFeatureFlags(overrides?: Partial<FeatureFlags>): FeatureFlags {
  return { ...defaults, ...overrides };
}
