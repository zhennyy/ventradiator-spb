// Мелкие помощники для текста: заглушки [ЗАГЛУШКА…] / [РЕКВИЗИТЫ…], ссылки tel: и номера карточек.
const STUB_PATTERN = /\[(?:ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]/g;

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

export function isStub(value) {
  return /^\[(ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]$/.test(String(value).trim());
}

// Текст без заглушек — для meta description.
export function withoutStubs(value) {
  return String(value).replace(/\s*\[[^\]]*\]/g, '');
}

export function phoneHref(phone) {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

// «1 категория», «3 категории», «9 категорий» — русское склонение после числа
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
