// Vite: React, список фото из images/ (virtual:photos) и год для подвала.
// Сборка в три шага (см. package.json): клиент → серверный рендер → scripts/prerender.js пишет готовый HTML.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import photosPlugin from './scripts/photos-plugin.js';

export default defineConfig({
  plugins: [react(), photosPlugin()],
  // Год фиксируется при сборке: одинаковый в готовом HTML и при гидратации.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  // Тесты (Vitest): компоненты рендерятся в jsdom; тесты сервера и пререндера сами выбирают окружение node.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}', 'server/**/*.test.js', 'scripts/**/*.test.js'],
  },
});
