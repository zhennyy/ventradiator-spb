// Картинки: настоящее фото или заглушка, список картинок сайта, картинка для Open Graph.
import { describe, expect, it, vi } from 'vitest';

// Подменяем список фото из images/: как будто клиент прислал фото L2 и обложку.
vi.mock('virtual:photos', () => ({ default: ['vent-l2.jpg', 'og-cover.jpg'] }));

const { listImages, ogCoverSrc, resolveImage } = await import('./images');
const { getHeadMeta } = await import('./seo');
const { pages } = await import('./routes');

describe('resolveImage', () => {
  it('есть фото в images/ — берём его', () => {
    expect(resolveImage('vent-l2.jpg', 'Blizzard L2')).toMatchObject({
      src: '/images/vent-l2.jpg',
      isPlaceholder: false,
    });
  });

  it('фото нет — SVG-заглушка с тем же именем', () => {
    expect(resolveImage('vent-r2.jpg', 'Воздуховоды R2')).toMatchObject({
      src: '/images/placeholders/vent-r2.svg',
      isPlaceholder: true,
      fileName: 'vent-r2.jpg',
      kind: 'product',
    });
  });

  it('список картинок сайта без повторов, объекты помечены отдельно', () => {
    const images = listImages();
    const names = images.map((image) => image.fileName);
    expect(new Set(names).size).toBe(names.length);
    expect(images.find((image) => image.fileName === 'object-bdt.jpg').kind).toBe('object');
    expect(names).toContain('vent-r2-round.jpg');
  });

  it('Open Graph: настоящее фото товара, иначе обложка', () => {
    const l2 = pages.find((page) => page.path === '/ventilation/units.html');
    const r2 = pages.find((page) => page.path === '/ventilation/r2.html');
    expect(getHeadMeta(l2, { siteUrl: 'https://test.example' }).ogImage).toBe(
      'https://test.example/images/vent-l2.jpg',
    );
    expect(getHeadMeta(r2, { siteUrl: 'https://test.example' }).ogImage).toBe(
      'https://test.example/images/og-cover.jpg',
    );
    expect(ogCoverSrc()).toBe('/images/og-cover.jpg');
  });
});
