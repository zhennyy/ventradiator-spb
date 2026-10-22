// Мелкие помощники для текста: заглушки [ЗАГЛУШКА…] / [РЕКВИЗИТЫ…], ссылки tel: и номера карточек.
const STUB_PATTERN = /\[(?:ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]/g;

// Заглушки видны жёлтым в разработке (npm run dev) и в тестах; в готовой сборке (npm run build)
// поля, где вместо данных только заглушка, просто не выводятся — на сайте не будет пустых «[ЗАГЛУШКА]».
export const SHOW_STUBS = !import.meta.env?.PROD;

// Вся строка — одна заглушка (например, адрес офиса, который ещё не прислали)
export function isStub(value) {
  return /^\[(?:ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]$/.test(String(value ?? '').trim());
}

// Показывать ли поле: есть данные или мы в разработке, где заглушку нужно видеть
export function hasContent(value) {
  return Boolean(value) && (SHOW_STUBS || !isStub(value));
}

// Делит строку на куски: обычный текст и заглушки, чтобы заглушки подсветить жёлтым.
export function splitStubs(value) {
  const source = String(value ?? '');
  const parts = [];
  let position = 0;
  for (const match of source.matchAll(STUB_PATTERN)) {
    if (match.index > position) parts.push({ text: source.slice(position, match.index), isStub: false });
    parts.push({ text: match[0], isStub: true });
    position = match.index + match[0].length;
  }
  if (position < source.length) parts.push({ text: source.slice(position), isStub: false });
  return parts;
}

// Текст без заглушек — для meta description.
export function withoutStubs(value) {
  return String(value).replace(/\s*\[[^\]]*\]/g, '');
}

export function phoneHref(phone) {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

// «1 категория», «3 категории», «9 категорий» — русское склонение после числа
// Русское склонение после числа: plural(5, ['артикул', 'артикула', 'артикулов']) → «5 артикулов»
export function plural(count, [one, few, many]) {
  const lastTwo = count % 100;
  const last = count % 10;
  let word = many;
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) word = one;
    else if (last >= 2 && last <= 4) word = few;
  }
  return `${count} ${word}`;
}

export function countCategories(count) {
  const lastTwo = count % 100;
  const last = count % 10;
  let word = 'категорий';
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) word = 'категория';
    else if (last >= 2 && last <= 4) word = 'категории';
  }
  return `${count} ${word}`;
}
