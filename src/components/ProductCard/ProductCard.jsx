// Карточка категории каталога: фото, строка «что внутри» (логотипы брендов или модели),
// название, краткое описание и нижняя строка «Смотреть →». Вся карточка — одна ссылка.
// Карточки выводятся списком <ul class="category-grid"> (раздел каталога и «Ещё в разделе»).
import { categoryPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import StubText from '../StubText/StubText';
import './ProductCard.css';

// Что показать над названием: логотипы брендов или названия моделей
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
  // Серии брендов — показываем бренды, а не все серии подряд
  const brands = [...new Set(variants.map((variant) => variant.brand).filter(Boolean))];
  if (brands.length) return <span className="card-meta">{brands.join(' · ')}</span>;
  if (variants.length) return <span className="card-meta">{variants.map((variant) => variant.title).join(' · ')}</span>;
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
