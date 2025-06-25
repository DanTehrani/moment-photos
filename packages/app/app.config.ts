import type { ExpoConfig } from '@expo/config';

const APP_VARIANT = process.env.APP_VARIANT;
const EXPO_PROJECT_ID = process.env.EXPO_PROJECT_ID;

let name: string;
let iosBundleIdentifier: string;
let androidPackage: string;
let icon: string;
let adaptiveIcon: string;
let scheme: string;

switch (APP_VARIANT) {
  case 'development':
    name = 'Moment (dev)';
    iosBundleIdentifier = 'com.moment.dev';
    androidPackage = 'com.moment.dev';
    scheme = 'com.moment.dev';
    icon = './assets/icon.png';
    adaptiveIcon = './assets/adaptive-icon.png';
    break;
  case 'staging':
    name = 'Moment (staging)';
    iosBundleIdentifier = 'com.moment.staging';
    androidPackage = 'com.moment.staging';
    scheme = 'com.moment.staging';
    icon = './assets/icon-staging.png';
    adaptiveIcon = './assets/adaptive-icon.png';
    break;
  case 'production':
    name = 'Moment';
    iosBundleIdentifier = 'com.moment.app';
    androidPackage = 'com.moment.app';
    scheme = 'com.moment.app';
    icon = './assets/icon.png';
    adaptiveIcon = './assets/adaptive-icon.png';
    break;
  default:
    throw new Error(`Unknown app variant: ${APP_VARIANT}`);
}

const config: ExpoConfig = {
  newArchEnabled: true,
  name,
  slug: 'moment-open',
  orientation: 'portrait',
  icon,
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  runtimeVersion: '1.0.0',
  version: '1.0.0',
  ios: {
    supportsTablet: true,
    config: {
      usesNonExemptEncryption: false,
    },
    bundleIdentifier: iosBundleIdentifier,
    usesAppleSignIn: true,
  },
  scheme,
  android: {
    adaptiveIcon: {
      foregroundImage: adaptiveIcon,
      backgroundColor: '#ffffff',
    },
    package: androidPackage,
  },
  plugins: [
    [
      'expo-secure-store',
      {
        faceIDPermission: 'Allow Moment to use biometric authentication.',
      },
    ],
    'expo-asset',
    [
      '@sentry/react-native/expo',
      {
        url: 'https://sentry.io/',
        project: 'moment',
        organization: 'raylac',
      },
    ],
    ['expo-localization'],
    [
      'expo-font',
      {
        fonts: [
          './assets/Nunito-Regular.ttf',
          './assets/Nunito-Bold.ttf',
          './assets/Lato-Regular.ttf',
          './assets/Lato-Bold.ttf',
          './assets/Lato-Italic.ttf',
        ],
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow Moonmail to use biometric authentication.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'The app accesses your photos to let you share them with your friends.',
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Moment to access your camera',
        microphonePermission: 'Allow Moment to access your microphone',
        recordAudioAndroid: true,
      },
    ],
    'expo-iap',
    'expo-apple-authentication',
  ],
  extra: {
    eas: {
      projectId: EXPO_PROJECT_ID,
    },
  },
  updates: {
    url: `https://u.expo.dev/${EXPO_PROJECT_ID}`,
  },
  owner: 'raylac',
};

export default config;
