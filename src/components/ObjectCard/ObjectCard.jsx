// Карточка объекта с системами Blizzard: фото, город и название (без описания работ — его нет у производителя).
import { resolveImage } from '../../lib/images';
import CatalogImage from '../CatalogImage/CatalogImage';
import './ObjectCard.css';

export default function ObjectCard({ object }) {
  return (
    <li className="object-card">
      <figure>
        <CatalogImage image={resolveImage(object.image, object.name, 'object')} alt={object.name} />
        <figcaption>
          <span className="object-city">{object.city}</span>
          <span className="object-name">{object.name}</span>
        </figcaption>
      </figure>
    </li>
  );
}
