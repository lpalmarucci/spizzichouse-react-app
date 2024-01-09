import React, { useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.tsx';
import { LocalStorageKeys } from '../costants/localStorage.ts';

export type Theme = 'light' | 'dark';

interface IThemeContext {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<IThemeContext>({} as IThemeContext);

export const useTheme = () => useContext<IThemeContext>(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storedValue, saveValueToLocalStorage] = useLocalStorage<Theme>(
    LocalStorageKeys.THEME,
    'dark',
  );
  const [theme, setTheme] = useState<Theme>(storedValue);
  const rootElement = React.useMemo<HTMLElement>(
    () => document.querySelector('html')!,
    [],
  );

  useEffect(() => {
    storedValue === 'dark'
      ? rootElement.classList.add('dark')
      : rootElement.classList.add('light');
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      if (theme === 'dark') {
        rootElement.classList.remove('dark');
        rootElement.classList.add('light');
      } else {
        rootElement.classList.remove('light');
        rootElement.classList.add('dark');
      }
      const newTheme = prev === 'light' ? 'dark' : 'light';
      saveValueToLocalStorage(newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
