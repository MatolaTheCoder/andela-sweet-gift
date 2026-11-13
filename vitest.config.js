import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuração de testes separada, para não mexer no vite.config.js.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
});
