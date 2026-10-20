// Отправка заявки в Telegram-чат через Bot API (sendMessage).
// fetchImpl подменяется в тестах, чтобы не ходить в сеть.
export function formatMessage({ name, phone, comment, product }) {
  const lines = ['Новая заявка с сайта Blizzard СПб', `Имя: ${name}`, `Телефон: ${phone}`];
  if (product) lines.push(`Товар: ${product}`);
  if (comment) lines.push(`Комментарий: ${comment}`);
  return lines.join('\n');
}

export async function sendToTelegram({ token, chatId, request, fetchImpl = fetch }) {
  const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: formatMessage(request), disable_web_page_preview: true }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    // Текст ответа Telegram не логируем целиком: в нём может оказаться содержимое заявки.
    throw new Error(`Telegram ответил статусом ${response.status}`);
  }
  return true;
}
