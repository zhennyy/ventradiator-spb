// Страница категории: описание, характеристики, все модели из каталога, форма и «Ещё в разделе».
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import CategoryPage from './CategoryPage';

const section = catalog.sections[0];
const category = section.categories.find((item) => item.slug === 'r2');

describe('CategoryPage', () => {
  it('выводит название, описание, характеристики и все модели из каталога', () => {
    render(<CategoryPage section={section} category={category} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Воздуховоды R2');
    expect(screen.getByText(category.text[0])).toBeInTheDocument();
    for (const [label] of category.specs) expect(screen.getByText(label, { selector: 'dt' })).toBeInTheDocument();

    const table = screen.getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1);
    expect(bodyRows).toHaveLength(category.models.rows.length);
    expect(bodyRows.map((row) => within(row).getByRole('rowheader').textContent)).toEqual(
      category.models.rows.map((row) => row[0]),
    );
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(category.models.columns);
  });

  it('«Запросить цену» ведёт к форме, а в форме указан товар', () => {
    render(<CategoryPage section={section} category={category} />);
    const product = screen.getByRole('link', { name: 'Запросить цену' });
    expect(product).toHaveAttribute('href', '#request');
    expect(document.getElementById('request')).toContainElement(
      screen.getByRole('button', { name: 'Отправить заявку' }),
    );
    expect(screen.getByRole('heading', { name: 'Запросить цену: Воздуховоды R2' })).toBeInTheDocument();
    expect(document.querySelector('input[name="product"]')).toHaveValue('Воздуховоды R2');
  });

  it('фото и галерея с alt, «Ещё в разделе» — четыре другие категории', () => {
    render(<CategoryPage section={section} category={category} />);
    expect(screen.getByRole('img', { name: 'Воздуховоды R2' })).toHaveAttribute('loading', 'eager');
    expect(screen.getByRole('img', { name: 'Круглые воздуховоды R2 Ø75 и Ø90' })).toHaveAttribute(
      'src',
      '/images/vent-r2-round.jpg',
    );
    // Фото плоских воздуховодов пока нет — вместо него заглушка
    expect(screen.getByRole('img', { name: /Плоские воздуховоды R2/ })).toHaveAttribute(
      'src',
      '/images/placeholders/vent-r2-flat.svg',
    );
    const siblings = screen.getByRole('heading', { name: 'Ещё в разделе «Вентиляция»' }).closest('section');
    const cards = within(siblings).getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    expect(within(siblings).queryByText('Воздуховоды R2')).toBeNull();
  });
});
