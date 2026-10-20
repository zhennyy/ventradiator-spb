// Содержимое сайта: каталог (разделы → категории) и сведения о компании. Правится только в data/*.json.
import catalogData from '../../data/catalog.json';
import siteData from '../../data/site.json';

export const catalog = catalogData;
export const site = siteData;

export function sectionPath(section) {
  return `/${section.slug}.html`;
}

export function categoryPath(section, category) {
  return `/${section.slug}/${category.slug}.html`;
}
