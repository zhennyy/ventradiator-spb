// Страница категории: описание, характеристики, контакты и «Ещё в разделе».
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

  it('«Запросить цену» ведёт к контактам с названием товара', () => {
    render(<CategoryPage section={section} category={category} />);
    const product = screen.getByRole('link', { name: 'Запросить цену' });
    expect(product).toHaveAttribute('href', '#request');
    expect(document.getElementById('request')).toContainElement(screen.getByText('Звоните, мы на связи'));
    expect(screen.getByRole('heading', { name: 'Запросить цену: Воздуховоды R2' })).toBeInTheDocument();
  });

  it('категория без моделей: большое фото и миниатюры, нажатие меняет фото', () => {
    const dust = catalog.sections.find((item) => item.slug === 'dust-removal');
    const hoses = dust.categories.find((item) => item.slug === 'hoses');
    render(<CategoryPage section={dust} category={hoses} />);
    const thumbs = within(screen.getByRole('group', { name: 'Другие фото' })).getAllByRole('button');
    expect(thumbs).toHaveLength(hoses.gallery.length + 1);
    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(thumbs[1]);
    expect(thumbs[1]).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('.gallery-main')).toHaveAttribute('src', `/images/${hoses.gallery[0].image}`);
  });

  it('категория с моделями: общей галереи нет (фото — на плитках), «Ещё в разделе» — четыре другие категории', () => {
    render(<CategoryPage section={section} category={category} />);
    expect(screen.queryByRole('group', { name: 'Другие фото' })).toBeNull();
    expect(screen.getByRole('button', { name: /Круглые воздуховоды R2/ })).toBeInTheDocument();
    const siblings = screen.getByRole('heading', { name: 'Ещё в разделе «Вентиляция»' }).closest('section');
    const cards = within(siblings).getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    expect(within(siblings).queryByText('Воздуховоды R2')).toBeNull();
  });
});
