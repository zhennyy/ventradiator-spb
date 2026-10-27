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
  // Серия бренда: название бренда мелкой строкой над названием серии (если не совпадает с названием)
  if (variant.brand && variant.brand !== variant.title) {
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

// Содержимое плитки: фото, название, мини-описание и подпись внизу
function TileContent({ variant, more }) {
  return (
    <>
      <span className="variant-tile-media">
        <CatalogImage image={resolveImage(variant.image, variant.title)} alt="" />
      </span>
      <span className="variant-tile-body">
        {/* Не <h3>: внутри <button> заголовки не допускаются (кнопка — только строчный текст) */}
        <span className="variant-tile-title">
          <VariantName variant={variant} />
        </span>
        {/* Мини-описание: короткая подпись (short) или первое предложение описания */}
        <span className="variant-tile-text">{shortText(variant)}</span>
        {more}
      </span>
    </>
  );
}

function VariantTile({ variant, panelId, isOpen, onToggle }) {
  // Плитка-«папка»: ведёт на отдельную страницу с моделями бренда (например, все Velar)
  if (variant.href) {
    return (
      <li className="variant-tile variant-tile-link">
        <a href={variant.href}>
          <TileContent variant={variant} more={<span className="variant-tile-more">Открыть коллекцию →</span>} />
        </a>
      </li>
    );
  }
  return (
    <li className={`variant-tile${isOpen ? ' is-open' : ''}`}>
      <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}>
        <TileContent
          variant={variant}
          more={
            <span className="variant-tile-more" aria-hidden="true">
              {isOpen ? 'Свернуть' : 'Подробнее'}
            </span>
          }
        />
      </button>
    </li>
  );
}

// Фото в раскрытой карточке: основное и, если есть, дополнительные (например, в интерьере) —
// миниатюры под ним меняют большое фото
function VariantMedia({ variant }) {
  const photos = [
    { image: variant.image, title: variant.title },
    ...(variant.gallery || []).map((item) => ({ image: item.image, title: item.title || variant.title })),
  ];
  const [current, setCurrent] = useState(0);
  const main = photos[current];
  return (
    <div className="variant-media-wrap">
      <div className="variant-media">
        <CatalogImage
          key={main.image}
          image={resolveImage(main.image, main.title)}
          alt={main.title}
          sizes="(max-width: 1024px) 100vw, 600px"
        />
      </div>
      {photos.length > 1 && (
        <div className="variant-thumbs" role="group" aria-label={`Фото: ${variant.title}`}>
          {photos.map((photo, index) => (
            <button
              key={photo.image}
              type="button"
              aria-label={`Фото ${index + 1}: ${photo.title}`}
              aria-pressed={index === current}
              onClick={() => setCurrent(index)}
            >
              <img
                src={resolveImage(photo.image, photo.title).src}
                alt={`Миниатюра: ${photo.title}`}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VariantPanel({ variant, id, isOpen, onClose, panelRef }) {
  return (
    <li className="variant-panel" id={id} hidden={!isOpen} ref={isOpen ? panelRef : undefined}>
      <article className="variant">
        <VariantMedia variant={variant} />
        <div className="variant-body">
          <div className="variant-head">
            <p className="variant-name">
              <VariantName variant={variant} />
            </p>
            <button className="variant-close" type="button" onClick={() => onClose(id)}>
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

// Если у моделей есть группы (например, у Velar — «Трубчатые» и «Дизайн-радиаторы»),
// каждая группа выводится своим блоком с заголовком
export default function VariantList({ category }) {
  const variants = category.variants || [];
  const groups = [...new Set(variants.map((variant) => variant.group).filter(Boolean))];
  if (!groups.length) return <VariantGroup category={category} />;
  // Модели без группы не теряются: выводятся последним блоком с обычным заголовком
  const ungrouped = variants.filter((variant) => !variant.group);
  return (
    <>
      {groups.map((group, index) => (
        <VariantGroup
          key={group}
          category={category}
          variants={variants.filter((variant) => variant.group === group)}
          heading={group}
          idSuffix={`g${index}`}
        />
      ))}
      {ungrouped.length > 0 && <VariantGroup category={category} variants={ungrouped} idSuffix="rest" />}
    </>
  );
}

function VariantGroup({ category, variants: groupVariants, heading, idSuffix = '' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const panelRef = useRef(null);
  const columns = useColumns();
  const variants = groupVariants || category.variants || [];
  if (!variants.length) return null;
  const hasBrands = variants.some((variant) => variant.logo);
  const hasSeries = variants.some((variant) => variant.brand);
  const panelId = (index) => `variant-${category.slug || 'item'}${idSuffix}-${index}`;
  const titleId = `variants-title${idSuffix ? '-' + idSuffix : ''}`;

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

  // «Свернуть» внутри карточки: карточка прячется, фокус возвращается на её плитку (иначе он улетает в начало страницы)
  const closePanel = (id) => {
    setOpenIndex(null);
    document.querySelector(`[aria-controls="${id}"]`)?.focus();
  };

  // Карточки (скрытые, пока плитка не выбрана) стоят в сетке после каждого ряда плиток
  const rowEnd = (index) => Math.min(variants.length, Math.ceil((index + 1) / columns) * columns) - 1;

  return (
    <section className="variants" aria-labelledby={titleId}>
      <div className="wrap">
        <h2 className="variants-title" id={titleId}>
          {heading || (hasSeries ? 'Серии' : hasBrands ? 'Производители' : 'Модели в линейке')}
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
                  rowEnd(rowIndex) === index && !rowVariant.href ? (
                    <VariantPanel
                      key={rowVariant.title}
                      variant={rowVariant}
                      id={panelId(rowIndex)}
                      isOpen={openIndex === rowIndex}
                      onClose={closePanel}
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
