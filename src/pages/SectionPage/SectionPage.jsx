// Страница раздела: вступление, быстрые ссылки на категории, сетка карточек; у раздела без категорий — форма заявки.
// У «Вентиляции» под каталогом — схема «Как работает рекуперация».
import PageHero from '../../components/PageHero/PageHero';
import ProductCard from '../../components/ProductCard/ProductCard';
import ContactBlock from '../../components/ContactBlock/ContactBlock';
import StubText from '../../components/StubText/StubText';
import { categoryPath } from '../../lib/content';
import { countCategories } from '../../lib/text';
import HowItWorks from './HowItWorks';
import PaintColors from './PaintColors';
import ServiceWorks from './ServiceWorks';
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

// Подробное описание раздела и преимущества — под ассортиментом, чтобы товары были видны сразу
function AboutSection({ section }) {
  return (
    <section className="section-about" aria-labelledby="section-about-title">
      <div className="wrap section-about-grid">
        <div className="section-head">
          <p className="eyebrow">О разделе</p>
          <h2 id="section-about-title">{section.title}</h2>
        </div>
        <div className="section-about-text">
          {section.intro.map((paragraph) => (
            <p key={paragraph}>
              <StubText>{paragraph}</StubText>
            </p>
          ))}
        </div>
      </div>
      <div className="wrap">
        <Benefits benefits={section.benefits} />
      </div>
    </section>
  );
}

export default function SectionPage({ section }) {
  // Раздел без каталога (инженерные системы, услуги): полное описание наверху и сразу форма заявки
  if (!section.categories.length) {
    return (
      <>
        <PageHero eyebrow="Раздел" title={section.title} paragraphs={section.intro}>
          <Benefits benefits={section.benefits} />
        </PageHero>
        {section.works && <ServiceWorks works={section.works} />}
        {section.paint && <PaintColors paint={section.paint} />}
        <ContactBlock product={section.title} heading={`Запрос: ${section.title.toLowerCase()}`} />
      </>
    );
  }
  // Раздел каталога: короткое вступление → сразу ассортимент → подробности о разделе
  return (
    <>
      <PageHero
        eyebrow={`Каталог · ${countCategories(section.categories.length)}`}
        title={section.title}
        paragraphs={[section.summary]}
      >
        <QuickLinks section={section} />
      </PageHero>
      <section className="catalog" aria-label="Категории">
        <div className="wrap">
          <ul className="category-grid">
            {section.categories.map((category) => (
              <ProductCard key={category.slug} section={section} category={category} />
            ))}
          </ul>
        </div>
      </section>
      <AboutSection section={section} />
      {section.slug === 'ventilation' && <HowItWorks />}
    </>
  );
}
