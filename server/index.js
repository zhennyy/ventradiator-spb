// Запуск сервера: node server/index.js (или npm start). Порт — из PORT, по умолчанию 3000.
// BOT_TOKEN и CHAT_ID берутся из окружения; без них сайт работает, а заявки получают ответ 503.
import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;
const app = createApp();

if (!process.env.BOT_TOKEN || !process.env.CHAT_ID) {
  console.warn('Внимание: BOT_TOKEN и/или CHAT_ID не заданы — заявки не будут доставляться в Telegram');
}

app.listen(port, () => {
  console.log(`Сайт представительства (СПб): http://localhost:${port}`);
});
