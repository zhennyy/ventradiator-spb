// Серверный рендер для сборки (npm run build:server → dist-server/entry-server.js).
// scripts/prerender.js берёт отсюда список страниц, HTML каждой страницы, теги <head>, заглушки картинок и sitemap.
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import Head from './components/Head/Head';
import PlaceholderSvg from './components/Placeholder/PlaceholderSvg';
import { listImages, ogCoverSrc } from './lib/images';
import { pages, pageUrls, ROUTER_FUTURE } from './lib/routes';
import { getHeadMeta } from './lib/seo';
import { renderRobots, renderSitemap } from './lib/seo-files';

export { listImages, ogCoverSrc, pages, renderRobots, renderSitemap };

// HTML содержимого страницы (внутри #root) — тот же, что потом гидратирует src/main.jsx.
export function renderPage(page) {
  return renderToString(
    <StaticRouter location={pageUrls(page)[0]} future={ROUTER_FUTURE}>
      <App />
    </StaticRouter>,
  );
}

export function renderHead(page, { siteUrl } = {}) {
  return renderToStaticMarkup(<Head meta={getHeadMeta(page, { siteUrl })} />);
}

export function renderPlaceholder(image) {
  return (
    renderToStaticMarkup(<PlaceholderSvg title={image.title} fileName={image.fileName} kind={image.kind} />) + '\n'
  );
}
