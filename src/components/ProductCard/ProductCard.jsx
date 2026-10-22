// Карточка категории каталога: фото, строка «что внутри» (логотипы брендов, модели или число артикулов),
// название, краткое описание и нижняя строка «Смотреть →». Вся карточка — одна ссылка.
// Карточки выводятся списком <ul class="category-grid"> (раздел каталога и «Ещё в разделе»).
import { categoryPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import { plural } from '../../lib/text';
import CatalogImage from '../CatalogImage/CatalogImage';
import StubText from '../StubText/StubText';
import './ProductCard.css';

// Что показать над названием: логотипы брендов, названия моделей или сколько артикулов в таблице
function CardMeta({ category }) {
  const variants = category.variants || [];
  const logos = variants.filter((variant) => variant.logo);
  if (logos.length) {
    return (
      <span className="card-logos" aria-hidden="true">
        {logos.map((variant) => (
          <img
            key={variant.title}
            src={resolveImage(variant.logo, variant.title).src}
            alt={`Логотип ${variant.title}`}
            loading="lazy"
            decoding="async"
          />
        ))}
      </span>
    );
  }
  if (variants.length) return <span className="card-meta">{variants.map((variant) => variant.title).join(' · ')}</span>;
  const rows = category.models?.rows?.length;
  if (rows) return <span className="card-meta">{plural(rows, ['артикул', 'артикула', 'артикулов'])}</span>;
  return null;
}

export default function ProductCard({ section, category }) {
  return (
    <li className="category-card" id={`cat-${category.slug}`}>
      <a className="category-link" href={categoryPath(section, category)}>
        <span className="card-media">
          <CatalogImage image={resolveImage(category.image, category.title)} alt={category.title} />
        </span>
        <span className="card-body">
          <CardMeta category={category} />
          <span className="card-title">{category.title}</span>
          <span className="card-text">
            <StubText>{category.summary}</StubText>
          </span>
        </span>
        <span className="card-foot">
          Смотреть
          <span className="card-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </a>
    </li>
  );
}
