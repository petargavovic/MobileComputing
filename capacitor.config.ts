import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ConnectHub',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      // Camera configuration options
      webUseInput: true // Enable this for web platform testing
    }
  }
};

export default config;
