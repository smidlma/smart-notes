import { createContext, useContext } from 'react';
import { ThemeContextProps } from './types';

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error('useAppTheme must be use inside ThemeProvider');

  return context;
};
