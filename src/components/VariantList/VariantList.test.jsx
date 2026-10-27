// Модели и бренды категории: карточка на каждый вариант, логотип у брендов, заголовок по типу списка.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import VariantList from './VariantList';

const findCategory = (sectionSlug, slug) =>
  catalog.sections.find((section) => section.slug === sectionSlug).categories.find((item) => item.slug === slug);

describe('VariantList', () => {
  it('установки Blizzard: L2, L3 и L5 под заголовком «Модели в линейке»', () => {
    render(<VariantList category={findCategory('ventilation', 'units')} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Модели в линейке');
    const titles = [...document.querySelectorAll('.variant-tile-title')].map((title) => title.textContent);
    expect(titles).toEqual(['Blizzard L2', 'Blizzard L3', 'Blizzard L5 450', 'Blizzard L5 360']);
  });

  it('трубчатые радиаторы: серии с названием бренда над названием серии', () => {
    render(<VariantList category={findCategory('radiators', 'tubular')} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Серии');
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    // Плитки-«папки» Velar и Kohr ведут на страницы со всеми моделями бренда
    expect(within(cards[0]).getByRole('link')).toHaveAttribute('href', '/radiators/velar.html');
    expect(within(cards[1]).getByRole('link')).toHaveAttribute('href', '/radiators/kohr.html');
    const heading = cards[3].querySelector('.variant-tile-title');
    expect(heading).toHaveTextContent('Zehnder');
    expect(heading).toHaveTextContent('Charleston');
  });

  it('по нажатию на плитку раскрывается карточка модели, повторное нажатие — сворачивает', async () => {
    const user = userEvent.setup();
    render(<VariantList category={findCategory('ventilation', 'units')} />);
    const tile = screen.getByRole('button', { name: /Blizzard L3/ });
    const panel = document.getElementById(tile.getAttribute('aria-controls'));
    expect(tile).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
    await user.click(tile);
    expect(tile).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toBeVisible();
    expect(within(panel).getByText('Производительность')).toBeInTheDocument();
    await user.click(within(panel).getByRole('button', { name: /Свернуть/ }));
    expect(tile).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
    // Фокус вернулся на плитку, а не улетел в начало страницы
    expect(tile).toHaveFocus();
  });

  it('модели без группы не пропадают, если у других моделей группа есть', () => {
    const category = {
      slug: 'mix',
      title: 'Смешанная',
      variants: [
        { title: 'Первая', image: 'x.jpg', group: 'Группа', text: ['А'] },
        { title: 'Без группы', image: 'y.jpg', text: ['Б'] },
      ],
    };
    render(<VariantList category={category} />);
    const titles = [...document.querySelectorAll('.variant-tile-title')].map((title) => title.textContent);
    expect(titles).toEqual(['Первая', 'Без группы']);
  });

  it('без вариантов ничего не выводит', () => {
    const { container } = render(<VariantList category={{ title: 'Пусто' }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
