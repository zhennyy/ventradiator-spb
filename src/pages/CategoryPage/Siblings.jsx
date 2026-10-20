// «Ещё в разделе»: до четырёх других категорий того же раздела.
import ButtonLink from '../../components/Button/Button';
import ProductCard from '../../components/ProductCard/ProductCard';
import { sectionPath } from '../../lib/content';

export default function Siblings({ section, category }) {
  const others = section.categories.filter((item) => item.slug !== category.slug).slice(0, 4);
  return (
    <section className="siblings" aria-labelledby="siblings-title">
      <div className="wrap">
        <div className="strip-head">
          <h2 id="siblings-title">{`Ещё в разделе «${section.title}»`}</h2>
          <ButtonLink href={sectionPath(section)} variant="ghost">
            Все категории
          </ButtonLink>
        </div>
        <ul className="category-grid category-grid-compact">
          {others.map((item) => (
            <ProductCard key={item.slug} section={section} category={item} index={section.categories.indexOf(item)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
