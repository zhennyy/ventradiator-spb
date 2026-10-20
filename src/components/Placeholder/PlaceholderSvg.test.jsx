// SVG-заглушка: название, подпись и имя файла для замены.
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PlaceholderSvg, { splitTitle } from './PlaceholderSvg';

describe('PlaceholderSvg', () => {
  it('показывает название, подпись и имя файла, который нужно положить в images/', () => {
    const { container } = render(<PlaceholderSvg title="Воздуховоды R2" fileName="vent-r2.jpg" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-label', 'Воздуховоды R2');
    expect(svg.textContent).toContain('ФОТО ТОВАРА · ЗАГЛУШКА');
    expect(svg.textContent).toContain('images/vent-r2.jpg');
  });

  it('для объектов — подпись «ФОТО ОБЪЕКТА»', () => {
    const { container } = render(
      <PlaceholderSvg title="Мирский замок" fileName="object-mir-castle.jpg" kind="object" />,
    );
    expect(container.textContent).toContain('ФОТО ОБЪЕКТА');
  });

  it('длинное название делится на строки не длиннее ~22 символов, максимум три', () => {
    expect(splitTitle('Большой драматический театр им. Товстоногова')).toEqual([
      'Большой драматический',
      'театр им. Товстоногова',
    ]);
    expect(splitTitle('один два три четыре пять шесть семь восемь девять десять', 8)).toHaveLength(3);
  });
});
