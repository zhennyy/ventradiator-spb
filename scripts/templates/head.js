// <head> страницы: заголовок, описание, canonical, Open Graph и подключение стилей.
const { escapeHtml } = require('../lib/html');

function canonicalUrl(siteUrl, pagePath) {
  const cleanPath = pagePath === '/index.html' ? '/' : pagePath;
  return siteUrl.replace(/\/$/, '') + cleanPath;
}

function renderHead({ site, page }) {
  const url = canonicalUrl(site.siteUrl, page.path);
  const ogImage = page.ogImage
    ? `<meta property="og:image" content="${escapeHtml(site.siteUrl + page.ogImage)}" />`
    : '';
  const robots = page.noindex ? '<meta name="robots" content="noindex" />' : '';
  const jsonLd = page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : '';
  return `<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    ${robots}
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:site_name" content="${escapeHtml(site.siteName)}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    ${ogImage}
    <meta name="theme-color" content="#f5f7f9" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preload" href="/fonts/onest-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/unbounded-cyrillic-600-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/styles/site.css" />
    ${jsonLd}
  </head>`;
}

module.exports = { renderHead, canonicalUrl };
