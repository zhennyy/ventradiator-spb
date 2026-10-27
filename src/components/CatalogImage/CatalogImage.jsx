// Картинка товара или объекта: настоящее фото или SVG-заглушка (см. src/lib/images.js).
// Размер 1200×900 задан заранее, чтобы страница не прыгала при загрузке.
// srcSet — лёгкие WebP-копии: браузер берёт размер под экран (на телефоне — 640 px вместо 1200)
export default function CatalogImage({
  image,
  alt,
  className = '',
  eager = false,
  sizes = '(max-width: 600px) 50vw, 400px',
}) {
  const classes = [className, image.isPlaceholder ? 'is-placeholder' : ''].filter(Boolean).join(' ');
  return (
    <img
      className={classes || undefined}
      src={image.src}
      srcSet={image.srcSet || undefined}
      sizes={image.srcSet ? sizes : undefined}
      alt={alt ?? image.title}
      width="1200"
      height="900"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
