// Пререндер: каждая страница → готовый HTML в dist/ (те же адреса, что раньше: /ventilation/units.html и т. д.),
// плюс SVG-заглушки картинок, настоящие фото из images/, sitemap.xml и robots.txt.
//   npm run build                       — клиент (vite build) → серверный рендер → этот скрипт
//   SITE_URL=https://… npm run build    — адрес сайта для canonical, Open Graph и sitemap.xml
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function writeFile(outDir, publicPath, content) {
  const target = path.join(outDir, publicPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function fillTemplate(template, { head, html }) {
  if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
    throw new Error('В шаблоне нет <!--app-head--> или <!--app-html-->');
  }
  // Функции-замены: так символы `$` в тексте страницы не будут поняты как шаблон замены.
  return template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => html);
}

function writeImages({ entry, outDir, imagesDir }) {
  const images = entry.listImages();
  for (const image of images) {
    if (image.isPlaceholder) writeFile(outDir, image.src, entry.renderPlaceholder(image));
    else writeFile(outDir, image.src, fs.readFileSync(path.join(imagesDir, image.fileName)));
  }
  const ogCover = entry.ogCoverSrc();
  if (ogCover) writeFile(outDir, ogCover, fs.readFileSync(path.join(imagesDir, path.basename(ogCover))));
  return images;
}

// entry — модуль src/entry-server.jsx (собранный или исходный, в тестах), template — dist/index.html от Vite.
export function prerender({ entry, template, outDir, siteUrl, imagesDir = path.join(ROOT, 'images') }) {
  for (const page of entry.pages) {
    const html = fillTemplate(template, {
      head: entry.renderHead(page, { siteUrl }),
      html: entry.renderPage(page),
    });
    writeFile(outDir, page.path, html);
  }
  const images = writeImages({ entry, outDir, imagesDir });
  writeFile(outDir, 'sitemap.xml', entry.renderSitemap(siteUrl, entry.pages));
  writeFile(outDir, 'robots.txt', entry.renderRobots(siteUrl));
  return { pages: entry.pages.map((page) => page.path), images };
}

async function main() {
  const outDir = path.join(ROOT, 'dist');
  const serverBundle = path.join(ROOT, 'dist-server', 'entry-server.js');
  const templatePath = path.join(outDir, 'index.html');
  if (!fs.existsSync(serverBundle) || !fs.existsSync(templatePath)) {
    throw new Error('Сначала соберите клиент и сервер: npm run build');
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  const entry = await import(pathToFileURL(serverBundle).href);
  const result = prerender({ entry, template, outDir, siteUrl: process.env.SITE_URL });
  const placeholders = result.images.filter((image) => image.isPlaceholder).length;
  console.log(`Готово: ${result.pages.length} страниц в dist/`);
  console.log(`Картинки: ${result.images.length}, из них заглушек: ${placeholders} (список — images/README.md)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
