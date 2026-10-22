// @vitest-environment node
// Проверка заявки (validateRequest) и текст сообщения в Telegram (formatMessage).
import { expect, it } from 'vitest';
import { formatMessage } from './telegram.js';
import { validateRequest } from './validate.js';

const VALID = {
  name: 'Анна',
  phone: '+7 (921) 555-12-34',
  comment: 'Дом 150 м²',
  product: 'Blizzard L2',
  consent: true,
};
it('validateRequest: принимает корректную заявку и обрезает пробелы', () => {
  const result = validateRequest({ ...VALID, name: '  Анна  ' });
  expect(result.ok).toBe(true);
  expect(result.data.name).toBe('Анна');
});

it('validateRequest: согласие должно быть именно true', () => {
  for (const consent of [undefined, false, 'true', 'on', 1]) {
    expect(validateRequest({ ...VALID, consent }).ok, String(consent)).toBe(false);
  }
});

it('validateRequest: отклоняет плохие имя, телефон и длинный комментарий', () => {
  expect(validateRequest({ ...VALID, name: 'А' }).ok).toBe(false);
  expect(validateRequest({ ...VALID, phone: '12345' }).ok).toBe(false);
  expect(validateRequest({ ...VALID, phone: 'позвоните мне' }).ok).toBe(false);
  expect(validateRequest({ ...VALID, comment: 'x'.repeat(1001) }).ok).toBe(false);
  expect(validateRequest(null).ok).toBe(false);
});

it('formatMessage: товар и комментарий добавляются, только если заполнены', () => {
  expect(formatMessage({ name: 'Анна', phone: '+79215551234', comment: '', product: '' })).toBe(
    'Новая заявка с сайта (СПб)\nИмя: Анна\nТелефон: +79215551234',
  );
  expect(formatMessage(VALID)).toMatch(/Товар: Blizzard L2\nКомментарий: Дом 150 м²/);
});
