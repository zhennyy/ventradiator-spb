// Хлебные крошки: начинаются с главной, последняя — текущая страница.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('начинаются с главной, последняя крошка — текущая страница без ссылки', () => {
    render(
      <Breadcrumbs
        crumbs={[
          { href: '/ventilation.html', label: 'Вентиляция' },
          { href: '/ventilation/l2.html', label: 'Blizzard L2' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Главная', '/'],
      ['Вентиляция', '/ventilation.html'],
    ]);
    const current = within(nav).getByText('Blizzard L2');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
  });

  it('на главной не выводятся', () => {
    const { container } = render(<Breadcrumbs crumbs={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
