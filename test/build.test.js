// Тесты сборки: все страницы созданы, у каждой есть SEO-разметка, внутренние ссылки и якоря ведут на существующее.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { buildSite } = require('../scripts/build');
const catalog = require('../data/catalog.json');

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blizzard-build-'));
const result = buildSite({ outDir, siteUrl: 'https://test.example' });

function readPage(publicPath) {
  return fs.readFileSync(path.join(outDir, publicPath), 'utf8');
}

function collectLinks(html) {
  return [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
}

function collectIds(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
}

test.after(() => fs.rmSync(outDir, { recursive: true, force: true }));

test('генерируются все страницы: общие, разделы и каждая категория', () => {
  const expected = [
    '/index.html',
    '/objects.html',
    '/about.html',
    '/contacts.html',
    '/privacy.html',
    '/consent.html',
    '/404.html',
  ];
  for (const section of catalog.sections) {
    expected.push(`/${section.slug}.html`);
    for (const category of section.categories) expected.push(`/${section.slug}/${category.slug}.html`);
  }
  assert.deepEqual([...result.pages].sort(), expected.sort());
  for (const publicPath of expected) assert.ok(fs.existsSync(path.join(outDir, publicPath)), publicPath);
});

test('у каждой страницы есть title, description, canonical, Open Graph и один h1', () => {
  for (const publicPath of result.pages) {
    const html = readPage(publicPath);
    assert.match(html, /<title>[^<]{10,}<\/title>/, publicPath);
    assert.match(html, /<meta name="description" content="[^"]{30,}"/, publicPath);
    assert.match(html, /<link rel="canonical" href="https:\/\/test\.example\//, publicPath);
    assert.match(html, /<meta property="og:title"/, publicPath);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, publicPath);
    assert.match(html, /<html lang="ru">/, publicPath);
  }
});

test('все внутренние ссылки и якоря ведут на существующие файлы', () => {
  const broken = [];
  for (const publicPath of result.pages) {
    const html = readPage(publicPath);
    for (const link of collectLinks(html)) {
      if (/^(https?:|mailto:|tel:)/.test(link)) continue;
      const [target, anchor] = link.split('#');
      const targetPath = target === '' ? publicPath : target === '/' ? '/index.html' : target;
      const file = path.join(outDir, targetPath);
      if (!fs.existsSync(file)) {
        broken.push(`${publicPath} → ${link}`);
        continue;
      }
      if (anchor && targetPath.endsWith('.html') && !collectIds(readPage(targetPath)).has(anchor)) {
        broken.push(`${publicPath} → ${link} (нет якоря)`);
      }
    }
  }
  assert.deepEqual(broken, []);
});

test('у всех картинок есть alt, а заглушки созданы', () => {
  for (const publicPath of result.pages) {
    const images = readPage(publicPath).match(/<img [^>]*>/g) || [];
    for (const tag of images) assert.match(tag, /alt="[^"]+"/, `${publicPath}: ${tag}`);
  }
  assert.ok(result.images.length > 0);
  for (const image of result.images) assert.ok(fs.existsSync(path.join(outDir, image.src)), image.src);
});

test('каждый файл картинки описан в images/README.md', () => {
  const readme = fs.readFileSync(path.join(__dirname, '..', 'images', 'README.md'), 'utf8');
  for (const image of result.images) assert.ok(readme.includes(image.fileName), image.fileName);
});

test('форма заявки: согласие не отмечено, ведёт на /api/request, есть на главной и страницах товаров', () => {
  const productPage = `/${catalog.sections[0].slug}/${catalog.sections[0].categories[0].slug}.html`;
  for (const publicPath of ['/index.html', productPage, '/contacts.html']) {
    const html = readPage(publicPath);
    assert.match(html, /<form class="request-form" action="\/api\/request" method="post"/, publicPath);
    const checkbox = html.match(/<input id="request-consent"[^>]*>/)[0];
    assert.doesNotMatch(checkbox, /checked/, publicPath);
  }
  assert.match(readPage(productPage), /href="#request">Запросить цену</);
});

test('sitemap.xml содержит все страницы, кроме 404, а robots.txt ссылается на него', () => {
  const sitemap = readPage('sitemap.xml');
  const indexable = result.pages.filter((publicPath) => publicPath !== '/404.html');
  assert.equal((sitemap.match(/<loc>/g) || []).length, indexable.length);
  assert.ok(sitemap.includes('<loc>https://test.example/</loc>'));
  assert.doesNotMatch(sitemap, /404/);
  assert.match(readPage('robots.txt'), /Sitemap: https:\/\/test\.example\/sitemap\.xml/);
});

test('документы — шаблоны с плашкой и полями для реквизитов', () => {
  for (const publicPath of ['/privacy.html', '/consent.html']) {
    const html = readPage(publicPath);
    assert.match(html, /class="template-banner"/, publicPath);
    assert.match(html, /\[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА\]/, publicPath);
  }
});
