// Картинки: если в images/ лежит настоящее фото — берём его (/images/<файл>),
// иначе ставим SVG-заглушку /images/placeholders/<файл>.svg с названием товара (рисует компонент Placeholder).
import photos, { optimized } from 'virtual:photos';
import { catalog, site } from './content';

const availablePhotos = new Set(photos);
const optimizedFiles = new Set(optimized || []);

// srcset из лёгких WebP-копий (images/opt): «/images/opt/x-640.webp 640w, …» — или пусто, если копий нет
export function srcSetFor(fileName) {
  const stem = fileName.replace(/\.\w+$/, '');
  const widths = [640, 1200, 1600, 2800].filter((width) => optimizedFiles.has(`${stem}-${width}.webp`));
  return widths.map((width) => `/images/opt/${stem}-${width}.webp ${width}w`).join(', ');
}

export function placeholderSrc(fileName) {
  return `/images/placeholders/${fileName.replace(/\.\w+$/, '')}.svg`;
}

export function hasPhoto(fileName) {
  return availablePhotos.has(fileName);
}

// Логотипы брендов для серий (variant.brand) — в карточках категорий показываются логотипами
export const BRAND_LOGOS = {
  Vitron: 'logo-vitron.png',
  Velar: 'logo-velar.png',
  Kohr: 'logo-kohr.png',
  Rifar: 'logo-rifar.png',
  'Royal Thermo': 'logo-royal-thermo.png',
  Gekon: 'logo-gekon.png',
};

export function resolveImage(fileName, title, kind = 'product') {
  const isPlaceholder = !hasPhoto(fileName);
  return {
    src: isPlaceholder ? placeholderSrc(fileName) : `/images/${fileName}`,
    srcSet: isPlaceholder ? '' : srcSetFor(fileName),
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
    for (const category of [...section.categories, ...(section.nestedCategories || [])]) {
      add(category.image, category.title);
      for (const item of category.gallery || []) add(item.image, item.title);
      for (const variant of category.variants || []) {
        add(variant.image, variant.title);
        for (const item of variant.gallery || []) add(item.image, item.title || variant.title);
        if (BRAND_LOGOS[variant.brand]) add(BRAND_LOGOS[variant.brand], `Логотип ${variant.brand}`);
        if (variant.logo) add(variant.logo, `Логотип ${variant.title}`);
      }
    }
  }
  for (const section of catalog.sections)
    for (const [image, name] of section.paint?.photos || []) add(image, `Радиатор, ${name}`);
  for (const section of catalog.sections) for (const work of section.works || []) add(work.image, work.title);
  if (site.heroImage) add(site.heroImage.image, site.heroImage.alt);
  return [...images.values()];
}

// Обложка для превью ссылок (необязательная): images/og-cover.jpg.
export function ogCoverSrc() {
  return hasPhoto('og-cover.jpg') ? '/images/og-cover.jpg' : '';
}
