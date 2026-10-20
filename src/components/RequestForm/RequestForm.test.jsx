// Форма заявки: проверка полей, обязательное согласие, отправка JSON и ответы сервера (fetch подменён).
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RequestForm from './RequestForm';
import { MESSAGES } from './validation';

function setup(props = {}, response = { ok: true, status: 200 }) {
  const fetchMock = vi.fn(async () => response);
  vi.stubGlobal('fetch', fetchMock);
  const user = userEvent.setup();
  render(<RequestForm {...props} />);
  const fields = {
    name: screen.getByLabelText('Имя'),
    phone: screen.getByLabelText('Телефон'),
    comment: screen.getByLabelText(/Комментарий/),
    consent: screen.getByRole('checkbox'),
    submit: screen.getByRole('button', { name: 'Отправить заявку' }),
    status: screen.getByRole('status'),
  };
  const fillValid = async () => {
    await user.type(fields.name, 'Анна');
    await user.type(fields.phone, '+7 (921) 555-12-34');
  };
  return { user, fetchMock, fields, fillValid };
}

describe('RequestForm', () => {
  it('согласие по умолчанию не отмечено, форма ведёт на /api/request', () => {
    const { fields } = setup();
    expect(fields.consent).not.toBeChecked();
    expect(fields.submit.closest('form')).toHaveAttribute('action', '/api/request');
  });

  it('пустая форма: ошибка, поля помечены неверными, фокус на имени, запрос не уходит', async () => {
    const { user, fetchMock, fields } = setup();
    await user.click(fields.submit);
    expect(fields.status).toHaveTextContent(MESSAGES.invalid);
    expect(fields.status).toHaveAttribute('data-state', 'error');
    expect(fields.name).toHaveAttribute('aria-invalid', 'true');
    expect(fields.phone).toHaveAttribute('aria-invalid', 'true');
    expect(fields.name).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('без согласия заявка не отправляется, фокус на галочке', async () => {
    const { user, fetchMock, fields, fillValid } = setup();
    await fillValid();
    await user.click(fields.submit);
    expect(fields.status).toHaveTextContent(MESSAGES.consent);
    expect(fields.name).toHaveAttribute('aria-invalid', 'false');
    expect(fields.consent).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('отправляет JSON с товаром и согласием, показывает «Спасибо» и очищает форму', async () => {
    const { user, fetchMock, fields, fillValid } = setup({ product: 'Blizzard L2', heading: 'Запросить цену: L2' });
    expect(screen.getByRole('heading', { name: 'Запросить цену: L2' })).toBeInTheDocument();
    expect(screen.getByText('Blizzard L2', { selector: 'b' })).toBeInTheDocument();
    await fillValid();
    await user.type(fields.comment, 'Дом 150 м²');
    await user.click(fields.consent);
    await user.click(fields.submit);
    await waitFor(() => expect(fields.status).toHaveTextContent(MESSAGES.success));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/request');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      name: 'Анна',
      phone: '+7 (921) 555-12-34',
      comment: 'Дом 150 м²',
      product: 'Blizzard L2',
      consent: true,
    });
    expect(fields.status).toHaveAttribute('data-state', 'success');
    expect(fields.name).toHaveValue('');
    expect(fields.consent).not.toBeChecked();
    expect(fields.submit).toBeEnabled();
  });

  it('429 — просим подождать, ошибка сети — просим позвонить', async () => {
    const { user, fields, fillValid } = setup({}, { ok: false, status: 429 });
    await fillValid();
    await user.click(fields.consent);
    await user.click(fields.submit);
    await waitFor(() => expect(fields.status).toHaveTextContent(MESSAGES.tooMany));
    expect(fields.name).toHaveValue('Анна');

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    await user.click(fields.submit);
    await waitFor(() => expect(fields.status).toHaveTextContent(MESSAGES.failed));
    expect(fields.status).toHaveAttribute('data-state', 'error');
  });
});
