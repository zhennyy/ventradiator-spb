// Список страниц: каждая категория — своя страница, поиск страницы по адресу.
import { describe, expect, it } from 'vitest';
import { catalog } from './content';
import { findPage, NOT_FOUND_PAGE, pages, pageUrls } from './routes';

describe('routes', () => {
  it('у каждой категории каталога есть страница с крошками «раздел → категория» и блоком контактов', () => {
    for (const section of catalog.sections) {
      for (const category of section.categories) {
        const page = pages.find((item) => item.path === `/${section.slug}/${category.slug}.html`);
        expect(page, category.slug).toBeDefined();
        expect(page.hasContacts).toBe(true);
        expect(page.breadcrumbs.map((crumb) => crumb.label)).toEqual([section.title, category.title]);
      }
      // Вложенная категория (Velar внутри «Трубчатых») — своя страница, в крошках и родитель
      for (const nested of section.nestedCategories || []) {
        const page = pages.find((item) => item.path === `/${section.slug}/${nested.slug}.html`);
        const parent = section.categories.find((item) => item.slug === nested.parent);
        expect(page.breadcrumbs.map((crumb) => crumb.label)).toEqual([section.title, parent.title, nested.title]);
      }
    }
    // 5 служебных страниц: главная, о компании, контакты, политика, 404
    expect(pages).toHaveLength(
      5 +
        catalog.sections.length +
        catalog.sections.flatMap((item) => [...item.categories, ...(item.nestedCategories || [])]).length,
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
