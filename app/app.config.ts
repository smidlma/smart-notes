import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'smart-notes',
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  extra: {
    ...config.extra,
    APP_VARIANT: process.env.APP_VARIANT,
  },
});

const IS_DEV = process.env.APP_VARIANT === 'development';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.smidlma.smartnotes-v1.dev';
  }

  return 'com.smidlma.smartnotes-v1';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'SmartNotes (Dev)';
  }

  return 'SmartNotes';
};
