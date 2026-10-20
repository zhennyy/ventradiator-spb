// Точка входа в браузере: оживляет (гидратирует) готовый HTML, собранный scripts/prerender.js.
// Глобальные стили подключаются первыми, стили компонентов — вместе с компонентами.
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { findPage, ROUTER_FUTURE } from './lib/routes';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter future={ROUTER_FUTURE}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (container.firstElementChild) {
  // Расхождение готового HTML и клиента — ошибка: её ловит проверка в браузере (npm run smoke).
  hydrateRoot(container, app, {
    onRecoverableError: (error) => console.error('Ошибка гидратации:', error),
  });
} else {
  // npm run dev: готового HTML нет, рисуем страницу в браузере (и ставим заголовок вкладки).
  document.title = findPage(window.location.pathname).title;
  createRoot(container).render(app);
}
