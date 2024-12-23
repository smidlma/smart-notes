import { AuthProvider } from '@/auth/auth-provider';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Slot } from 'expo-router';
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();
  // const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ReduxStoreProvider store={store}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
              <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
              <Slot />
              <PortalHost />
              <Toast config={toastConfig} topOffset={64} />
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </ReduxStoreProvider>
  );
}
