import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { Colors } from './pallete';

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

//4. The adaptNavigationTheme function takes an existing React Navigation
// theme and returns a React Navigation theme using the colors from
// Material Design 3.
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

//5.We will merge React Native Paper Theme and Expo Router Theme
// using deepmerge
const CombinedDefaultTheme = {
  ...LightTheme,
  ...customLightTheme,
  colors: {
    ...LightTheme.colors,
    ...customLightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...DarkTheme,
  ...customDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...customDarkTheme.colors,
  },
};

export const getTheme = (theme: 'light' | 'dark') =>
  theme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme;
