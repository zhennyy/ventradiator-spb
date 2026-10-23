// Список страниц: каждая категория — своя страница, поиск страницы по адресу.
import { describe, expect, it } from 'vitest';
import { catalog } from './content';
import { findPage, NOT_FOUND_PAGE, pages, pageUrls } from './routes';

describe('routes', () => {
  it('у каждой категории каталога есть страница с крошками «раздел → категория» и формой', () => {
    for (const section of catalog.sections) {
      for (const category of section.categories) {
        const page = pages.find((item) => item.path === `/${section.slug}/${category.slug}.html`);
        expect(page, category.slug).toBeDefined();
        expect(page.hasForm).toBe(true);
        expect(page.breadcrumbs.map((crumb) => crumb.label)).toEqual([section.title, category.title]);
      }
    }
    expect(pages).toHaveLength(
      6 + catalog.sections.length + catalog.sections.flatMap((item) => item.categories).length,
    );
  });

  it('страница находится по адресу с .html и без, главная — и по /', () => {
    expect(pageUrls(pages[0])).toEqual(['/', '/index.html', '/index']);
    expect(findPage('/').kind).toBe('home');
    expect(findPage('/ventilation/units').categorySlug).toBe('units');
    expect(findPage('/ventilation/units.html?utm=1#request').categorySlug).toBe('units');
    expect(findPage('/about').kind).toBe('about');
  });

  it('неизвестный адрес — страница 404', () => {
    expect(findPage('/nope.html')).toBe(NOT_FOUND_PAGE);
    expect(findPage('/404.html')).toBe(NOT_FOUND_PAGE);
  });

  it('в description категорий нет заглушек', () => {
    for (const page of pages) expect(page.description, page.path).not.toMatch(/\[/);
  });
});
