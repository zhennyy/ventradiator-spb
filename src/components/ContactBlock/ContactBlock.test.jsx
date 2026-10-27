// Блок контактов: крупный телефон, ссылки на почту/Telegram/MAX и «скоро появится» для пустых полей.
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { site } from '../../lib/content';
import ContactBlock, { channelLinks, splitPhone } from './ContactBlock';

const saved = { ...site.contacts };
afterEach(() => {
  site.contacts = { ...saved };
});

describe('ContactBlock', () => {
  it('делит телефон: последняя группа цифр отдельно', () => {
    expect(splitPhone('+7 (812) 123-45-67')).toEqual(['+7 (812) ', '123‑45‑67']);
  });

  it('собирает ссылки: mailto с темой, t.me без @, MAX как есть', () => {
    const links = channelLinks({ email: 'a@b.ru', telegram: '@shop', max: 'https://max.ru/x' }, 'Радиаторы');
    expect(links[0].href).toBe(`mailto:a@b.ru?subject=${encodeURIComponent('Запрос: Радиаторы')}`);
    expect(links[1]).toMatchObject({ href: 'https://t.me/shop', text: '@shop' });
    expect(links[2]).toMatchObject({ href: 'https://max.ru/x', text: 'Написать в чат' });
    expect(channelLinks({ max: 'по номеру 123' })[2]).toEqual({ label: 'MAX', href: null, text: 'по номеру 123' });
  });

  it('заполненные контакты — ссылки, якорь #request и заголовок на месте', () => {
    site.contacts = {
      phone: '+7 (812) 123-45-67',
      email: 'a@b.ru',
      telegram: 'shop',
      max: 'https://max.ru/x',
      hours: 'Пн–Пт',
    };
    const { container } = render(<ContactBlock heading="Запросить цену: Радиаторы" product="Радиаторы" />);
    expect(container.querySelector('section#request')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Запросить цену: Радиаторы' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /123/ })).toHaveAttribute('href', 'tel:+78121234567');
    expect(screen.getByRole('link', { name: /Telegram/ })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Пн–Пт')).toBeInTheDocument();
  });

  it('пустые поля — не ссылки, а «скоро появится»', () => {
    site.contacts = { phone: '', email: '', telegram: '', max: '', hours: '' };
    render(<ContactBlock />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Телефон скоро появится')).toBeInTheDocument();
    expect(screen.getAllByText('скоро появится')).toHaveLength(3);
  });
});
