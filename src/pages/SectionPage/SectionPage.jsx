// Страница раздела: вступление, преимущества и сетка категорий; у раздела без категорий — форма заявки.
import PageHero from '../../components/PageHero/PageHero';
import ProductCard from '../../components/ProductCard/ProductCard';
import RequestForm from '../../components/RequestForm/RequestForm';
import StubText from '../../components/StubText/StubText';
import { countCategories } from '../../lib/text';
import './SectionPage.css';

function Benefits({ benefits }) {
  if (!benefits.length) return null;
  return (
    <ul className="benefits" aria-label="Преимущества">
      {benefits.map(([title, body]) => (
        <li key={title}>
          <span className="benefit-title">{title}</span>
          <span>
            <StubText>{body}</StubText>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function SectionPage({ section }) {
  return (
    <>
      <PageHero
        eyebrow={section.categories.length ? `Каталог · ${countCategories(section.categories.length)}` : 'Раздел'}
        title={section.title}
        paragraphs={section.intro}
      >
        <Benefits benefits={section.benefits} />
      </PageHero>
      {section.categories.length > 0 ? (
        <section className="catalog" aria-label="Категории">
          <div className="wrap">
            <ul className="category-grid">
              {section.categories.map((category, index) => (
                <ProductCard key={category.slug} section={section} category={category} index={index} />
              ))}
            </ul>
          </div>
        </section>
      ) : (
        // Раздел без каталога (инженерные системы, услуги) — сразу форма заявки с названием раздела
        <RequestForm product={section.title} heading={`Запрос: ${section.title.toLowerCase()}`} />
      )}
    </>
  );
}
