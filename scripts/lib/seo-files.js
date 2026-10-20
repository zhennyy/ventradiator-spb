// sitemap.xml и robots.txt по списку страниц.
const { canonicalUrl } = require('../templates/head');

function renderSitemap(siteUrl, pages) {
  const urls = pages
    .filter((page) => !page.noindex)
    .map((page) => `  <url><loc>${canonicalUrl(siteUrl, page.path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobots(siteUrl) {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml
`;
}

module.exports = { renderSitemap, renderRobots };
