// «Что мы предлагаем» на главной: по карточке на каждый раздел каталога.
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { catalog } from '../../lib/content';
import DirectionCard from './DirectionCard';
import './DirectionsSection.css';

export default function DirectionsSection() {
  return (
    <section className="directions" id="directions" aria-labelledby="directions-title">
      <div className="wrap">
        <SectionTitle
          eyebrow="Каталог"
          title="Что мы предлагаем"
          id="directions-title"
          lead="Вентиляция, пылеудаление, радиаторы и конвекторы для квартир и частных домов — и инженерные системы с услугами под ключ."
        />
        <div className="direction-grid">
          {catalog.sections.map((section) => (
            <DirectionCard key={section.slug} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}
