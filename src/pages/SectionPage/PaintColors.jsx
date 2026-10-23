// «Услуги» → покраска радиаторов и конвекторов: текст, палитра популярных цветов RAL и варианты отделки.
import SectionTitle from '../../components/SectionTitle/SectionTitle';

export default function PaintColors({ paint }) {
  return (
    <section className="paint" aria-labelledby="paint-title">
      <div className="wrap paint-grid">
        <div>
          <SectionTitle id="paint-title" eyebrow="Покраска" title={paint.title} />
          <div className="paint-text">
            {paint.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <ul className="paint-swatches" aria-label="Популярные цвета RAL">
            {paint.colors.map(([code, name, hex]) => (
              <li key={code}>
                <span className="paint-chip" style={{ background: hex }} aria-hidden="true" />
                <span className="paint-name">{name}</span>
                <span className="paint-code">{code}</span>
              </li>
            ))}
          </ul>
          <p className="paint-note">Это примеры — доступна вся шкала RAL, более 200 оттенков.</p>
        </div>
      </div>
      <div className="wrap">
        <ul className="benefits paint-finishes" aria-label="Варианты отделки">
          {paint.finishes.map(([title, body]) => (
            <li key={title}>
              <span className="benefit-title">{title}</span>
              <span>{body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
