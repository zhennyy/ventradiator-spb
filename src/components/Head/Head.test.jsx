// Теги <head>: title, description, canonical, Open Graph, JSON-LD и noindex.
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { pages } from '../../lib/routes';
import { getHeadMeta } from '../../lib/seo';
import Head from './Head';

const findPage = (path) => pages.find((page) => page.path === path);

describe('Head', () => {
  it('title, description, canonical и Open Graph страницы категории', () => {
    const page = findPage('/ventilation/l2.html');
    const html = renderToStaticMarkup(<Head meta={getHeadMeta(page, { siteUrl: 'https://test.example/' })} />);
    expect(html).toContain('<title>Blizzard L2 — вентиляция Blizzard в Санкт-Петербурге</title>');
    expect(html).toContain('<link rel="canonical" href="https://test.example/ventilation/l2.html"/>');
    expect(html).toContain('<meta property="og:url" content="https://test.example/ventilation/l2.html"/>');
    expect(html).toMatch(/<meta name="description" content="Бытовая приточно-вытяжная/);
    expect(html).not.toContain('og:image');
    expect(html).not.toContain('robots');
  });

  it('главная: canonical на корень и JSON-LD организации; 404 — noindex', () => {
    const home = renderToStaticMarkup(
      <Head meta={getHeadMeta(findPage('/index.html'), { siteUrl: 'https://test.example' })} />,
    );
    expect(home).toContain('<link rel="canonical" href="https://test.example/"/>');
    const jsonLd = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
    expect(jsonLd).toMatchObject({
      '@type': 'Organization',
      url: 'https://test.example',
      telephone: '+7 (812) 777-18-25',
    });

    const notFound = renderToStaticMarkup(<Head meta={getHeadMeta(findPage('/404.html'))} />);
    expect(notFound).toContain('<meta name="robots" content="noindex"/>');
  });
});
