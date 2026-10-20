// @vitest-environment node
// Тесты пререндера: все страницы созданы с правильным title, у каждой есть SEO-разметка и один h1,
// внутренние ссылки и якоря ведут на существующее, у картинок есть alt, sitemap и robots полные.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import catalog from '../data/catalog.json';
import * as entry from '../src/entry-server.jsx';
import { prerender } from './prerender.js';

const ROOT = path.join(import.meta.dirname, '..');
const template = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blizzard-prerender-'));
const result = prerender({ entry, template, outDir, siteUrl: 'https://test.example/' });

const readPage = (publicPath) => fs.readFileSync(path.join(outDir, publicPath), 'utf8');
const collectLinks = (html) => [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
const collectIds = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const decode = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

afterAll(() => fs.rmSync(outDir, { recursive: true, force: true }));

describe('пререндер', () => {
  it('создаёт все страницы: общие, разделы и каждую категорию — по прежним адресам', () => {
    const expected = [
      '/index.html',
      '/objects.html',
      '/about.html',
      '/contacts.html',
      '/privacy.html',
      '/consent.html',
    ];
    expected.push('/404.html');
    for (const section of catalog.sections) {
      expected.push(`/${section.slug}.html`);
      for (const category of section.categories) expected.push(`/${section.slug}/${category.slug}.html`);
    }
    expect([...result.pages].sort()).toEqual(expected.sort());
    for (const publicPath of expected) expect(fs.existsSync(path.join(outDir, publicPath)), publicPath).toBe(true);
  });

  it('у каждой страницы свой правильный <title>', () => {
    for (const page of entry.pages) {
      const title = readPage(page.path).match(/<title>([^<]*)<\/title>/);
      expect(title, page.path).not.toBeNull();
      expect(decode(title[1]), page.path).toBe(page.title);
    }
    expect(readPage('/ventilation/l2.html')).toContain(
      '<title>Blizzard L2 — вентиляция Blizzard в Санкт-Петербурге</title>',
    );
  });

  it('у каждой страницы есть description, canonical, Open Graph, один h1 и готовое содержимое в #root', () => {
    for (const page of entry.pages) {
      const html = readPage(page.path);
      expect(html, page.path).toMatch(/<meta name="description" content="[^"]{30,}"/);
      expect(html, page.path).toMatch(/<link rel="canonical" href="https:\/\/test\.example\/[^"]*"/);
      expect(html, page.path).toMatch(/<meta property="og:title" content="[^"]+"/);
      expect((html.match(/<h1[\s>]/g) || []).length, page.path).toBe(1);
      expect(html, page.path).toMatch(/<html lang="ru">/);
      expect(html, page.path).toMatch(/<div id="root"><a class="skip-link" href="#main">/);
      expect(html, page.path).not.toContain('<!--app-');
    }
    expect(readPage('/index.html')).toContain('<link rel="canonical" href="https://test.example/"/>');
    expect(readPage('/404.html')).toContain('<meta name="robots" content="noindex"/>');
  });

  it('все внутренние ссылки и якоря ведут на существующие файлы', () => {
    const broken = [];
    for (const publicPath of result.pages) {
      for (const link of collectLinks(readPage(publicPath))) {
        if (/^(https?:|mailto:|tel:)/.test(link) || link.startsWith('/src/')) continue;
        const [target, anchor] = link.split('#');
        const targetPath = target === '' ? publicPath : target === '/' ? '/index.html' : target;
        const isPublicFile = fs.existsSync(path.join(ROOT, 'public', targetPath));
        if (!fs.existsSync(path.join(outDir, targetPath)) && !isPublicFile) {
          broken.push(`${publicPath} → ${link}`);
          continue;
        }
        if (anchor && targetPath.endsWith('.html') && !collectIds(readPage(targetPath)).has(anchor)) {
          broken.push(`${publicPath} → ${link} (нет якоря)`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it('у всех картинок есть alt, заглушки созданы и описаны в images/README.md', () => {
    for (const publicPath of result.pages) {
      for (const tag of readPage(publicPath).match(/<img [^>]*>/g) || []) {
        expect(tag, `${publicPath}: ${tag}`).toMatch(/alt="[^"]+"/);
      }
    }
    const readme = fs.readFileSync(path.join(ROOT, 'images', 'README.md'), 'utf8');
    expect(result.images.length).toBeGreaterThan(0);
    for (const image of result.images) {
      expect(fs.existsSync(path.join(outDir, image.src)), image.src).toBe(true);
      expect(readme.includes(image.fileName), image.fileName).toBe(true);
    }
    const svg = fs.readFileSync(path.join(outDir, '/images/placeholders/vent-r2.svg'), 'utf8');
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toContain('images/vent-r2.jpg');
  });

  it('форма заявки: согласие не отмечено, ведёт на /api/request, есть на главной, товарах и в контактах', () => {
    const productPage = `/${catalog.sections[0].slug}/${catalog.sections[0].categories[0].slug}.html`;
    for (const publicPath of ['/index.html', productPage, '/contacts.html']) {
      const html = readPage(publicPath);
      expect(html, publicPath).toMatch(
        /<form class="request-form" action="\/api\/request" method="post" novalidate=""/,
      );
      expect(html.match(/<input id="request-consent"[^>]*>/)[0], publicPath).not.toMatch(/checked/);
    }
    expect(readPage(productPage)).toMatch(/href="#request">Запросить цену</);
  });

  it('sitemap.xml содержит все страницы, кроме 404, а robots.txt ссылается на него', () => {
    const sitemap = readPage('sitemap.xml');
    const indexable = result.pages.filter((publicPath) => publicPath !== '/404.html');
    expect((sitemap.match(/<loc>/g) || []).length).toBe(indexable.length);
    expect(sitemap).toContain('<loc>https://test.example/</loc>');
    expect(sitemap).toContain('<loc>https://test.example/ventilation/l2.html</loc>');
    expect(sitemap).not.toMatch(/404/);
    expect(readPage('robots.txt')).toMatch(/Sitemap: https:\/\/test\.example\/sitemap\.xml/);
  });

  it('документы — шаблоны с плашкой и полями для реквизитов', () => {
    for (const publicPath of ['/privacy.html', '/consent.html']) {
      const html = readPage(publicPath);
      expect(html, publicPath).toMatch(/class="template-banner"/);
      expect(html, publicPath).toMatch(/\[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА\]/);
    }
  });

  it('без маркеров в шаблоне — понятная ошибка', () => {
    expect(() => prerender({ entry, template: '<html></html>', outDir })).toThrow(/app-head/);
  });
});
