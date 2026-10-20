// sitemap.xml и robots.txt по списку страниц (страницы с noindex в sitemap не попадают).
import { canonicalUrl, normalizeSiteUrl } from './seo';

export function renderSitemap(siteUrl, pageList) {
  const urls = pageList
    .filter((page) => !page.noindex)
    .map((page) => `  <url><loc>${canonicalUrl(siteUrl, page.path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function renderRobots(siteUrl) {
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${normalizeSiteUrl(siteUrl)}/sitemap.xml
`;
}
