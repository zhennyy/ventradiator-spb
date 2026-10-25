// Модели или бренды внутри категории: например, L2–L5 в «Вентиляционных установках Blizzard»
// или Kohr и Velar в «Трубчатых радиаторах». Сначала — плитки с фото и названием (логотипом);
// по нажатию под плитками раскрывается карточка: описание и характеристики. Все карточки есть
// в разметке (пререндер, поисковики), просто скрыты, пока плитка не выбрана.
import { Fragment, useEffect, useRef, useState } from 'react';
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
          {/* Мини-описание: короткая подпись (short) или первое предложение описания */}
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
    <li className="variant-panel" id={id} hidden={!isOpen} ref={isOpen ? panelRef : undefined}>
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
    </li>
  );
}

// Сколько плиток в ряду — как в CSS: 4 на ноутбуке, 3 на планшете, 2 на телефоне
const COLUMN_QUERIES = [
  ['(max-width: 600px)', 2],
  ['(max-width: 1024px)', 3],
];
function useColumns() {
  const [columns, setColumns] = useState(4);
  useEffect(() => {
    const lists = COLUMN_QUERIES.map(([query]) => window.matchMedia(query));
    const update = () => setColumns(COLUMN_QUERIES.find((_, index) => lists[index].matches)?.[1] ?? 4);
    update();
    lists.forEach((list) => list.addEventListener('change', update));
    return () => lists.forEach((list) => list.removeEventListener('change', update));
  }, []);
  return columns;
}

export default function VariantList({ category }) {
  const [openIndex, setOpenIndex] = useState(null);
  const panelRef = useRef(null);
  const columns = useColumns();
  if (!category.variants?.length) return null;
  const variants = category.variants;
  const hasBrands = variants.some((variant) => variant.logo);
  const hasSeries = variants.some((variant) => variant.brand);
  const panelId = (index) => `variant-${category.slug || 'item'}-${index}`;

  const toggle = (index) => {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    // Карточка раскрывается сразу под рядом нажатой плитки. Страницу не двигаем —
    // только если низ карточки ушёл за экран, мягко докручиваем ровно настолько, насколько нужно.
    if (next !== null) {
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const { bottom, top } = panel.getBoundingClientRect();
        if (bottom > window.innerHeight && top > window.innerHeight * 0.35) {
          window.scrollBy({ top: Math.min(bottom - window.innerHeight + 16, top - 120), behavior: 'smooth' });
        }
      });
    }
  };

  // Карточки (скрытые, пока плитка не выбрана) стоят в сетке после каждого ряда плиток
  const rowEnd = (index) => Math.min(variants.length, Math.ceil((index + 1) / columns) * columns) - 1;

  return (
    <section className="variants" aria-labelledby="variants-title">
      <div className="wrap">
        <h2 className="variants-title" id="variants-title">
          {hasSeries ? 'Серии' : hasBrands ? 'Производители' : 'Модели в линейке'}
          <span className="variants-count">{variants.length}</span>
        </h2>
        <ul className="variant-tiles">
          {variants.map((variant, index) => (
            <Fragment key={variant.title}>
              <VariantTile
                variant={variant}
                panelId={panelId(index)}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
              {rowEnd(index) === index &&
                variants.map((rowVariant, rowIndex) =>
                  rowEnd(rowIndex) === index ? (
                    <VariantPanel
                      key={rowVariant.title}
                      variant={rowVariant}
                      id={panelId(rowIndex)}
                      isOpen={openIndex === rowIndex}
                      onClose={() => setOpenIndex(null)}
                      panelRef={panelRef}
                    />
                  ) : null,
                )}
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
