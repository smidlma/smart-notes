import { AuthProvider } from '@/auth/auth-provider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Slot, useNavigationContainerRef } from 'expo-router';
import 'react-native-reanimated';
import '@/locales/i18n';
import { Theme, ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { NAV_THEME } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/global.css';
import { useEffect } from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { store } from '@/redux/store';
import { PortalHost } from '@rn-primitives/portal';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/toast/Toast';
import * as SystemUI from 'expo-system-ui';
import { vexo } from 'vexo-analytics';
import { VEXO_API_KEY } from '../../config-global';
import * as Sentry from '@sentry/react-native';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: DefaultTheme.fonts,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: DarkTheme.fonts,
};

SystemUI.setBackgroundColorAsync('black');

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

if (!__DEV__) {
  vexo(VEXO_API_KEY);
}

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !__DEV__,
});

Sentry.init({
  dsn: 'https://23a3e6b0820fa531e1cbe1d563759282@o4508955257339904.ingest.de.sentry.io/4508955261075536',
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enabled: !__DEV__,
  enableNativeFramesTracking: !__DEV__,
});

function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  // const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <ReduxStoreProvider store={store}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <Slot />
              <PortalHost />
              <Toast config={toastConfig} topOffset={64} />
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </ReduxStoreProvider>
  );
}

export default Sentry.wrap(RootLayout);
