import React, { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setCurrency } from './format';
import { BRAND_NAME, brandEmail } from './brand';

/**
 * Definições da loja (guardadas neste navegador) e o que cada uma faz:
 * - empresa: nome na barra lateral, no título da página e nos recibos;
 * - email: contacto nos recibos;
 * - moeda: moeda em que todos os valores são mostrados (ver format.js);
 * - notificacoes: mostra ou esconde os alertas no sino;
 * - porPagina: tamanho das páginas das listas.
 */
const STORAGE_KEY = 'definicoes';

export const SETTINGS_DEFAULTS = {
  empresa: BRAND_NAME,
  email: brandEmail('geral'),
  moeda: 'MZN',
  notificacoes: true,
  porPagina: '10',
};

const SettingsContext = createContext({
  settings: SETTINGS_DEFAULTS,
  saveSettings: () => {},
  resetSettings: () => {},
});

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return stored ? { ...SETTINGS_DEFAULTS, ...stored } : SETTINGS_DEFAULTS;
  } catch {
    return SETTINGS_DEFAULTS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);

  // Antes de desenhar os filhos, para que formatCurrency já use a moeda certa.
  setCurrency(settings.moeda);

  useEffect(() => {
    document.title = `${settings.empresa} · Gestão`;
  }, [settings.empresa]);

  const saveSettings = useCallback((next) => {
    const merged = { ...SETTINGS_DEFAULTS, ...next };
    setSettings(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      /* sem armazenamento: vale só nesta sessão */
    }
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(SETTINGS_DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
  }, []);

  const value = useMemo(() => ({ settings, saveSettings, resetSettings }), [settings, saveSettings, resetSettings]);

  // A key faz refazer a árvore quando a moeda muda: os valores já desenhados
  // (formatados por funções simples) passam a aparecer na moeda nova.
  return (
    <SettingsContext.Provider value={value}>
      <Fragment key={settings.moeda}>{children}</Fragment>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
