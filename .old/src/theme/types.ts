import { getTheme } from './utils';

export type ThemeType = 'dark' | 'light';

export type CustomTheme = ReturnType<typeof getTheme>;

export type ThemeContextProps = {
  theme: CustomTheme;
  toggleTheme: () => void;
};
