// Страница направления (вентиляция / пылеудаление): вступление, преимущества и сетка категорий.
const { escapeHtml, text, joinHtml } = require('../lib/html');
const { renderCategoryCard } = require('./components');

function renderBenefits(benefits) {
  if (!benefits.length) return '';
  const items = joinHtml(
    benefits,
    ([title, body]) => `<li><span class="benefit-title">${escapeHtml(title)}</span><span>${text(body)}</span></li>`,
  );
  return `<ul class="benefits" aria-label="Преимущества">${items}</ul>`;
}

function renderSection({ section, resolveImage }) {
  const cards = section.categories
    .map((category, index) =>
      renderCategoryCard({ section, category, index, image: resolveImage(category.image, category.title) }),
    )
    .join('');
  const intro = joinHtml(section.intro, (paragraph) => `<p>${text(paragraph)}</p>`);
  return `<section class="page-hero">
    <div class="wrap page-hero-grid">
      <div>
        <p class="eyebrow">Каталог · ${section.categories.length} категорий</p>
        <h1>${escapeHtml(section.title)}</h1>
      </div>
      <div class="page-hero-text">${intro}</div>
    </div>
    <div class="wrap">${renderBenefits(section.benefits)}</div>
  </section>
  <section class="catalog" aria-label="Категории">
    <div class="wrap">
      <ul class="category-grid">${cards}</ul>
    </div>
  </section>`;
}

module.exports = { renderSection };
