// Модели или бренды внутри категории: например, L2–L5 в «Вентиляционных установках Blizzard»
// или Kohr и Velar в «Трубчатых радиаторах». Сначала — плитки с фото и названием (логотипом);
// по нажатию под плитками раскрывается карточка: описание и характеристики. Все карточки есть
// в разметке (пререндер, поисковики), просто скрыты, пока плитка не выбрана.
import { useRef, useState } from 'react';
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import Specs from '../Specs/Specs';
import StubText from '../StubText/StubText';
import './VariantList.css';

function shortText(variant) {
  if (variant.short) return variant.short;
  const first = (variant.text?.[0] || '').replace(/\[[^\]]*\]/g, '').trim();
  const match = first.match(/^.+?[.!?](?=\s|$)/);
  return match ? match[0] : first;
}

function VariantName({ variant }) {
  // Серия бренда: название бренда мелкой строкой над названием серии
  if (variant.brand) {
    return (
      <>
        <span className="variant-brand">{variant.brand}</span>
        <span className="variant-series">{variant.title}</span>
      </>
    );
  }
  return variant.logo ? (
    <img
      className="variant-logo"
      src={resolveImage(variant.logo, variant.title).src}
      alt={variant.title}
      loading="lazy"
      decoding="async"
    />
  ) : (
    variant.title
  );
}

function VariantTile({ variant, panelId, isOpen, onToggle }) {
  return (
    <li className={`variant-tile${isOpen ? ' is-open' : ''}`}>
      <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}>
        <span className="variant-tile-media">
          <CatalogImage image={resolveImage(variant.image, variant.title)} alt="" />
        </span>
        <span className="variant-tile-body">
          <h3>
            <VariantName variant={variant} />
          </h3>
          {/* Мини-описание: первое предложение описания модели */}
          <span className="variant-tile-text">{shortText(variant)}</span>
          <span className="variant-tile-more" aria-hidden="true">
            {isOpen ? 'Свернуть' : 'Подробнее'}
          </span>
        </span>
      </button>
    </li>
  );
}

function VariantPanel({ variant, id, isOpen, onClose, panelRef }) {
  return (
    <div className="variant-panel" id={id} hidden={!isOpen} ref={isOpen ? panelRef : undefined}>
      <article className="variant">
        <div className="variant-media">
          <CatalogImage image={resolveImage(variant.image, variant.title)} alt={variant.title} />
        </div>
        <div className="variant-body">
          <div className="variant-head">
            <p className="variant-name">
              <VariantName variant={variant} />
            </p>
            <button className="variant-close" type="button" onClick={onClose}>
              Свернуть <span aria-hidden="true">×</span>
            </button>
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
      </article>
    </div>
  );
}

export default function VariantList({ category }) {
  const [openIndex, setOpenIndex] = useState(null);
  const panelRef = useRef(null);
  if (!category.variants?.length) return null;
  const hasBrands = category.variants.some((variant) => variant.logo);
  const hasSeries = category.variants.some((variant) => variant.brand);
  const panelId = (index) => `variant-${category.slug || 'item'}-${index}`;

  const toggle = (index) => {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    // Карточка раскрывается под плитками — на телефоне подкручиваем к ней, чтобы было видно
    if (next !== null) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  };

  return (
    <section className="variants" aria-labelledby="variants-title">
      <div className="wrap">
        <h2 className="variants-title" id="variants-title">
          {hasSeries ? 'Серии' : hasBrands ? 'Производители' : 'Модели в линейке'}
          <span className="variants-count">{category.variants.length}</span>
        </h2>
        <ul className="variant-tiles">
          {category.variants.map((variant, index) => (
            <VariantTile
              key={variant.title}
              variant={variant}
              panelId={panelId(index)}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </ul>
        {category.variants.map((variant, index) => (
          <VariantPanel
            key={variant.title}
            variant={variant}
            id={panelId(index)}
            isOpen={openIndex === index}
            onClose={() => setOpenIndex(null)}
            panelRef={panelRef}
          />
        ))}
      </div>
    </section>
  );
}
