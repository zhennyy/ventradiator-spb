// Модели и бренды категории: карточка на каждый вариант, логотип у брендов, заголовок по типу списка.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import VariantList from './VariantList';

const findCategory = (sectionSlug, slug) =>
  catalog.sections.find((section) => section.slug === sectionSlug).categories.find((item) => item.slug === slug);

describe('VariantList', () => {
  it('установки Blizzard: L2, L3 и L5 под заголовком «Модели в линейке»', () => {
    render(<VariantList category={findCategory('ventilation', 'units')} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Модели в линейке');
    const titles = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(titles).toEqual(['Blizzard L2', 'Blizzard L3', 'Blizzard L5 450', 'Blizzard L5 360']);
  });

  it('трубчатые радиаторы: бренды Kohr и Velar с логотипами', () => {
    render(<VariantList category={findCategory('radiators', 'tubular')} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Производители');
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(2);
    // Логотип стоит вместо текста в заголовке карточки: название бренда не дублируется
    const heading = within(cards[0]).getByRole('heading', { level: 3, name: 'Kohr' });
    expect(within(heading).getByRole('img')).toHaveAttribute('src', '/images/logo-kohr.png');
  });

  it('без вариантов ничего не выводит', () => {
    const { container } = render(<VariantList category={{ title: 'Пусто' }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
