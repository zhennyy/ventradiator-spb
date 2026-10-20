// Подвал: разделы каталога, контакты, юридическая информация и ссылки на документы.
const { escapeHtml, text, phoneHref } = require('../lib/html');
const { renderLogo } = require('./header');

function renderSectionColumn(section) {
  const links = section.categories
    .map((category) => `<li><a href="/${section.slug}/${category.slug}.html">${escapeHtml(category.title)}</a></li>`)
    .join('');
  return `<div class="footer-col">
        <p class="footer-title"><a href="/${section.slug}.html">${escapeHtml(section.title)}</a></p>
        <ul>${links}</ul>
      </div>`;
}

function renderFooter({ site, catalog }) {
  const office = site.offices[0];
  const phones = office.phones.map((phone) => `<a href="${phoneHref(phone)}">${escapeHtml(phone)}</a>`).join('<br />');
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        ${renderLogo(site)}
        <p>Тихая вентиляция с рекуперацией тепла и центральные пылесосы. Сделано в Германии.</p>
      </div>
      ${catalog.sections.map(renderSectionColumn).join('\n')}
      <div class="footer-col">
        <p class="footer-title">Контакты</p>
        <p>${phones}<br /><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></p>
        <p>${text(office.address)}</p>
        <ul>
          <li><a href="/objects.html">Объекты</a></li>
          <li><a href="/about.html">О компании</a></li>
          <li><a href="/contacts.html">Все контакты</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap">
      <div class="footer-legal">
      <p>© ${year} Представительство ${escapeHtml(site.brand)} ${escapeHtml(site.brandSuffix)} в Санкт-Петербурге. ${text(site.legal.representative)}</p>
      <p>Производитель: ${escapeHtml(site.legal.company)}, ${escapeHtml(site.legal.city)}, ${escapeHtml(site.legal.register)}</p>
      <p><a href="/privacy.html">Политика обработки персональных данных</a> · <a href="/consent.html">Согласие на обработку данных</a></p>
      </div>
    </div>
  </footer>`;
}

module.exports = { renderFooter };
