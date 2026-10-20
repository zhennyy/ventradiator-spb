// Объекты, «О компании», контакты и страница 404.
const { escapeHtml, text, phoneHref, joinHtml } = require('../lib/html');
const { renderObjectCard, renderSectionHead } = require('./components');
const { renderRequestForm } = require('./request-form');

function renderPageHero({ eyebrow, title, lead }) {
  return `<section class="page-hero">
    <div class="wrap page-hero-grid">
      <div>
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(title)}</h1>
      </div>
      <div class="page-hero-text"><p>${text(lead)}</p></div>
    </div>
  </section>`;
}

function renderObjects({ site, resolveImage }) {
  const card = (object) => renderObjectCard({ object, image: resolveImage(object.image, object.name, 'object') });
  const local = site.objects.filter((object) => object.city === 'Санкт-Петербург');
  const others = site.objects.filter((object) => object.city !== 'Санкт-Петербург');
  return `${renderPageHero({
    eyebrow: 'Объекты с системами Blizzard',
    title: 'Объекты',
    lead: `В СНГ ${site.objectsTotal} объектов с системами Blizzard. Среди них — театры, музеи, храмы и гостиницы.`,
  })}
  <section class="objects-page">
    <div class="wrap">
      <h2 class="group-title">Санкт-Петербург</h2>
      <ul class="object-grid">${local.map(card).join('')}</ul>
      <h2 class="group-title">Другие города</h2>
      <ul class="object-grid">${others.map(card).join('')}</ul>
      <p class="table-note">Объекты с системами Blizzard. Подборка из ${site.objectsTotal} объектов в СНГ.</p>
    </div>
  </section>`;
}

function renderAbout({ site }) {
  const reasons = joinHtml(
    site.reasons,
    ([title, body]) => `<div><dt>${escapeHtml(title)}</dt><dd>${text(body)}</dd></div>`,
  );
  return `${renderPageHero({
    eyebrow: 'О компании',
    title: 'BLIZZARD lufttechnik',
    lead: 'Немецкий производитель систем вентиляции с рекуперацией тепла и центральных пылесосов.',
  })}
  <section class="about">
    <div class="wrap about-grid">
      <div class="prose">
        <p>Продукция ${escapeHtml(site.brand)} ${escapeHtml(site.brandSuffix)} производится в Германии. Производственные площадки также есть в Швейцарии, Нидерландах и Бельгии.</p>
        <p>Компания работает в разных странах через собственные филиалы и авторизованных партнёров. В Санкт-Петербурге работает офис представительства — здесь можно запросить цену и подобрать оборудование для дома или квартиры в Петербурге и Ленинградской области.</p>
        <p>Два направления — <a href="/ventilation.html">вентиляция</a> и <a href="/dust-removal.html">пылеудаление</a>. В СНГ ${site.objectsTotal} <a href="/objects.html">объектов с системами Blizzard</a>.</p>
      </div>
      <aside class="legal-card" aria-label="Юридическое лицо производителя">
        <p class="eyebrow">Производитель</p>
        <p class="legal-name">${escapeHtml(site.legal.company)}</p>
        <p>${escapeHtml(site.legal.city)}, Германия<br />Торговый реестр: ${escapeHtml(site.legal.register)}</p>
        <p class="eyebrow">Представительство в СПб</p>
        <p>${text(site.legal.representative)}</p>
      </aside>
    </div>
    <div class="wrap">
      ${renderSectionHead({ eyebrow: 'Принципы', title: 'Почему Blizzard' })}
      <dl class="specs specs-wide">${reasons}</dl>
    </div>
  </section>`;
}

function renderOffice(office, site) {
  const phones = office.phones
    .map((phone) => `<a class="office-phone" href="${phoneHref(phone)}">${escapeHtml(phone)}</a>`)
    .join('');
  return `<article class="office">
      <p class="eyebrow">${escapeHtml(office.region)}</p>
      <h2>${escapeHtml(office.title)}</h2>
      <div class="office-phones">${phones}</div>
      <dl class="specs">
        <div><dt>Адрес</dt><dd>${text(office.address)}</dd></div>
        <div><dt>Почта</dt><dd><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></dd></div>
      </dl>
    </article>`;
}

function renderContacts({ site }) {
  return `${renderPageHero({
    eyebrow: 'Контакты',
    title: 'Контакты',
    lead: 'Представительство Blizzard в Санкт-Петербурге: подбор вентиляции и центральных пылесосов для домов и квартир в Петербурге и Ленинградской области.',
  })}
  <section class="contacts">
    <div class="wrap office-grid">${site.offices.map((office) => renderOffice(office, site)).join('')}</div>
  </section>
  ${renderRequestForm({ site, heading: 'Написать в представительство' })}`;
}

function renderNotFound() {
  return `<section class="page-hero not-found">
    <div class="wrap">
      <p class="eyebrow">Ошибка 404</p>
      <h1>Страница не найдена</h1>
      <p class="section-lead">Возможно, адрес изменился. Начните с каталога:</p>
      <div class="hero-actions">
        <a class="button button-primary" href="/ventilation.html">Вентиляция</a>
        <a class="button button-ghost" href="/dust-removal.html">Пылеудаление</a>
      </div>
    </div>
  </section>`;
}

module.exports = { renderObjects, renderAbout, renderContacts, renderNotFound };
