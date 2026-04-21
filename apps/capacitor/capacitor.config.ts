interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime: boolean;
}

const config: CapacitorConfig = {
  appId: 'com.example.enterprise.mobile',
  appName: 'Enterprise Mobile',
  webDir: '../web/dist',
  bundledWebRuntime: false,
};

export default config;
