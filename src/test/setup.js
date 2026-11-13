import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// Regista os matchers do jest-dom no expect global (a importação direta de
// '@testing-library/jest-dom/vitest' não liga ao runner neste ambiente).
expect.extend(matchers);

// O jsdom não traz estas APIs, usadas pelos gráficos e pelo tema.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
});

window.scrollTo ??= () => {};
URL.createObjectURL ??= () => 'blob:teste';
URL.revokeObjectURL ??= () => {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => cleanup());
