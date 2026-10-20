// Проверка сайта в браузере (Playwright + Chromium): обходит все страницы на ширине 1366 и 390,
// собирает ошибки консоли и проверяет, что нет горизонтальной прокрутки; снимает скриншоты ключевых страниц.
//
//   npm run build && node tools/screenshots.js --out /tmp/blizzard-shots
//
// Нужен установленный Chromium для Playwright (PLAYWRIGHT_BROWSERS_PATH). В `npm test` не входит.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { createApp } = require('../server/app');

const WIDTHS = [1366, 390];
const SHOTS = [
  ['home', '/'],
  ['ventilation', '/ventilation.html'],
  ['product', '/ventilation/r2.html'],
  ['objects', '/objects.html'],
];

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1] : fallback;
}

function listPages(distDir) {
  const pages = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) pages.push('/' + path.relative(distDir, full).split(path.sep).join('/'));
    }
  };
  walk(distDir);
  return pages;
}

async function checkPage(page, url, problems) {
  const errors = [];
  const onConsole = (message) => message.type() === 'error' && errors.push(message.text());
  const onError = (error) => errors.push(error.message);
  page.on('console', onConsole);
  page.on('pageerror', onError);
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  const expectedStatus = url.endsWith('/404.html') ? 200 : response.status();
  if (expectedStatus >= 400) problems.push(`${url}: статус ${response.status()}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${url}: горизонтальная прокрутка ${overflow}px`);
  page.off('console', onConsole);
  page.off('pageerror', onError);
  errors.forEach((text) => problems.push(`${url}: консоль — ${text}`));
}

async function main() {
  const outDir = readArgument('--out', '/tmp/blizzard-shots');
  const distDir = path.join(__dirname, '..', 'dist');
  fs.mkdirSync(outDir, { recursive: true });
  const app = createApp({ env: {}, logger: { info() {}, error() {} } });
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const problems = [];
  try {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: width > 500 ? 860 : 844 } });
      for (const pagePath of listPages(distDir)) await checkPage(page, base + pagePath, problems);
      for (const [name, pagePath] of SHOTS) {
        await page.goto(base + pagePath, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
      }
      await page.close();
    }
    await captureMenus(browser, base, outDir);
  } finally {
    await browser.close();
    app.locals.stopRateLimiter();
    server.close();
  }
  console.log(`Скриншоты: ${outDir}`);
  console.log(problems.length ? `Проблемы:\n  ${problems.join('\n  ')}` : 'Проблем не найдено');
  process.exitCode = problems.length ? 1 : 0;
}

// Открытое выпадающее меню на десктопе (с клавиатуры) и мобильное меню.
async function captureMenus(browser, base, outDir) {
  const desktop = await browser.newPage({ viewport: { width: 1366, height: 700 } });
  await desktop.goto(base + '/', { waitUntil: 'networkidle' });
  await desktop.focus('.nav-toggle');
  await desktop.keyboard.press('Enter');
  await desktop.waitForTimeout(400);
  await desktop.screenshot({ path: path.join(outDir, 'menu-dropdown-1366.png') });
  await desktop.close();
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(base + '/', { waitUntil: 'networkidle' });
  await mobile.click('[data-menu-button]');
  await mobile.click('.nav-toggle');
  await mobile.waitForTimeout(400);
  await mobile.screenshot({ path: path.join(outDir, 'menu-mobile-390.png') });
  await mobile.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
