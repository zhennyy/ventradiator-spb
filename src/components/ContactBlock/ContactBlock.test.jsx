// Блок контактов: крупный телефон, ссылки на почту/Telegram/MAX и «скоро появится» для пустых полей.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { site } from '../../lib/content';
import ContactBlock, { channelLinks } from './ContactBlock';

const saved = { ...site.contacts };
afterEach(() => {
  site.contacts = { ...saved };
});

describe('ContactBlock', () => {
  it('собирает ссылки: t.me без @, MAX ссылкой или подписью', () => {
    const links = channelLinks({ email: 'a@b.ru', telegram: '@shop', max: 'https://max.ru/x' });
    expect(links[0]).toMatchObject({ label: 'Почта', copy: 'a@b.ru' });
    expect(links[1]).toMatchObject({ href: 'https://t.me/shop', text: '@shop' });
    expect(links[2]).toMatchObject({ href: 'https://max.ru/x', text: 'Написать в чат' });
    expect(channelLinks({ max: '+7 123' })[2]).toMatchObject({ label: 'MAX', copy: '+7 123' });
  });

  it('заполненные контакты — ссылки, якорь #request и заголовок на месте', () => {
    site.contacts = {
      phone: '+7 (812) 123-45-67',
      email: 'a@b.ru',
      telegram: 'shop',
      max: 'https://max.ru/x',
      hours: 'Пн–Пт',
    };
    const { container } = render(<ContactBlock heading="Запросить цену: Радиаторы" />);
    expect(container.querySelector('section#request')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Запросить цену: Радиаторы' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+7 (812) 123-45-67' })).toHaveAttribute('href', 'tel:+78121234567');
    expect(screen.getByRole('link', { name: /Telegram/ })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Пн–Пт')).toBeInTheDocument();
  });

  it('по нажатию на почту копирует адрес и пишет «Скопировано»', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    site.contacts = { ...saved, email: 'a@b.ru' };
    render(<ContactBlock />);
    const button = screen.getByRole('button', { name: 'Скопировать почту: a@b.ru' });
    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith('a@b.ru');
    expect(await within(button).findByText('Скопировано', { selector: 'small' })).toBeInTheDocument();
    expect(within(button).getByRole('status')).toHaveTextContent('Скопировано');
  });

  it('номер MAX тоже копируется по нажатию', async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    site.contacts = { ...saved, max: '+7 (812) 000-00-00' };
    render(<ContactBlock />);
    await userEvent.click(screen.getByRole('button', { name: 'Скопировать номер MAX: +7 (812) 000-00-00' }));
    expect(writeText).toHaveBeenCalledWith('+7 (812) 000-00-00');
  });

  it('пустые поля — не ссылки, а «скоро появится»', () => {
    site.contacts = { phone: '', email: '', telegram: '', max: '', hours: '' };
    render(<ContactBlock />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('Телефон скоро появится')).toBeInTheDocument();
    expect(screen.getAllByText('скоро появится')).toHaveLength(3);
  });
});
