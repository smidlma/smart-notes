import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { NAV_THEME } from './constants';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  const navTheme = NAV_THEME[colorScheme ?? 'dark'];

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
    navTheme,
  };
}
