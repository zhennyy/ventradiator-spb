// «Два направления» на главной: вентиляция и пылеудаление — по карточке на раздел каталога.
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
          title="Два направления"
          id="directions-title"
          lead="Свежий воздух без потерь тепла и уборка без пыли в воздухе. Системы Blizzard для квартир и частных домов."
        />
        <div className="direction-grid">
          {catalog.sections.map((section, index) => (
            <DirectionCard key={section.slug} section={section} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
