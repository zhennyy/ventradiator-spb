// Картинка товара или объекта: настоящее фото или SVG-заглушка (см. src/lib/images.js).
// Размер 1200×900 задан заранее, чтобы страница не прыгала при загрузке.
export default function CatalogImage({ image, alt, className = '', eager = false }) {
  const classes = [className, image.isPlaceholder ? 'is-placeholder' : ''].filter(Boolean).join(' ');
  return (
    <img
      className={classes}
      src={image.src}
      alt={alt || image.title}
      width="1200"
      height="900"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
