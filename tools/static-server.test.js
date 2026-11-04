// @vitest-environment node
// Локальный сервер ведёт себя как статический хостинг: адреса без .html, 404, заголовки из public/_headers, без выхода из dist/.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createStaticServer, readSiteHeaders } from './static-server.js';

let server;
let base;
let dir;

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
  fs.mkdirSync(path.join(dir, 'ventilation'));
  fs.writeFileSync(path.join(dir, 'index.html'), '<h1>Главная</h1>');
  fs.writeFileSync(path.join(dir, 'ventilation.html'), '<h1>Вентиляция</h1>');
  fs.writeFileSync(path.join(dir, 'ventilation', 'l2.html'), '<h1>L2</h1>');
  fs.writeFileSync(path.join(dir, '404.html'), '<h1>Нет такой страницы</h1>');
  server = createStaticServer({ distDir: dir });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(() => {
  server.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

describe('локальный сервер', () => {
  it('отдаёт страницы с .html и без', async () => {
    expect(await (await fetch(`${base}/`)).text()).toContain('Главная');
    expect(await (await fetch(`${base}/ventilation`)).text()).toContain('Вентиляция');
    expect(await (await fetch(`${base}/ventilation/l2.html`)).text()).toContain('L2');
  });

  it('неизвестный адрес — 404 со страницей ошибки', async () => {
    const response = await fetch(`${base}/nope`);
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('Нет такой страницы');
  });

  it('не выпускает за пределы dist/', async () => {
    expect((await fetch(`${base}/..%2fpackage.json`)).status).toBe(404);
  });

  it('ставит заголовки безопасности из public/_headers', async () => {
    const headers = readSiteHeaders();
    expect(headers['Content-Security-Policy']).toContain("script-src 'self'");
    const response = await fetch(`${base}/`);
    expect(response.headers.get('content-security-policy')).toBe(headers['Content-Security-Policy']);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('принимает только GET и HEAD', async () => {
    expect((await fetch(`${base}/`, { method: 'POST' })).status).toBe(405);
  });
});
