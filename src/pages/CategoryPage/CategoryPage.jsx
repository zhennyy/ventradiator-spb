// Страница категории: фото, описание, характеристики, модели или бренды (если есть), форма заявки
// и другие категории раздела. Цены не публикуются — «Запросить цену» ведёт к форме.
import ButtonLink from '../../components/Button/Button';
import RequestForm from '../../components/RequestForm/RequestForm';
import Specs from '../../components/Specs/Specs';
import StubText from '../../components/StubText/StubText';
import VariantList from '../../components/VariantList/VariantList';
import Kinds from '../../components/Kinds/Kinds';
import Gallery from './Gallery';
import Siblings from './Siblings';
import './CategoryPage.css';

export default function CategoryPage({ section, category }) {
  // Есть модели или бренды — сначала название и они (плитки с фото и коротким описанием),
  // подробное описание категории с галереей и характеристиками — ниже, блоком «Подробнее».
  const hasVariants = category.variants?.length > 0;
  return (
    <>
      {hasVariants && (
        <section className="category-top">
          <div className="wrap">
            <p className="eyebrow">{section.title}</p>
            <h1>{category.title}</h1>
            {category.summary && <p className="category-top-lead">{category.summary}</p>}
          </div>
        </section>
      )}
      {hasVariants && <VariantList category={category} />}
      <section className={`product${hasVariants ? ' product-about' : ''}`}>
        <div className="wrap product-grid">
          {/* С моделями фото уже на плитках и в карточках — общую галерею не повторяем */}
          {!hasVariants && <Gallery category={category} />}
          <div className="product-info">
            <p className="eyebrow">{hasVariants ? 'Подробнее' : section.title}</p>
            {hasVariants ? <h2>{category.title}</h2> : <h1>{category.title}</h1>}
            <div className="product-text">
              {category.text.map((paragraph) => (
                <p key={paragraph}>
                  <StubText>{paragraph}</StubText>
                </p>
              ))}
            </div>
            <Specs rows={category.specs} />
            <div className="product-actions">
              <ButtonLink href="#request">Запросить цену</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <Kinds category={category} />
      <RequestForm product={category.title} heading={`Запросить цену: ${category.title}`} />
      <Siblings section={section} category={category} />
    </>
  );
}
