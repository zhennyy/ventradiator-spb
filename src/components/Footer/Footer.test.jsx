// Подвал: ссылки на все категории, документы и контакты.
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { catalog } from '../../lib/content';
import Footer from './Footer';

describe('Footer', () => {
  it('содержит ссылки на все категории каталога и документы', () => {
    render(<Footer />);
    for (const section of catalog.sections) {
      const column = screen.getByRole('link', { name: section.title }).closest('.footer-col');
      for (const category of section.categories) {
        const link = within(column).getByRole('link', { name: category.title });
        expect(link).toHaveAttribute('href', `/${section.slug}/${category.slug}.html`);
      }
    }
    expect(screen.getByRole('link', { name: 'Политика обработки персональных данных' })).toHaveAttribute(
      'href',
      '/privacy.html',
    );
    expect(screen.getByRole('link', { name: 'Согласие на обработку данных' })).toHaveAttribute('href', '/consent.html');
  });

  it('показывает телефон, почту и подсвечивает заглушку реквизитов', () => {
    const { container } = render(<Footer />);
    expect(screen.getByRole('link', { name: '+7 (812) 777-18-25' })).toHaveAttribute('href', 'tel:+78127771825');
    expect(screen.getByRole('link', { name: 'info@blizzard-lt.ru' })).toHaveAttribute(
      'href',
      'mailto:info@blizzard-lt.ru',
    );
    expect([...container.querySelectorAll('.stub')].map((stub) => stub.textContent)).toContain(
      '[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА]',
    );
  });
});
