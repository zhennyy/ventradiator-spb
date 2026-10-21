// Направление на главной (вентиляция / пылеудаление): фото, описание и первые шесть категорий списком-оглавлением.
import ButtonLink from '../../components/Button/Button';
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import StubText from '../../components/StubText/StubText';
import { categoryPath, sectionPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';

export default function DirectionCard({ section, index }) {
  const href = sectionPath(section);
  return (
    <article className="direction">
      <a className="direction-media" href={href} tabIndex={-1} aria-hidden="true">
        <CatalogImage image={resolveImage(section.image, section.title)} alt={section.title} />
      </a>
      <div className="direction-body">
        <p className="direction-index mono">{`Раздел ${index + 1} · ${section.categories.length} категорий`}</p>
        <h3>
          <a href={href}>{section.title}</a>
        </h3>
        <p>
          <StubText>{section.summary}</StubText>
        </p>
        <ul className="direction-links">
          {section.categories.slice(0, 6).map((category) => (
            <li key={category.slug}>
              <a href={categoryPath(section, category)}>
                {category.title}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
        <ButtonLink href={href}>{`Весь раздел «${section.title}»`}</ButtonLink>
      </div>
    </article>
  );
}
