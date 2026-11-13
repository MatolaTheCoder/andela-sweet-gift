import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../lib/theme';
import { SettingsProvider } from '../lib/settings';
import { AuthProvider } from '../lib/auth';

/** Desenha um componente com os providers da aplicação e um router em memória. */
export function renderApp(ui, { route = '/' } = {}) {
  return render(
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

/** Entra como um colaborador (grava o utilizador antes de desenhar). */
export function loginAs(user) {
  localStorage.setItem('mock:user', JSON.stringify(user));
}
