import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { SettingsProvider } from './lib/settings';
import { AuthProvider } from './lib/auth';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
