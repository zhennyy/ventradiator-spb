// Локальный просмотр собранного сайта (npm start) и сервер для проверок в браузере (tools/smoke.js, tools/screens.js).
// Отдаёт dist/ как статический хостинг: адрес без .html → <адрес>.html, неизвестный адрес → 404.html,
// заголовки безопасности — из public/_headers (те же, что на Netlify), чтобы локально было как на хостинге.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// Заголовки из блока «/*» файла public/_headers
export function readSiteHeaders(file = path.join(ROOT, 'public', '_headers')) {
  const headers = {};
  let inBlock = false;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      inBlock = line.trim() === '/*';
      continue;
    }
    const match = /^\s+([\w-]+):\s*(.+)$/.exec(line);
    if (inBlock && match) headers[match[1]] = match[2].trim();
  }
  return headers;
}

function resolveFile(distDir, urlPath) {
  let clean;
  try {
    clean = path.posix.normalize(decodeURIComponent(urlPath));
  } catch {
    return null;
  }
  const candidates = clean.endsWith('/') ? [`${clean}index.html`] : [clean, `${clean}.html`];
  for (const candidate of candidates) {
    const file = path.join(distDir, candidate);
    if (!file.startsWith(distDir + path.sep)) return null;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

export function createStaticServer({ distDir = DIST } = {}) {
  const siteHeaders = readSiteHeaders();
  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    const file = resolveFile(distDir, new URL(req.url, 'http://localhost').pathname);
    const found = Boolean(file);
    const target = file || path.join(distDir, '404.html');
    res.writeHead(found ? 200 : 404, {
      ...siteHeaders,
      'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': target.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(target).pipe(res);
  });
}

// Для проверок: сервер на свободном порту
export async function startServer() {
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return { base: `http://127.0.0.1:${server.address().port}`, stop: () => server.close() };
}

// npm start
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('Сначала соберите сайт: npm run build');
    process.exit(1);
  }
  const port = Number(process.env.PORT) || 3000;
  createStaticServer().listen(port, () => console.log(`Сайт: http://localhost:${port}`));
}
