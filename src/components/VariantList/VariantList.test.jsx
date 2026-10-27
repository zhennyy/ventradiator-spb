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
    const titles = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(titles).toEqual(['Blizzard L2', 'Blizzard L3', 'Blizzard L5 450', 'Blizzard L5 360']);
  });

  it('трубчатые радиаторы: серии с названием бренда над названием серии', () => {
    render(<VariantList category={findCategory('radiators', 'tubular')} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Серии');
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(4);
    // Плитки-«папки» Velar, Kohr и Rifar ведут на страницы со всеми моделями бренда
    expect(within(cards[0]).getByRole('link')).toHaveAttribute('href', '/radiators/velar.html');
    expect(within(cards[1]).getByRole('link')).toHaveAttribute('href', '/radiators/kohr.html');
    expect(within(cards[2]).getByRole('link')).toHaveAttribute('href', '/radiators/rifar.html');
    const heading = within(cards[3]).getByRole('heading', { level: 3 });
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
  });

  it('без вариантов ничего не выводит', () => {
    const { container } = render(<VariantList category={{ title: 'Пусто' }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('большое фото открывается крупно и листается стрелками', async () => {
    const user = userEvent.setup();
    const category = catalog.sections
      .find((section) => section.slug === 'radiators')
      .nestedCategories.find((item) => item.slug === 'velar');
    render(<VariantList category={category} />);
    await user.click(screen.getByText('S', { selector: '.variant-tile .variant-series' }).closest('button'));
    await user.click(screen.getByRole('button', { name: /Открыть фото крупно/ }));
    const dialog = screen.getByLabelText('Просмотр фото', { selector: 'dialog' });
    expect(within(dialog).getByText('1 / 2')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Следующее фото', hidden: true }));
    expect(within(dialog).getByText('2 / 2')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Закрыть', hidden: true }));
    expect(within(dialog).queryByText('2 / 2')).not.toBeInTheDocument();
  });
});
