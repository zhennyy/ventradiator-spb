// Направление на главной: фото, описание и первые четыре категории списком-оглавлением (у «Услуг» категорий нет).
import ButtonLink from '../../components/Button/Button';
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import StubText from '../../components/StubText/StubText';
import { categoryPath, sectionPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import { countCategories } from '../../lib/text';

export default function DirectionCard({ section }) {
  const href = sectionPath(section);
  return (
    <article className="direction">
      <a className="direction-media" href={href} tabIndex={-1} aria-hidden="true">
        <CatalogImage image={resolveImage(section.image, section.title)} alt={section.title} />
      </a>
      <div className="direction-body">
        <p className="direction-index mono">
          {/* Без нумерации разделов: только сколько внутри категорий */}
          {section.categories.length ? countCategories(section.categories.length) : 'Под ваш объект'}
        </p>
        <h3>
          <a href={href}>{section.title}</a>
        </h3>
        <p>
          <StubText>{section.summary}</StubText>
        </p>
        {section.categories.length > 0 && (
          <ul className="direction-links">
            {section.categories.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <a href={categoryPath(section, category)}>
                  {category.title}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <ButtonLink href={href} variant="ghost">
          {section.categories.length ? `Весь раздел «${section.title}»` : 'Подробнее'}
        </ButtonLink>
      </div>
    </article>
  );
}
