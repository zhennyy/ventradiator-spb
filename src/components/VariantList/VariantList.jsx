// Модели или бренды внутри категории: например, L2, L3 и L5 в «Вентиляционных установках Blizzard»
// или Kohr и Velar в «Трубчатых радиаторах». Компактная горизонтальная карточка: фото слева,
// логотип бренда (если есть), название, короткое описание и ключевые характеристики справа.
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import Specs from '../Specs/Specs';
import StubText from '../StubText/StubText';
import './VariantList.css';

function VariantCard({ variant }) {
  return (
    <li className="variant">
      <div className="variant-media">
        <CatalogImage image={resolveImage(variant.image, variant.title)} alt={variant.title} />
      </div>
      <div className="variant-body">
        <div className="variant-head">
          {/* С логотипом название не дублируем: логотип и есть заголовок, его alt — название бренда */}
          <h3>
            {variant.logo ? (
              <img
                className="variant-logo"
                src={resolveImage(variant.logo, variant.title).src}
                alt={variant.title}
                loading="lazy"
                decoding="async"
              />
            ) : (
              variant.title
            )}
          </h3>
        </div>
        <div className="variant-text">
          {variant.text.map((paragraph) => (
            <p key={paragraph}>
              <StubText>{paragraph}</StubText>
            </p>
          ))}
        </div>
        <Specs rows={variant.specs || []} />
      </div>
    </li>
  );
}

export default function VariantList({ category }) {
  if (!category.variants?.length) return null;
  const hasBrands = category.variants.some((variant) => variant.logo);
  return (
    <section className="variants" aria-labelledby="variants-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">{hasBrands ? 'Бренды' : 'Серии'}</p>
          <h2 id="variants-title">{hasBrands ? 'Производители' : 'Модели в линейке'}</h2>
        </div>
        <ul className="variant-list">
          {category.variants.map((variant) => (
            <VariantCard key={variant.title} variant={variant} />
          ))}
        </ul>
      </div>
    </section>
  );
}
