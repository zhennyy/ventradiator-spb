// «Услуги»: чем занимаемся — проекты вентиляции и кондиционирования, монтаж.
// Каждый блок — фото и текст рядом (фото чередуется слева/справа), под текстом короткий список работ.
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { resolveImage } from '../../lib/images';

export default function ServiceWorks({ works }) {
  return works.map((work, index) => (
    <section
      className={`work${index % 2 ? ' work-reverse' : ''}`}
      id={work.id}
      key={work.id}
      aria-labelledby={`${work.id}-title`}
    >
      <div className="wrap work-grid">
        <div className="work-media">
          <CatalogImage image={resolveImage(work.image, work.title)} alt={work.alt} />
        </div>
        <div className="work-body">
          <SectionTitle id={`${work.id}-title`} eyebrow={work.eyebrow} title={work.title} />
          <div className="work-text">
            {work.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="work-points">
            {work.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ));
}
