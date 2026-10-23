// Страница категории: описание, характеристики, форма и «Ещё в разделе».
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import CategoryPage from './CategoryPage';

const section = catalog.sections[0];
const category = section.categories.find((item) => item.slug === 'r2');

describe('CategoryPage', () => {
  it('выводит название, описание и характеристики, без таблицы артикулов', () => {
    render(<CategoryPage section={section} category={category} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Воздуховоды R2');
    expect(screen.getByText(category.text[0])).toBeInTheDocument();
    for (const [label] of category.specs) expect(screen.getByText(label, { selector: 'dt' })).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.queryByText(/артикул/i)).toBeNull();
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
    // Остальные фото — миниатюрами; нажатие на миниатюру меняет большое фото
    const thumbs = within(screen.getByRole('group', { name: 'Другие фото' })).getAllByRole('button');
    expect(thumbs).toHaveLength(category.gallery.length + 1);
    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: 'Миниатюра: Круглые воздуховоды R2 Ø75 и Ø90' })).toHaveAttribute(
      'src',
      '/images/vent-r2-round.jpg',
    );
    // Фото плоских воздуховодов — из папки images/
    expect(screen.getByRole('img', { name: /Миниатюра: Плоские воздуховоды R2/ })).toHaveAttribute(
      'src',
      '/images/vent-r2-flat.jpg',
    );
    fireEvent.click(thumbs[1]);
    expect(thumbs[1]).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('.gallery-main')).toHaveAttribute('src', '/images/vent-r2-round.jpg');
    const siblings = screen.getByRole('heading', { name: 'Ещё в разделе «Вентиляция»' }).closest('section');
    const cards = within(siblings).getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    expect(within(siblings).queryByText('Воздуховоды R2')).toBeNull();
  });
});
