// Шапка: выпадающие списки (мышь и клавиатура), мобильное меню, ссылка «Запросить цену».
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Header from './Header';

function renderHeader(props = {}) {
  const user = userEvent.setup();
  render(<Header currentPath="/ventilation/units.html" hasForm {...props} />);
  const toggle = screen.getByRole('button', { name: 'Подменю: Вентиляция' });
  const item = toggle.closest('li');
  return { user, toggle, item };
}

describe('Header: выпадающие списки', () => {
  it('отмечает текущий раздел и текущую категорию', () => {
    const { item } = renderHeader();
    expect(within(item).getByRole('link', { name: 'Вентиляция' })).toHaveClass('is-current');
    expect(within(item).getByRole('link', { name: 'Вентиляционные установки Blizzard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('открывается и закрывается кнопкой, открытым бывает только один список', async () => {
    const { user, toggle, item } = renderHeader();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(item).toHaveClass('is-open');

    const otherToggle = screen.getByRole('button', { name: 'Подменю: Пылеудаление' });
    await user.click(otherToggle);
    expect(otherToggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(otherToggle);
    expect(otherToggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('с клавиатуры: ↓ открывает и ведёт по ссылкам, ↑ идёт по кругу, Esc закрывает и возвращает фокус', async () => {
    const { user, toggle, item } = renderHeader();
    const links = within(item.querySelector('.dropdown')).getAllByRole('link');
    toggle.focus();
    await user.keyboard('{ArrowDown}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(links[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(links[1]).toHaveFocus();
    await user.keyboard('{ArrowUp}{ArrowUp}');
    expect(links[links.length - 1]).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('закрывается, когда фокус уходит из пункта меню или клик мимо', async () => {
    const { user, toggle } = renderHeader();
    await user.click(toggle);
    await user.click(document.body);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    toggle.focus();
    await user.keyboard('{ArrowDown}');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    act(() => screen.getByRole('link', { name: 'Объекты' }).focus());
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Header: мобильное меню', () => {
  it('кнопка «Меню» открывает меню, Esc закрывает и возвращает фокус на кнопку', async () => {
    const { user } = renderHeader();
    const menuButton = screen.getByRole('button', { name: 'Меню' });
    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(document.body).toHaveClass('menu-open');
    await user.keyboard('{Escape}');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.body).not.toHaveClass('menu-open');
    expect(menuButton).toHaveFocus();
  });

  it('закрывается при нажатии на ссылку в меню', async () => {
    const { user } = renderHeader();
    document.addEventListener('click', (event) => event.preventDefault(), { capture: true, once: true });
    await user.click(screen.getByRole('button', { name: 'Меню' }));
    await user.click(screen.getByRole('link', { name: 'Запросить цену' }));
    expect(screen.getByRole('button', { name: 'Меню' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Header: кнопка звонка', () => {
  it('ведёт на телефон офиса и подписана для экранных дикторов', () => {
    renderHeader();
    const call = screen.getByRole('link', { name: 'Позвонить: +7 (812) 777-18-25' });
    expect(call).toHaveAttribute('href', 'tel:+78127771825');
    expect(call).toHaveClass('header-call');
  });
});

describe('Header: «Запросить цену»', () => {
  it('ведёт к форме на этой странице, а если формы нет — к форме на странице контактов', () => {
    const { unmount } = render(<Header currentPath="/ventilation/units.html" hasForm />);
    expect(screen.getByRole('link', { name: 'Запросить цену' })).toHaveAttribute('href', '#request');
    unmount();
    render(<Header currentPath="/about.html" hasForm={false} />);
    expect(screen.getByRole('link', { name: 'Запросить цену' })).toHaveAttribute('href', '/contacts.html#request');
    expect(screen.getByRole('link', { name: 'О компании' })).toHaveAttribute('aria-current', 'page');
  });
});
