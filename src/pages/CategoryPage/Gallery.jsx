// Фото категории: одно большое фото и, если фото несколько, ряд миниатюр под ним.
// Нажатие на миниатюру меняет большое фото — без пустых мест и «половинок» сетки.
import { useState } from 'react';
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import { resolveImage } from '../../lib/images';

export default function Gallery({ category }) {
  const photos = [
    { image: category.image, title: category.imageTitle || category.title },
    ...(category.gallery || []).map((item) => ({ image: item.image, title: item.title || category.title })),
  ].map((photo) => ({ ...photo, resolved: resolveImage(photo.image, photo.title) }));
  const [current, setCurrent] = useState(0);
  const main = photos[current];

  return (
    <div className="gallery">
      <figure className="gallery-figure">
        <CatalogImage key={main.image} image={main.resolved} alt={main.title} className="gallery-main" eager />
        {/* Подпись — что на фото (меняется вместе с выбранной миниатюрой) */}
        <figcaption className="gallery-caption">{main.title}</figcaption>
      </figure>
      {photos.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label="Другие фото">
          {photos.map((photo, index) => (
            <button
              key={photo.image}
              type="button"
              className="gallery-thumb"
              aria-label={`Фото ${index + 1}: ${photo.title}`}
              aria-pressed={index === current}
              onClick={() => setCurrent(index)}
            >
              <img src={photo.resolved.src} alt={`Миниатюра: ${photo.title}`} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
