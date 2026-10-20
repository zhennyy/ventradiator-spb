// Страница категории: фото, описание, характеристики, таблица моделей и артикулов, форма заявки
// и другие категории раздела. Цены не публикуются — «Запросить цену» ведёт к форме.
import ButtonLink from '../../components/Button/Button';
import ModelsTable from '../../components/ModelsTable/ModelsTable';
import RequestForm from '../../components/RequestForm/RequestForm';
import Specs from '../../components/Specs/Specs';
import StubText from '../../components/StubText/StubText';
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
              <ButtonLink href="#request">Запросить цену</ButtonLink>
              <ButtonLink href="#models-title" variant="ghost">
                Модели и артикулы
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <ModelsTable models={category.models} />
      <RequestForm product={category.title} heading={`Запросить цену: ${category.title}`} />
      <Siblings section={section} category={category} />
    </>
  );
}
