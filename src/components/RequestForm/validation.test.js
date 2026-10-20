// Проверка полей формы и тексты сообщений.
import { describe, expect, it } from 'vitest';
import { MESSAGES, countDigits, messageForStatus, validateRequestForm } from './validation';

const VALID = { name: 'Анна', phone: '+7 (921) 555-12-34', consent: true };

describe('validateRequestForm', () => {
  it('корректная заявка проходит', () => {
    expect(validateRequestForm(VALID)).toEqual({ invalid: { name: false, phone: false }, problem: null });
  });

  it('имя короче двух символов и телефон не из 10–15 цифр — ошибка, фокус на первое неверное поле', () => {
    expect(validateRequestForm({ ...VALID, name: ' А ' }).problem).toEqual({
      message: MESSAGES.invalid,
      field: 'name',
    });
    expect(validateRequestForm({ ...VALID, phone: '12345' }).problem).toEqual({
      message: MESSAGES.invalid,
      field: 'phone',
    });
    expect(validateRequestForm({ ...VALID, phone: '1'.repeat(16) }).invalid.phone).toBe(true);
    expect(validateRequestForm({ name: '', phone: '', consent: false }).invalid).toEqual({ name: true, phone: true });
  });

  it('без согласия — отдельное сообщение', () => {
    expect(validateRequestForm({ ...VALID, consent: false }).problem).toEqual({
      message: MESSAGES.consent,
      field: 'consent',
    });
  });

  it('считает только цифры телефона', () => {
    expect(countDigits('+7 (921) 555-12-34')).toBe(11);
  });

  it('сообщение по ответу сервера', () => {
    expect(messageForStatus(200)).toBe(MESSAGES.success);
    expect(messageForStatus(429)).toBe(MESSAGES.tooMany);
    expect(messageForStatus(503)).toBe(MESSAGES.failed);
  });
});
