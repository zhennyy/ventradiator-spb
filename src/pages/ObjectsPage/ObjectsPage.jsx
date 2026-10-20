// Объекты с системами Blizzard: сначала Санкт-Петербург, затем другие города.
// Подпись — только «Объекты с системами Blizzard»: какие работы выполнялись, производитель не сообщает.
import ObjectCard from '../../components/ObjectCard/ObjectCard';
import PageHero from '../../components/PageHero/PageHero';
import { site } from '../../lib/content';
import './ObjectsPage.css';

const LOCAL_CITY = 'Санкт-Петербург';

function ObjectList({ objects }) {
  return (
    <ul className="object-grid">
      {objects.map((object) => (
        <ObjectCard key={object.slug} object={object} />
      ))}
    </ul>
  );
}

export default function ObjectsPage() {
  const local = site.objects.filter((object) => object.city === LOCAL_CITY);
  const others = site.objects.filter((object) => object.city !== LOCAL_CITY);
  return (
    <>
      <PageHero
        eyebrow="Объекты с системами Blizzard"
        title="Объекты"
        paragraphs={[
          `В СНГ ${site.objectsTotal} объектов с системами Blizzard. Среди них — театры, музеи, храмы и гостиницы.`,
        ]}
      />
      <section className="objects-page">
        <div className="wrap">
          <h2 className="group-title">Санкт-Петербург</h2>
          <ObjectList objects={local} />
          <h2 className="group-title">Другие города</h2>
          <ObjectList objects={others} />
          <p className="table-note">{`Объекты с системами Blizzard. Подборка из ${site.objectsTotal} объектов в СНГ.`}</p>
        </div>
      </section>
    </>
  );
}
