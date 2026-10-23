// «Услуги» → покраска радиаторов: текст слева, справа фото радиаторов разных цветов в интерьере
// (подпись — цвет и код RAL).
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { resolveImage } from '../../lib/images';

export default function PaintColors({ paint }) {
  return (
    <section className="paint" aria-labelledby="paint-title">
      <div className="wrap paint-grid">
        <div className="paint-intro">
          <SectionTitle id="paint-title" eyebrow="Покраска" title={paint.title} />
          <div className="paint-text">
            {paint.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {paint.steps && (
            <ol className="paint-steps" aria-label="Как красим">
              {paint.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
          <p className="paint-note">На фото — примеры. Доступна вся палитра RAL Classic.</p>
        </div>
        <ul className="paint-photos" aria-label="Примеры цветов">
          {paint.photos.map(([image, name, code, hex, alt]) => (
            <li key={image}>
              <figure>
                <CatalogImage image={resolveImage(image, `Радиатор, ${name}`)} alt={`${alt}, цвет ${name} ${code}`} />
                <figcaption>
                  <span className="paint-chip" style={{ background: hex }} aria-hidden="true" />
                  <span className="paint-name">{name}</span>
                  <span className="paint-code">{code}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
