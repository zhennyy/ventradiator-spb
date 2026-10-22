import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SectionStrip from './SectionStrip';

describe('SectionStrip', () => {
  it('показывает все разделы каталога и выделяет текущий, в том числе на странице категории', () => {
    render(<SectionStrip currentPath="/radiators/tubular.html" />);
    const nav = screen.getByRole('navigation', { name: 'Разделы каталога' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual([
      'Вентиляция',
      'Пылеудаление',
      'Радиаторы',
      'Конвекторы',
      'Инженерные системы',
      'Услуги',
    ]);
    expect(within(nav).getByRole('link', { name: 'Радиаторы' })).toHaveClass('is-current');
    expect(within(nav).getByRole('link', { name: 'Радиаторы' })).not.toHaveAttribute('aria-current');
  });

  it('на странице раздела ставит aria-current', () => {
    render(<SectionStrip currentPath="/convectors.html" />);
    expect(screen.getByRole('link', { name: 'Конвекторы' })).toHaveAttribute('aria-current', 'page');
  });
});
