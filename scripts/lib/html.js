// Мелкие помощники для шаблонов: экранирование и подсветка заглушек.
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (symbol) => ENTITIES[symbol]);
}

// Текст из данных: экранируем и выделяем [ЗАГЛУШКА…] и [РЕКВИЗИТЫ…], чтобы их было видно на странице.
function text(value) {
  return escapeHtml(value).replace(/\[(ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]/g, (stub) => `<span class="stub">${stub}</span>`);
}

function isStub(value) {
  return /^\[(ЗАГЛУШКА|РЕКВИЗИТЫ)[^\]]*\]$/.test(String(value).trim());
}

function joinHtml(items, render) {
  return items.map(render).join('\n');
}

function phoneHref(phone) {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}

function pad(number) {
  return String(number).padStart(2, '0');
}

module.exports = { escapeHtml, text, isStub, joinHtml, phoneHref, pad };
