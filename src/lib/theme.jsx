import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Tema da aplicação: 'light', 'dark' ou 'system' (segue o sistema operativo).
 * O tema escolhido fica no localStorage e é aplicado como classe `dark` no <html>.
 * O index.html aplica a classe antes do React arrancar, para não piscar branco.
 */
const STORAGE_KEY = 'tema';
const ThemeContext = createContext(null);

const prefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

const readPreference = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(prefersDark);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return undefined;
    const onChange = (event) => setSystemDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const setTheme = useCallback((next) => {
    // Faz a troca de cores deslizar em vez de saltar (ver .theme-switching no CSS).
    const root = document.documentElement;
    root.classList.add('theme-switching');
    window.setTimeout(() => root.classList.remove('theme-switching'), 320);
    setPreference(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sem armazenamento: a escolha vale só nesta sessão */
    }
  }, []);

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setTheme,
      toggle: () => setTheme(resolved === 'dark' ? 'light' : 'dark'),
    }),
    [preference, resolved, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme tem de estar dentro de <ThemeProvider>.');
  return context;
}

/* Cores dos gráficos (SVG não herda as variáveis CSS do Tailwind). */
const LIGHT = {
  grid: '#e5e5e5',
  axis: '#a3a3a3',
  tick: '#404040',
  cursor: '#f5f3ff',
  area: '#f5f3ff',
  primary: '#6b21a8',
  previous: '#e11d48',
  female: '#6b21a8',
  male: '#0369a1',
  category: '#0369a1',
  product: '#047857',
  tooltip: { backgroundColor: '#ffffff', borderColor: '#d4d4d4', color: '#171717' },
};

const DARK = {
  grid: '#2e2e33',
  axis: '#71717a',
  tick: '#d4d4d8',
  cursor: 'rgba(155, 127, 224, 0.15)',
  area: 'rgba(155, 127, 224, 0.12)',
  primary: '#9b7fe0',
  previous: '#f08aa0',
  female: '#b9a2ee',
  male: '#6cb4e8',
  category: '#6cb4e8',
  product: '#52c79a',
  tooltip: { backgroundColor: '#1a1a1c', borderColor: '#3f3f46', color: '#f4f4f5' },
};

export function useChartTheme() {
  const { resolved } = useTheme();
  return resolved === 'dark' ? DARK : LIGHT;
}

/** Estilo comum dos tooltips do recharts. */
export const tooltipStyle = (chart) => ({ borderRadius: 8, fontSize: 14, ...chart.tooltip });
