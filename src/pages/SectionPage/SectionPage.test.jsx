// Страница раздела: карточка на каждую категорию и блок преимуществ.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import SectionPage from './SectionPage';

describe('SectionPage', () => {
  it.each(catalog.sections.map((section) => [section.title, section]))(
    '%s: карточка на каждую категорию со ссылкой и номером',
    (title, section) => {
      render(<SectionPage section={section} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
      const grid = screen.getByRole('region', { name: 'Категории' });
      const links = within(grid).getAllByRole('link');
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        section.categories.map((category) => `/${section.slug}/${category.slug}.html`),
      );
      expect(within(links[0]).getByText('01')).toBeInTheDocument();
    },
  );

  it('преимущества выводятся, только если они есть в каталоге', () => {
    const [ventilation, dustRemoval] = catalog.sections;
    const { unmount } = render(<SectionPage section={ventilation} />);
    expect(screen.queryByRole('list', { name: 'Преимущества' })).toBeNull();
    unmount();
    render(<SectionPage section={dustRemoval} />);
    expect(within(screen.getByRole('list', { name: 'Преимущества' })).getAllByRole('listitem')).toHaveLength(
      dustRemoval.benefits.length,
    );
  });
});
