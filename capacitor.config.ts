import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tvtime.app',
  appName: 'TV Time',
  webDir: 'public',
  server: {
    url: 'https://tvtime-clone-alpha.vercel.app',
    cleartext: false,
  },
};

export default config;
