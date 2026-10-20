// Проверка формы заявки в браузере (та же логика ещё раз выполняется на сервере — server/validate.js)
// и тексты сообщений в строке статуса.
export const MESSAGES = {
  sending: 'Отправляем…',
  success: 'Спасибо! Заявка отправлена — мы перезвоним в рабочее время.',
  consent: 'Отметьте согласие на обработку персональных данных.',
  invalid: 'Проверьте имя и телефон.',
  tooMany: 'Слишком много заявок подряд. Попробуйте через несколько минут или позвоните нам.',
  failed: 'Не удалось отправить заявку. Позвоните нам, пожалуйста.',
};

export function countDigits(value) {
  return (value.match(/\d/g) || []).length;
}

// Возвращает { invalid: { name, phone }, problem } — problem: { message, field } или null, если всё верно.
export function validateRequestForm({ name, phone, consent }) {
  const phoneDigits = countDigits(phone);
  const invalid = { name: name.trim().length < 2, phone: phoneDigits < 10 || phoneDigits > 15 };
  let problem = null;
  if (invalid.name) problem = { message: MESSAGES.invalid, field: 'name' };
  else if (invalid.phone) problem = { message: MESSAGES.invalid, field: 'phone' };
  else if (!consent) problem = { message: MESSAGES.consent, field: 'consent' };
  return { invalid, problem };
}

// Текст ответа сервера для строки статуса.
export function messageForStatus(status) {
  if (status >= 200 && status < 300) return MESSAGES.success;
  return status === 429 ? MESSAGES.tooMany : MESSAGES.failed;
}
