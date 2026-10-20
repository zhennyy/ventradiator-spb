// Гидратация: готовый HTML каждой страницы (как из пререндера) оживляется в браузере без единого
// предупреждения React о расхождении разметки — иначе страница перерисуется и «мигнёт».
import { act } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { renderPage } from './entry-server';
import { pages, pageUrls, ROUTER_FUTURE } from './lib/routes';

async function hydrateAt(url, page) {
  const container = document.createElement('div');
  container.id = 'root';
  container.innerHTML = renderPage(page);
  document.body.append(container);
  window.history.replaceState(null, '', url);
  const recoverable = [];
  let root;
  await act(async () => {
    root = hydrateRoot(
      container,
      <BrowserRouter future={ROUTER_FUTURE}>
        <App />
      </BrowserRouter>,
      { onRecoverableError: (error) => recoverable.push(error) },
    );
  });
  return { container, recoverable, cleanup: () => act(() => root.unmount()) };
}

describe('гидратация готового HTML', () => {
  it.each(pages.map((page) => [page.path, page]))('%s — без расхождений', async (path, page) => {
    const consoleError = vi.spyOn(console, 'error');
    const url = page.kind === 'not-found' ? '/no-such-page' : pageUrls(page)[0];
    const { container, recoverable, cleanup } = await hydrateAt(url, page);
    expect(recoverable).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    await cleanup();
    container.remove();
  });

  it('адрес без .html открывает ту же страницу', async () => {
    const page = pages.find((item) => item.path === '/dust-removal/v2.html');
    const consoleError = vi.spyOn(console, 'error');
    const { container, cleanup } = await hydrateAt('/dust-removal/v2', page);
    expect(consoleError).not.toHaveBeenCalled();
    expect(container.querySelector('h1').textContent).toBe('Серия V2');
    await cleanup();
    container.remove();
  });
});
