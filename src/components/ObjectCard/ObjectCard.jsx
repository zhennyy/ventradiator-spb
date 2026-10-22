// Карточка объекта, где установлены системы: изображение, город и название (без описания работ — его нет у производителя).
// Если изображения ещё нет, вместо шумной заглушки — спокойная пустая табличка того же размера.
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import './ObjectCard.css';

export default function ObjectCard({ object }) {
  const image = resolveImage(object.image, object.name, 'object');
  return (
    <li className="object-card">
      <figure>
        {image.isPlaceholder ? (
          <div className="object-plate" role="img" aria-label={object.name}>
            <span>Изображение уточняется</span>
          </div>
        ) : (
          <CatalogImage image={image} alt={object.name} />
        )}
        <figcaption>
          <span className="object-city">{object.city}</span>
          <span className="object-name">{object.name}</span>
        </figcaption>
      </figure>
    </li>
  );
}
