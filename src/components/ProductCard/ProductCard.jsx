// Карточка категории каталога: фото, номер, название, краткое описание и «Подробнее →».
// Карточки выводятся списком <ul class="category-grid"> (раздел каталога и «Ещё в разделе»).
import { categoryPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import StubText from '../StubText/StubText';
import './ProductCard.css';

export default function ProductCard({ section, category, index }) {
  return (
    <li className="category-card">
      <a className="category-link" href={categoryPath(section, category)}>
        <span className="card-media">
          <CatalogImage image={resolveImage(category.image, category.title)} alt={category.title} />
        </span>
        <span className="card-body">
          <span className="card-index">{`Поз. ${index + 1}`}</span>
          <span className="card-title">{category.title}</span>
          <span className="card-text">
            <StubText>{category.summary}</StubText>
          </span>
          <span className="card-more">
            Подробнее <span aria-hidden="true">→</span>
          </span>
        </span>
      </a>
    </li>
  );
}
