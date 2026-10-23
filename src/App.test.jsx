// Маршруты: каждая страница открывается по своему адресу (с .html и без), неизвестный адрес — 404.
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { ROUTER_FUTURE } from './lib/routes';

function renderAt(url) {
  return render(
    <MemoryRouter initialEntries={[url]} future={ROUTER_FUTURE}>
      <App />
    </MemoryRouter>,
  );
}

describe('App: маршруты', () => {
  it.each([
    ['/', 'Вентиляция, отопление и чистый воздух в доме'],
    ['/ventilation.html', 'Вентиляция'],
    ['/dust-removal/v3.html', 'Серия V3'],
    ['/dust-removal/v3', 'Серия V3'],
    ['/objects.html', 'Объекты'],
    ['/privacy.html', 'Политика обработки персональных данных'],
    ['/consent', 'Согласие на обработку персональных данных'],
    ['/no-such-page', 'Страница не найдена'],
  ])('%s → «%s»', (url, heading) => {
    renderAt(url);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
  });

  it('на каждой странице есть ссылка «Перейти к содержанию», шапка и подвал', () => {
    renderAt('/about.html');
    expect(screen.getByRole('link', { name: 'Перейти к содержанию' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });
});
