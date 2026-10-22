// Полоса объектов на главной: первые четыре объекта, у которых уже есть изображение, и ссылка на все.
import ButtonLink from '../../components/Button/Button';
import ObjectCard from '../../components/ObjectCard/ObjectCard';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { site } from '../../lib/content';
import { hasPhoto } from '../../lib/images';

export default function ObjectsStrip() {
  return (
    <section className="objects-strip" aria-labelledby="objects-title">
      <div className="wrap">
        <div className="strip-head">
          <SectionTitle
            eyebrow="Где установлены эти системы"
            title={`${site.objectsTotal} объектов в СНГ`}
            id="objects-title"
          />
          <ButtonLink href="/objects.html" variant="ghost">
            Все объекты
          </ButtonLink>
        </div>
        <ul className="object-grid">
          {site.objects
            .filter((object) => hasPhoto(object.image))
            .slice(0, 4)
            .map((object) => (
              <ObjectCard key={object.slug} object={object} />
            ))}
        </ul>
      </div>
    </section>
  );
}
