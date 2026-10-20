// Карточка направления на главной (вентиляция / пылеудаление): фото, описание и первые шесть категорий.
import ButtonLink from '../../components/Button/Button';
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import StubText from '../../components/StubText/StubText';
import { categoryPath, sectionPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import { pad } from '../../lib/text';

export default function DirectionCard({ section, index }) {
  const href = sectionPath(section);
  return (
    <article className="direction">
      <a className="direction-media" href={href} tabIndex={-1} aria-hidden="true">
        <CatalogImage image={resolveImage(section.image, section.title)} alt={section.title} />
      </a>
      <div className="direction-body">
        <p className="direction-index">{`${pad(index + 1)} / ${section.title}`}</p>
        <h3>
          <a href={href}>{section.title}</a>
        </h3>
        <p>
          <StubText>{section.summary}</StubText>
        </p>
        <ul className="direction-links">
          {section.categories.slice(0, 6).map((category) => (
            <li key={category.slug}>
              <a href={categoryPath(section, category)}>{category.title}</a>
            </li>
          ))}
        </ul>
        <ButtonLink href={href} variant="ghost">
          {`Весь раздел: ${section.categories.length} категорий`}
        </ButtonLink>
      </div>
    </article>
  );
}
