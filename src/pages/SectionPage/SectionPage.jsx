// Страница направления (вентиляция / пылеудаление): вступление, преимущества и сетка категорий.
import PageHero from '../../components/PageHero/PageHero';
import ProductCard from '../../components/ProductCard/ProductCard';
import StubText from '../../components/StubText/StubText';
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
        eyebrow={`Каталог · ${section.categories.length} категорий`}
        title={section.title}
        paragraphs={section.intro}
      >
        <Benefits benefits={section.benefits} />
      </PageHero>
      <section className="catalog" aria-label="Категории">
        <div className="wrap">
          <ul className="category-grid">
            {section.categories.map((category, index) => (
              <ProductCard key={category.slug} section={section} category={category} index={index} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
