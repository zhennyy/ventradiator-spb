// Таблица моделей: колонки, строки, заглушки и прокрутка с клавиатуры.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ModelsTable from './ModelsTable';

const MODELS = {
  columns: ['Артикул', 'Тип', 'Размер'],
  rows: [
    ['B75AAROLL50', 'Круглый воздуховод', 'Ø75×6,5'],
    ['[ЗАГЛУШКА]', 'Фитинги', '[ЗАГЛУШКА]'],
  ],
  caption: 'Порядок артикулов [ЗАГЛУШКА: уточнить]',
};

describe('ModelsTable', () => {
  it('выводит колонки, строки с заголовком в первой ячейке и подпись', () => {
    render(<ModelsTable models={MODELS} />);
    const table = screen.getByRole('table');
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(MODELS.columns);
    const rowHeaders = within(table).getAllByRole('rowheader');
    expect(rowHeaders.map((cell) => cell.textContent)).toEqual(['B75AAROLL50', '[ЗАГЛУШКА]']);
    expect(rowHeaders[1]).toHaveClass('is-stub');
    expect(screen.getByText(/Порядок артикулов/)).toHaveClass('table-note');
  });

  it('область прокрутки доступна с клавиатуры и подписана заголовком', () => {
    render(<ModelsTable models={MODELS} />);
    const regions = screen.getAllByRole('region', { name: 'Модели и артикулы' });
    const scrollArea = regions.find((region) => region.classList.contains('table-scroll'));
    expect(scrollArea).toHaveAttribute('tabindex', '0');
    expect(scrollArea).toContainElement(screen.getByRole('table'));
  });
});
