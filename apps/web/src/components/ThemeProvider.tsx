'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'corroba-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.dataset.theme = resolved;
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
    setThemeState(initial);
    applyTheme(initial);
    setResolvedTheme(initial === 'system' ? getSystemTheme() : initial);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    setResolvedTheme(theme === 'system' ? getSystemTheme() : theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyTheme('system');
      setResolvedTheme(getSystemTheme());
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const resolved = current === 'system' ? getSystemTheme() : current;
      return resolved === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
