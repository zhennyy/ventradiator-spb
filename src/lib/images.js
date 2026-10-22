// Картинки: если в images/ лежит настоящее фото — берём его (/images/<файл>),
// иначе ставим SVG-заглушку /images/placeholders/<файл>.svg с названием товара (рисует компонент Placeholder).
import photos from 'virtual:photos';
import { catalog, site } from './content';

const availablePhotos = new Set(photos);

export function placeholderSrc(fileName) {
  return `/images/placeholders/${fileName.replace(/\.\w+$/, '')}.svg`;
}

export function hasPhoto(fileName) {
  return availablePhotos.has(fileName);
}

export function resolveImage(fileName, title, kind = 'product') {
  const isPlaceholder = !hasPhoto(fileName);
  return {
    src: isPlaceholder ? placeholderSrc(fileName) : `/images/${fileName}`,
    isPlaceholder,
    fileName,
    title,
    kind,
  };
}

// Все картинки, которые используются на сайте: для пререндера заглушек и проверки images/README.md.
export function listImages() {
  const images = new Map();
  const add = (fileName, title, kind) => {
    if (!images.has(fileName)) images.set(fileName, resolveImage(fileName, title, kind));
  };
  for (const section of catalog.sections) {
    add(section.image, section.title);
    for (const category of section.categories) {
      add(category.image, category.title);
      for (const item of category.gallery || []) add(item.image, item.title);
      for (const variant of category.variants || []) {
        add(variant.image, variant.title);
        if (variant.logo) add(variant.logo, `Логотип ${variant.title}`);
      }
    }
  }
  for (const object of site.objects) add(object.image, object.name, 'object');
  if (site.heroImage) add(site.heroImage.image, site.heroImage.alt);
  return [...images.values()];
}

// Обложка для превью ссылок (необязательная): images/og-cover.jpg.
export function ogCoverSrc() {
  return hasPhoto('og-cover.jpg') ? '/images/og-cover.jpg' : '';
}
