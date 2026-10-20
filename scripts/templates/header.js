// Шапка: логотип, меню с выпадающими списками разделов, телефон и мобильное меню.
const { escapeHtml, phoneHref } = require('../lib/html');

function renderDropdown(section, currentPath) {
  const menuId = `menu-${section.slug}`;
  const sectionPath = `/${section.slug}.html`;
  const isCurrent = currentPath === sectionPath || currentPath.startsWith(`/${section.slug}/`);
  const links = section.categories
    .map((category) => {
      const href = `/${section.slug}/${category.slug}.html`;
      const current = href === currentPath ? ' aria-current="page"' : '';
      return `<li><a href="${href}"${current}>${escapeHtml(category.title)}</a></li>`;
    })
    .join('');
  return `<li class="nav-item has-dropdown" data-dropdown>
        <a class="nav-link${isCurrent ? ' is-current' : ''}" href="${sectionPath}"${currentPath === sectionPath ? ' aria-current="page"' : ''}>${escapeHtml(section.navTitle)}</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="${menuId}" aria-label="Подменю: ${escapeHtml(section.navTitle)}">
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
        </button>
        <div class="dropdown" id="${menuId}">
          <p class="dropdown-title">${escapeHtml(section.title)}</p>
          <ul>${links}</ul>
          <a class="dropdown-all" href="${sectionPath}">Весь раздел →</a>
        </div>
      </li>`;
}

function renderSimpleLink(href, label, currentPath) {
  const current = href === currentPath ? ' aria-current="page"' : '';
  return `<li class="nav-item"><a class="nav-link" href="${href}"${current}>${label}</a></li>`;
}

function renderLogo(site) {
  return `<a class="logo" href="/" aria-label="${escapeHtml(site.brand)} ${escapeHtml(site.brandSuffix)} — на главную">
      <svg class="logo-mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path d="M7 12h12a3 3 0 1 0-3-3M7 17h17a3 3 0 1 1-3 3M7 22h8" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span class="logo-text"><b>${escapeHtml(site.brand)}</b><span>${escapeHtml(site.brandSuffix)} · Санкт-Петербург</span></span>
    </a>`;
}

function renderHeader({ site, catalog, currentPath, hasForm }) {
  const requestHref = hasForm ? '#request' : '/contacts.html#request';
  const phone = site.offices[0].phones[0];
  const dropdowns = catalog.sections.map((section) => renderDropdown(section, currentPath)).join('\n');
  return `<a class="skip-link" href="#main">Перейти к содержанию</a>
  <header class="site-header">
    <div class="wrap header-row">
      ${renderLogo(site)}
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-button>
        <span class="menu-icon" aria-hidden="true"><i></i><i></i></span>
        <span class="menu-label">Меню</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Основное меню">
        <ul class="nav-list">
      ${dropdowns}
      ${renderSimpleLink('/objects.html', 'Объекты', currentPath)}
      ${renderSimpleLink('/about.html', 'О компании', currentPath)}
      ${renderSimpleLink('/contacts.html', 'Контакты', currentPath)}
        </ul>
        <div class="nav-actions">
          <a class="header-phone" href="${phoneHref(phone)}">${escapeHtml(phone)}</a>
          <a class="button button-small button-primary" href="${requestHref}">Запросить цену</a>
        </div>
      </nav>
    </div>
  </header>`;
}

module.exports = { renderHeader, renderLogo };
