// Страница категории: фото, описание, характеристики, таблица моделей и артикулов, форма заявки.
const { escapeHtml, text, isStub, joinHtml } = require('../lib/html');
const { renderImage, renderCategoryCard } = require('./components');
const { renderRequestForm } = require('./request-form');

function renderGallery(category, resolveImage) {
  const main = resolveImage(category.image, category.title);
  const extra = (category.gallery || []).map((item) => resolveImage(item.image, item.title));
  const thumbs = extra.length
    ? `<div class="gallery-extra">${extra.map((image) => renderImage(image)).join('')}</div>`
    : '';
  return `<div class="gallery">
      ${renderImage(main, { alt: category.title, className: 'gallery-main', eager: true })}
      ${thumbs}
    </div>`;
}

function renderSpecs(specs) {
  if (!specs.length) return '';
  const rows = joinHtml(specs, ([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${text(value)}</dd></div>`);
  return `<dl class="specs">${rows}</dl>`;
}

function renderCell(value, index) {
  const tag = index === 0 ? 'th scope="row"' : 'td';
  const closing = index === 0 ? 'th' : 'td';
  const stubClass = isStub(value) ? ' class="is-stub"' : '';
  return `<${tag}${stubClass}>${text(value)}</${closing}>`;
}

function renderModels(category) {
  const { columns, rows, caption } = category.models;
  const head = columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join('');
  const body = rows.map((row) => `<tr>${row.map(renderCell).join('')}</tr>`).join('');
  const captionHtml = caption ? `<p class="table-note">${text(caption)}</p>` : '';
  return `<section class="models" aria-labelledby="models-title">
    <div class="wrap">
      <div class="models-head">
        <h2 id="models-title">Модели и артикулы</h2>
        <p>Цены по запросу — стоимость зависит от комплектации.</p>
      </div>
      <div class="table-scroll" tabindex="0" role="region" aria-labelledby="models-title">
        <table class="models-table">
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      ${captionHtml}
    </div>
  </section>`;
}

function renderSiblings(section, category, resolveImage) {
  const others = section.categories.filter((item) => item.slug !== category.slug);
  const cards = others
    .slice(0, 4)
    .map((item) =>
      renderCategoryCard({
        section,
        category: item,
        index: section.categories.indexOf(item),
        image: resolveImage(item.image, item.title),
      }),
    )
    .join('');
  return `<section class="siblings" aria-labelledby="siblings-title">
    <div class="wrap">
      <div class="strip-head">
        <h2 id="siblings-title">Ещё в разделе «${escapeHtml(section.title)}»</h2>
        <a class="button button-ghost" href="/${section.slug}.html">Все категории</a>
      </div>
      <ul class="category-grid category-grid-compact">${cards}</ul>
    </div>
  </section>`;
}

function renderCategory({ site, section, category, resolveImage }) {
  const paragraphs = joinHtml(category.text, (paragraph) => `<p>${text(paragraph)}</p>`);
  return `<section class="product">
    <div class="wrap product-grid">
      ${renderGallery(category, resolveImage)}
      <div class="product-info">
        <p class="eyebrow">${escapeHtml(section.title)}</p>
        <h1>${escapeHtml(category.title)}</h1>
        <div class="product-text">${paragraphs}</div>
        ${renderSpecs(category.specs)}
        <div class="product-actions">
          <a class="button button-primary" href="#request">Запросить цену</a>
          <a class="button button-ghost" href="#models-title">Модели и артикулы</a>
        </div>
      </div>
    </div>
  </section>
  ${renderModels(category)}
  ${renderRequestForm({ site, product: category.title, heading: `Запросить цену: ${category.title}` })}
  ${renderSiblings(section, category, resolveImage)}`;
}

module.exports = { renderCategory };
