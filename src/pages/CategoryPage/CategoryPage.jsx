// Страница категории: фото, описание, характеристики, модели или бренды (если есть), таблица артикулов, форма заявки
// и другие категории раздела. Цены не публикуются — «Запросить цену» ведёт к форме.
import ButtonLink from '../../components/Button/Button';
import ModelsTable from '../../components/ModelsTable/ModelsTable';
import RequestForm from '../../components/RequestForm/RequestForm';
import Specs from '../../components/Specs/Specs';
import StubText from '../../components/StubText/StubText';
import VariantList from '../../components/VariantList/VariantList';
import Gallery from './Gallery';
import Siblings from './Siblings';
import './CategoryPage.css';

export default function CategoryPage({ section, category }) {
  return (
    <>
      <section className="product">
        <div className="wrap product-grid">
          <Gallery category={category} />
          <div className="product-info">
            <p className="eyebrow">{section.title}</p>
            <h1>{category.title}</h1>
            <div className="product-text">
              {category.text.map((paragraph) => (
                <p key={paragraph}>
                  <StubText>{paragraph}</StubText>
                </p>
              ))}
            </div>
            <Specs rows={category.specs} />
            <div className="product-actions">
              {category.variants?.length > 0 && (
                <ButtonLink href="#variants-title" variant="ghost">
                  {category.variants.some((variant) => variant.logo) ? 'Производители' : 'Модели в линейке'}
                </ButtonLink>
              )}
              {category.models && !category.variants?.length && (
                <ButtonLink href="#models-title" variant="ghost">
                  Модели и артикулы
                </ButtonLink>
              )}
              {/* Сначала посмотреть, что внутри, затем — главная тёмная кнопка */}
              <ButtonLink href="#request">Запросить цену</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <VariantList category={category} />
      {category.models && <ModelsTable models={category.models} />}
      <RequestForm product={category.title} heading={`Запросить цену: ${category.title}`} />
      <Siblings section={section} category={category} />
    </>
  );
}
