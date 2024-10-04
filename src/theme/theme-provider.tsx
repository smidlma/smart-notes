import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeType } from './types';
import { ThemeContext } from './theme-context';
import { useColorScheme, View } from 'react-native';
import { getTheme } from './utils';
import { StatusBar } from 'expo-status-bar';

const DEFAULT_APP_THEME: ThemeType = 'light';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();

  const [themeType, setThemeType] = useState<ThemeType>(colorScheme ?? DEFAULT_APP_THEME);

  const theme = useMemo(() => getTheme(themeType), [themeType]);

  const toggleTheme = useCallback(() => {
    setThemeType((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <PaperProvider theme={theme}>
      <NavigationThemeProvider value={theme}>
        <ThemeContext.Provider value={contextValue}>
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <StatusBar style={themeType === 'dark' ? 'light' : 'dark'} />
            {children}
          </View>
        </ThemeContext.Provider>
      </NavigationThemeProvider>
    </PaperProvider>
  );
};
