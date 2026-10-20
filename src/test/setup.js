// Общая подготовка тестов компонентов: матчеры jest-dom, подмена matchMedia, очистка после каждого теста.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom не умеет matchMedia — даём простую подмену (по умолчанию ни один запрос не совпадает).
function installMatchMedia() {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  });
}

beforeEach(() => {
  if (typeof window !== 'undefined') installMatchMedia();
});

afterEach(() => {
  if (typeof window === 'undefined') return;
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.className = '';
});
