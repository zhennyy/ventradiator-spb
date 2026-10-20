// Проверка заявки с сайта. Возвращает { ok, data } или { ok: false, error }.
export const LIMITS = { nameMin: 2, nameMax: 80, phoneDigitsMin: 10, phoneDigitsMax: 15, comment: 1000, product: 120 };

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateRequest(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Пустая заявка' };

  const name = cleanString(body.name);
  const phone = cleanString(body.phone);
  const comment = cleanString(body.comment);
  const product = cleanString(body.product);
  const phoneDigits = phone.replace(/\D/g, '');

  if (body.consent !== true) return { ok: false, error: 'Нужно согласие на обработку персональных данных' };
  if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) return { ok: false, error: 'Проверьте имя' };
  if (!/^[\d\s()+-]+$/.test(phone)) return { ok: false, error: 'Проверьте телефон' };
  if (phoneDigits.length < LIMITS.phoneDigitsMin || phoneDigits.length > LIMITS.phoneDigitsMax) {
    return { ok: false, error: 'Проверьте телефон' };
  }
  if (comment.length > LIMITS.comment) return { ok: false, error: 'Комментарий слишком длинный' };
  if (product.length > LIMITS.product) return { ok: false, error: 'Слишком длинное название товара' };

  return { ok: true, data: { name, phone, comment, product } };
}
