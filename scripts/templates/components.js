// Общие блоки: картинка, карточка категории, карточка объекта, заголовок раздела.
const { escapeHtml, text, pad } = require('../lib/html');

function renderImage(image, { alt, className = '', eager = false, sizes = '' } = {}) {
  const loading = eager ? 'eager' : 'lazy';
  const stubClass = image.isPlaceholder ? ' is-placeholder' : '';
  const sizesAttr = sizes ? ` sizes="${sizes}"` : '';
  return `<img class="${className}${stubClass}" src="${image.src}" alt="${escapeHtml(alt || image.title)}" width="1200" height="900" loading="${loading}" decoding="async"${sizesAttr} />`;
}

function renderCategoryCard({ section, category, index, image }) {
  return `<li class="category-card">
      <a class="category-link" href="/${section.slug}/${category.slug}.html">
        <span class="card-media">${renderImage(image, { alt: category.title })}</span>
        <span class="card-body">
          <span class="card-index">${pad(index + 1)}</span>
          <span class="card-title">${escapeHtml(category.title)}</span>
          <span class="card-text">${text(category.summary)}</span>
          <span class="card-more">Подробнее <span aria-hidden="true">→</span></span>
        </span>
      </a>
    </li>`;
}

function renderObjectCard({ object, image }) {
  return `<li class="object-card">
      <figure>
        ${renderImage(image, { alt: object.name })}
        <figcaption>
          <span class="object-city">${escapeHtml(object.city)}</span>
          <span class="object-name">${escapeHtml(object.name)}</span>
        </figcaption>
      </figure>
    </li>`;
}

function renderSectionHead({ eyebrow, title, lead, id, level = 'h2' }) {
  const idAttr = id ? ` id="${id}"` : '';
  const leadHtml = lead ? `<p class="section-lead">${text(lead)}</p>` : '';
  return `<div class="section-head">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <${level}${idAttr}>${escapeHtml(title)}</${level}>
      ${leadHtml}
    </div>`;
}

module.exports = { renderImage, renderCategoryCard, renderObjectCard, renderSectionHead };
