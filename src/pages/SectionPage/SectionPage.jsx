// Страница раздела: вступление, быстрые ссылки на категории, сетка карточек; у раздела без категорий — форма заявки.
// У «Вентиляции» под каталогом — схема «Как работает рекуперация».
import PageHero from '../../components/PageHero/PageHero';
import ProductCard from '../../components/ProductCard/ProductCard';
import RequestForm from '../../components/RequestForm/RequestForm';
import StubText from '../../components/StubText/StubText';
import { categoryPath } from '../../lib/content';
import { countCategories } from '../../lib/text';
import HowItWorks from './HowItWorks';
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

// Быстрый переход в категорию прямо из шапки раздела — не нужно листать до карточек
function QuickLinks({ section }) {
  if (!section.categories.length) return null;
  return (
    <nav className="quick-links" aria-label={`Категории раздела «${section.title}»`}>
      {section.categories.map((category) => (
        <a key={category.slug} href={categoryPath(section, category)}>
          {category.title}
          <span aria-hidden="true">→</span>
        </a>
      ))}
    </nav>
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
        <QuickLinks section={section} />
      </PageHero>
      {section.categories.length > 0 ? (
        <section className="catalog" aria-label="Категории">
          <div className="wrap">
            <ul className="category-grid">
              {section.categories.map((category) => (
                <ProductCard key={category.slug} section={section} category={category} />
              ))}
            </ul>
          </div>
        </section>
      ) : (
        // Раздел без каталога (инженерные системы, услуги) — сразу форма заявки с названием раздела
        <RequestForm product={section.title} heading={`Запрос: ${section.title.toLowerCase()}`} />
      )}
      {section.slug === 'ventilation' && <HowItWorks />}
    </>
  );
}
