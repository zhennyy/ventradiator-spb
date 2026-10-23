// Список всех страниц сайта: адрес, тип страницы, SEO-данные и хлебные крошки.
// Новая категория в data/catalog.json → новая страница здесь, в меню, в sitemap.xml и в пререндере.
import { catalog, categoryPath, sectionPath } from './content';
import { withoutStubs } from './text';

const SUFFIX = 'Санкт-Петербург';

function catalogPages() {
  const pages = [];
  for (const section of catalog.sections) {
    const sectionCrumb = { href: sectionPath(section), label: section.title };
    pages.push({
      path: sectionPath(section),
      kind: 'section',
      sectionSlug: section.slug,
      title: section.seoTitle,
      description: section.description,
      breadcrumbs: [sectionCrumb],
    });
    for (const category of section.categories) {
      pages.push({
        path: categoryPath(section, category),
        kind: 'category',
        sectionSlug: section.slug,
        categorySlug: category.slug,
        title: `${category.title} — ${section.seoNoun} в Санкт-Петербурге`,
        description: withoutStubs(category.summary),
        image: category.image,
        hasForm: true,
        breadcrumbs: [sectionCrumb, { href: categoryPath(section, category), label: category.title }],
      });
    }
  }
  return pages;
}

function infoPage(path, kind, title, description, label, extra = {}) {
  return { path, kind, title, description, breadcrumbs: [{ href: path, label }], ...extra };
}

export const NOT_FOUND_PAGE = {
  path: '/404.html',
  kind: 'not-found',
  title: `Страница не найдена — ${SUFFIX}`,
  description: 'Такой страницы нет. Перейдите в каталог вентиляции или пылеудаления.',
  noindex: true,
};

export const pages = [
  {
    path: '/index.html',
    kind: 'home',
    title: 'Вентиляция, отопление и чистый воздух в доме — Санкт-Петербург',
    description:
      'Вентиляция с рекуперацией тепла, центральные пылесосы, радиаторы и конвекторы. Подбор, расчёт и поставка по Петербургу и всей России.',
    hasForm: true,
    jsonLd: true,
  },
  ...catalogPages(),
  infoPage(
    '/about.html',
    'about',
    `О представительстве — ${SUFFIX}`,
    'Немецкий производитель вентиляции с рекуперацией тепла и центральных пылесосов. Представительство в Санкт-Петербурге.',
    'О компании',
  ),
  infoPage(
    '/contacts.html',
    'contacts',
    `Контакты — ${SUFFIX}`,
    'Контакты представительства в Санкт-Петербурге и офиса для России, СНГ и Прибалтики. Форма заявки на подбор и расчёт.',
    'Контакты',
    { hasForm: true, jsonLd: true },
  ),
  infoPage(
    '/privacy.html',
    'privacy',
    `Политика обработки персональных данных — ${SUFFIX}`,
    'Политика обработки персональных данных представительства в Санкт-Петербурге.',
    'Политика обработки данных',
  ),
  infoPage(
    '/consent.html',
    'consent',
    `Согласие на обработку персональных данных — ${SUFFIX}`,
    'Согласие на обработку персональных данных при отправке заявки на сайте.',
    'Согласие на обработку данных',
  ),
  NOT_FOUND_PAGE,
];

// Под какими адресами открывается страница: /ventilation/units.html и /ventilation/units (сервер отдаёт оба), главная — ещё и /.
export function pageUrls(page) {
  const clean = page.path.replace(/\.html$/, '');
  return page.path === '/index.html' ? ['/', '/index.html', '/index'] : [page.path, clean];
}

export function findPage(url) {
  const pathname = url.split(/[?#]/)[0];
  return pages.find((page) => page.kind !== 'not-found' && pageUrls(page).includes(pathname)) || NOT_FOUND_PAGE;
}

export function findSection(slug) {
  return catalog.sections.find((section) => section.slug === slug);
}

export function findCategory(section, slug) {
  return section.categories.find((category) => category.slug === slug);
}

// Поведение React Router v7 включено заранее (и без предупреждений в консоли).
export const ROUTER_FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };
