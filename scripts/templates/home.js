// Главная: первый экран, два направления, почему Blizzard, объекты и форма заявки.
const { escapeHtml, text, pad, joinHtml } = require('../lib/html');
const { renderHeroDrawing } = require('./hero-drawing');
const { renderImage, renderObjectCard, renderSectionHead } = require('./components');
const { renderRequestForm } = require('./request-form');

function renderHero(site) {
  const facts = joinHtml(
    site.facts,
    ([value, label]) =>
      `<li><span class="fact-value">${escapeHtml(value)}</span><span class="fact-label">${escapeHtml(label)}</span></li>`,
  );
  return `<section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Представительство в Санкт-Петербурге · Made in Germany</p>
        <h1>Тихая немецкая вентиляция <span class="accent">и&nbsp;чистый воздух</span> в&nbsp;доме</h1>
        <p class="hero-lead">Приточно-вытяжные установки с рекуперацией тепла и центральные пылесосы Blizzard для квартир и домов в Санкт-Петербурге и Ленинградской области.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#request">Запросить цену</a>
          <a class="button button-ghost" href="#directions">Смотреть каталог</a>
        </div>
      </div>
      ${renderHeroDrawing()}
    </div>
    <div class="wrap"><ul class="facts">${facts}</ul></div>
  </section>`;
}

function renderDirection(section, index, resolveImage) {
  const image = resolveImage(section.image, section.title);
  const links = section.categories
    .slice(0, 6)
    .map((category) => `<li><a href="/${section.slug}/${category.slug}.html">${escapeHtml(category.title)}</a></li>`)
    .join('');
  return `<article class="direction">
      <a class="direction-media" href="/${section.slug}.html" tabindex="-1" aria-hidden="true">${renderImage(image, { alt: section.title })}</a>
      <div class="direction-body">
        <p class="direction-index">${pad(index + 1)} / ${escapeHtml(section.title)}</p>
        <h3><a href="/${section.slug}.html">${escapeHtml(section.title)}</a></h3>
        <p>${text(section.summary)}</p>
        <ul class="direction-links">${links}</ul>
        <a class="button button-ghost" href="/${section.slug}.html">Весь раздел: ${section.categories.length} категорий</a>
      </div>
    </article>`;
}

function renderReasons(site) {
  const items = site.reasons
    .map(
      ([title, body], index) => `<li class="reason">
        <span class="reason-index">${pad(index + 1)}</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${text(body)}</p>
      </li>`,
    )
    .join('');
  return `<section class="reasons" aria-labelledby="reasons-title">
    <div class="wrap">
      ${renderSectionHead({ eyebrow: 'Почему Blizzard', title: 'Инженерия, которую не слышно', id: 'reasons-title' })}
      <ol class="reason-grid">${items}</ol>
    </div>
  </section>`;
}

function renderObjectsStrip(site, resolveImage) {
  const cards = site.objects
    .slice(0, 4)
    .map((object) => renderObjectCard({ object, image: resolveImage(object.image, object.name, 'object') }))
    .join('');
  return `<section class="objects-strip" aria-labelledby="objects-title">
    <div class="wrap">
      <div class="strip-head">
        ${renderSectionHead({ eyebrow: 'Объекты с системами Blizzard', title: `${site.objectsTotal} объектов в СНГ`, id: 'objects-title' })}
        <a class="button button-ghost" href="/objects.html">Все объекты</a>
      </div>
      <ul class="object-grid">${cards}</ul>
    </div>
  </section>`;
}

function renderHome({ site, catalog, resolveImage }) {
  const directions = catalog.sections.map((section, index) => renderDirection(section, index, resolveImage)).join('');
  return `${renderHero(site)}
  <section class="directions" id="directions" aria-labelledby="directions-title">
    <div class="wrap">
      ${renderSectionHead({ eyebrow: 'Каталог', title: 'Два направления', id: 'directions-title', lead: 'Свежий воздух без потерь тепла и уборка без пыли в воздухе. Системы Blizzard для квартир и частных домов.' })}
      <div class="direction-grid">${directions}</div>
    </div>
  </section>
  ${renderReasons(site)}
  ${renderObjectsStrip(site, resolveImage)}
  ${renderRequestForm({ site })}`;
}

module.exports = { renderHome };
