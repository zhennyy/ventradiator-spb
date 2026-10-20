// Сборка сайта: data/*.json + шаблоны → готовые HTML-страницы в dist/.
//   npm run build            — собрать в dist/
//   SITE_URL=https://… npm run build — адрес сайта для canonical, Open Graph и sitemap.xml
const fs = require('node:fs');
const path = require('node:path');
const { buildPageList } = require('./lib/pages');
const { createImageResolver } = require('./lib/images');
const { renderSitemap, renderRobots } = require('./lib/seo-files');
const { renderPage } = require('./templates/layout');

const ROOT = path.join(__dirname, '..');

// Порядок важен: базовые стили → каркас → блоки → страницы.
const STYLE_FILES = [
  'base.css',
  'layout.css',
  'mobile-menu.css',
  'footer.css',
  'components.css',
  'home.css',
  'catalog.css',
  'form.css',
  'responsive.css',
];

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', fileName), 'utf8'));
}

function writeFile(outDir, publicPath, content) {
  const target = path.join(outDir, publicPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function copyStatic(outDir) {
  fs.cpSync(path.join(ROOT, 'public', 'fonts'), path.join(outDir, 'fonts'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'public', 'scripts'), path.join(outDir, 'scripts'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'public', 'favicon.svg'), path.join(outDir, 'favicon.svg'));
  const styles = STYLE_FILES.map((fileName) => fs.readFileSync(path.join(ROOT, 'public', 'styles', fileName), 'utf8'));
  writeFile(outDir, 'styles/site.css', styles.join('\n'));
}

function buildSite({ outDir = path.join(ROOT, 'dist'), siteUrl = process.env.SITE_URL } = {}) {
  const site = readJson('site.json');
  const catalog = readJson('catalog.json');
  if (siteUrl) site.siteUrl = siteUrl.replace(/\/$/, '');

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  copyStatic(outDir);

  const images = createImageResolver({ imagesDir: path.join(ROOT, 'images'), outDir });
  const resolveImage = (fileName, title, kind) => images.resolve(fileName, title, kind);
  const ogCover = fs.existsSync(path.join(ROOT, 'images', 'og-cover.jpg')) ? '/images/og-cover.jpg' : '';
  if (ogCover) fs.copyFileSync(path.join(ROOT, 'images', 'og-cover.jpg'), path.join(outDir, 'images', 'og-cover.jpg'));

  const pages = buildPageList({ site, catalog });
  for (const page of pages) {
    const content = page.render({ site, catalog, resolveImage });
    const pageImage = page.image ? resolveImage(page.image, page.title) : null;
    const ogImage = pageImage && !pageImage.isPlaceholder ? pageImage.src : ogCover;
    writeFile(outDir, page.path, renderPage({ site, catalog, page: { ...page, ogImage }, content }));
  }
  writeFile(outDir, 'sitemap.xml', renderSitemap(site.siteUrl, pages));
  writeFile(outDir, 'robots.txt', renderRobots(site.siteUrl));
  return { outDir, pages: pages.map((page) => page.path), images: images.list() };
}

if (require.main === module) {
  const result = buildSite();
  const placeholders = result.images.filter((image) => image.isPlaceholder).length;
  console.log(`Готово: ${result.pages.length} страниц в ${path.relative(ROOT, result.outDir)}/`);
  console.log(`Картинки: ${result.images.length}, из них заглушек: ${placeholders} (список — images/README.md)`);
}

module.exports = { buildSite };
