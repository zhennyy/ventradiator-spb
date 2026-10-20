// Список всех страниц сайта: путь, SEO-данные и функция, которая рисует содержимое.
const { renderHome } = require('../templates/home');
const { renderSection } = require('../templates/section');
const { renderCategory } = require('../templates/category');
const { renderObjects, renderAbout, renderContacts, renderNotFound } = require('../templates/info-pages');
const { renderPrivacy, renderConsent } = require('../templates/legal');

const SUFFIX = 'Blizzard в Санкт-Петербурге';

function organizationJsonLd(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${site.brand} ${site.brandSuffix} — Санкт-Петербург`,
    url: site.siteUrl,
    email: site.email,
    telephone: site.offices[0].phones[0],
    areaServed: ['Санкт-Петербург', 'Ленинградская область'],
  };
}

function catalogPages(catalog) {
  const pages = [];
  for (const section of catalog.sections) {
    pages.push({
      path: `/${section.slug}.html`,
      title: section.seoTitle,
      description: section.description,
      breadcrumbs: [{ href: `/${section.slug}.html`, label: section.title }],
      render: (context) => renderSection({ ...context, section }),
    });
    for (const category of section.categories) {
      pages.push({
        path: `/${section.slug}/${category.slug}.html`,
        title: `${category.title} — ${section.seoNoun} ${SUFFIX}`,
        description: category.summary.replace(/\s*\[[^\]]*\]/g, ''),
        image: category.image,
        hasForm: true,
        breadcrumbs: [
          { href: `/${section.slug}.html`, label: section.title },
          { href: `/${section.slug}/${category.slug}.html`, label: category.title },
        ],
        render: (context) => renderCategory({ ...context, section, category }),
      });
    }
  }
  return pages;
}

function buildPageList({ site, catalog }) {
  return [
    {
      path: '/index.html',
      title: 'Вентиляция с рекуперацией и центральные пылесосы Blizzard — Санкт-Петербург',
      description:
        'Тихая немецкая приточно-вытяжная вентиляция с рекуперацией тепла и центральные пылесосы Blizzard для домов и квартир в Санкт-Петербурге и Ленобласти.',
      bodyClass: 'page-home',
      hasForm: true,
      jsonLd: organizationJsonLd(site),
      render: renderHome,
    },
    ...catalogPages(catalog),
    {
      path: '/objects.html',
      title: `Объекты с системами Blizzard — ${SUFFIX}`,
      description: `${site.objectsTotal} объектов в СНГ с системами Blizzard: БДТ им. Товстоногова, «Зарядье», Исторический музей и другие.`,
      breadcrumbs: [{ href: '/objects.html', label: 'Объекты' }],
      render: renderObjects,
    },
    {
      path: '/about.html',
      title: `О компании BLIZZARD lufttechnik — ${SUFFIX}`,
      description:
        'Немецкий производитель вентиляции с рекуперацией тепла и центральных пылесосов. Представительство в Санкт-Петербурге.',
      breadcrumbs: [{ href: '/about.html', label: 'О компании' }],
      render: renderAbout,
    },
    {
      path: '/contacts.html',
      title: `Контакты — ${SUFFIX}`,
      description: `Телефон представительства Blizzard в Санкт-Петербурге: ${site.offices[0].phones[0]}. Почта ${site.email}.`,
      breadcrumbs: [{ href: '/contacts.html', label: 'Контакты' }],
      hasForm: true,
      jsonLd: organizationJsonLd(site),
      render: renderContacts,
    },
    {
      path: '/privacy.html',
      title: `Политика обработки персональных данных — ${SUFFIX}`,
      description: 'Политика обработки персональных данных представительства Blizzard в Санкт-Петербурге.',
      breadcrumbs: [{ href: '/privacy.html', label: 'Политика обработки данных' }],
      render: renderPrivacy,
    },
    {
      path: '/consent.html',
      title: `Согласие на обработку персональных данных — ${SUFFIX}`,
      description: 'Согласие на обработку персональных данных при отправке заявки на сайте.',
      breadcrumbs: [{ href: '/consent.html', label: 'Согласие на обработку данных' }],
      render: renderConsent,
    },
    {
      path: '/404.html',
      title: `Страница не найдена — ${SUFFIX}`,
      description: 'Такой страницы нет. Перейдите в каталог вентиляции или пылеудаления Blizzard.',
      noindex: true,
      render: renderNotFound,
    },
  ];
}

module.exports = { buildPageList };
