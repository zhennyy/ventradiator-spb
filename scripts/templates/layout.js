// Каркас страницы: head, шапка, хлебные крошки, содержимое, подвал и скрипты.
const { escapeHtml } = require('../lib/html');
const { renderHead } = require('./head');
const { renderHeader } = require('./header');
const { renderFooter } = require('./footer');

function renderBreadcrumbs(crumbs) {
  if (!crumbs || crumbs.length === 0) return '';
  const items = [{ href: '/', label: 'Главная' }, ...crumbs]
    .map((crumb, index, all) => {
      const isLast = index === all.length - 1;
      return isLast
        ? `<li><span aria-current="page">${escapeHtml(crumb.label)}</span></li>`
        : `<li><a href="${crumb.href}">${escapeHtml(crumb.label)}</a></li>`;
    })
    .join('');
  return `<nav class="breadcrumbs wrap" aria-label="Хлебные крошки"><ol>${items}</ol></nav>`;
}

function renderPage({ site, catalog, page, content }) {
  return `<!doctype html>
<html lang="ru">
  ${renderHead({ site, page })}
  <body class="${page.bodyClass || ''}">
  ${renderHeader({ site, catalog, currentPath: page.path, hasForm: page.hasForm })}
  <main id="main" tabindex="-1">
    ${renderBreadcrumbs(page.breadcrumbs)}
    ${content}
  </main>
  ${renderFooter({ site, catalog })}
  <script src="/scripts/menu.js" defer></script>
  <script src="/scripts/request-form.js" defer></script>
  </body>
</html>
`;
}

module.exports = { renderPage };
