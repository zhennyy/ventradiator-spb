// Фото категории: главное (грузится сразу) и дополнительные — двумя колонками под ним.
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import { resolveImage } from '../../lib/images';

export default function Gallery({ category }) {
  const extra = category.gallery || [];
  return (
    <div className="gallery">
      <CatalogImage
        image={resolveImage(category.image, category.title)}
        alt={category.title}
        className="gallery-main"
        eager
      />
      {extra.length > 0 && (
        <div className="gallery-extra">
          {extra.map((item) => (
            <CatalogImage key={item.image} image={resolveImage(item.image, item.title)} />
          ))}
        </div>
      )}
    </div>
  );
}
