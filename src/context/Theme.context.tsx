import React, { useContext, useState } from 'react';

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
  const [theme, setTheme] = useState<Theme>('dark');
  const bodyElement = React.useMemo<HTMLBodyElement>(
    () => document.querySelector('body')!,
    [],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      if (prev === 'dark') {
        bodyElement.classList.remove('dark');
        bodyElement.classList.add('light');
      } else {
        bodyElement.classList.remove('light');
        bodyElement.classList.add('dark');
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
