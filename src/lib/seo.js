// SEO-данные страницы для <head>: title, description, canonical, Open Graph, robots и JSON-LD.
// Используются при пререндере (компонент Head); адрес сайта берётся из SITE_URL или data/site.json.
import { site } from './content';
import { ogCoverSrc, resolveImage } from './images';

export function normalizeSiteUrl(siteUrl) {
  return (siteUrl || site.siteUrl).replace(/\/$/, '');
}

export function canonicalUrl(siteUrl, pagePath) {
  const cleanPath = pagePath === '/index.html' ? '/' : pagePath;
  return normalizeSiteUrl(siteUrl) + cleanPath;
}

export function organizationJsonLd(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${site.brand} — Санкт-Петербург`,
    url: normalizeSiteUrl(siteUrl),
    ...(site.email && { email: site.email }),
    ...(site.offices[0].phones[0] && { telephone: site.offices[0].phones[0] }),
    areaServed: ['Санкт-Петербург', 'Ленинградская область', 'Россия'],
  };
}

// Картинка для превью ссылки: настоящее фото товара, иначе общая обложка, иначе ничего.
function ogImagePath(page) {
  const image = page.image ? resolveImage(page.image, page.title) : null;
  return image && !image.isPlaceholder ? image.src : ogCoverSrc();
}

export function getHeadMeta(page, { siteUrl } = {}) {
  const baseUrl = normalizeSiteUrl(siteUrl);
  const ogImage = ogImagePath(page);
  return {
    title: page.title,
    description: page.description,
    robots: page.noindex ? 'noindex' : '',
    canonical: canonicalUrl(baseUrl, page.path),
    siteName: site.siteName,
    ogImage: ogImage ? baseUrl + ogImage : '',
    jsonLd: page.jsonLd ? organizationJsonLd(baseUrl) : null,
  };
}
