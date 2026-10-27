// Проверка собранного сайта в браузере (Playwright + Chromium): все страницы на 1366, 834 и 390 px —
// 0 ошибок и предупреждений в консоли (в том числе о гидратации), нет горизонтальной прокрутки, нет битых
// внутренних ссылок и картинок; после гидратации работают меню и форма. Плюс скриншоты ключевых страниц.
//
//   npm run build && npm run smoke            (скриншоты — в /tmp/blizzard-shots, или --out <папка>)
//
// Нужен установленный Chromium для Playwright (PLAYWRIGHT_BROWSERS_PATH). В `npm test` и CI не входит.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  checkDesktopMenu,
  checkHeaderCall,
  checkContacts,
  checkMobileMenu,
  checkPage,
  closeMobileMenu,
  waitForHydration,
} from './smoke-checks.js';
import { startServer } from './smoke-server.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const WIDTHS = [1366, 834, 390];
const SHOTS = [
  ['home', '/'],
  ['ventilation', '/ventilation.html'],
  ['product', '/ventilation/r2.html'],
];

function readArgument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1] : fallback;
}

function listPages(dir) {
  const pages = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) pages.push('/' + path.relative(dir, full).split(path.sep).join('/'));
    }
  };
  walk(dir);
  return pages.sort();
}

async function openPage(browser, width, height) {
  return browser.newPage({ viewport: { width, height: height || (width > 500 ? 860 : 844) } });
}

async function checkInteractions(browser, base, outDir, problems) {
  const desktop = await browser.newPage({ viewport: { width: 1366, height: 700 } });
  await desktop.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await desktop.goto(base + '/ventilation/units.html', { waitUntil: 'networkidle' });
  await waitForHydration(desktop);
  await checkDesktopMenu(desktop, problems);
  await checkHeaderCall(desktop, problems, 1366);
  await desktop.focus('.nav-toggle');
  await desktop.keyboard.press('Enter');
  await desktop.waitForTimeout(400);
  await desktop.screenshot({ path: path.join(outDir, 'menu-dropdown-1366.png') });
  await desktop.goto(base + '/ventilation/r2.html#request', { waitUntil: 'networkidle' });
  await waitForHydration(desktop);
  await checkContacts(desktop, problems);
  await desktop.close();

  // Планшет и телефон: меню свёрнуто в кнопку, рядом — кнопка звонка
  for (const width of [834, 390]) {
    const mobile = await openPage(browser, width);
    await mobile.goto(base + '/', { waitUntil: 'networkidle' });
    await waitForHydration(mobile);
    await checkHeaderCall(mobile, problems, width);
    await checkMobileMenu(mobile, problems);
    await mobile.waitForTimeout(400);
    await mobile.screenshot({ path: path.join(outDir, `menu-mobile-${width}.png`) });
    await closeMobileMenu(mobile, problems);
    await mobile.close();
  }
}

async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Сначала соберите сайт: npm run build');
  const outDir = readArgument('--out', '/tmp/blizzard-shots');
  fs.mkdirSync(outDir, { recursive: true });
  const telegramCalls = [];
  const server = await startServer(telegramCalls);
  const browser = await chromium.launch();
  const problems = [];
  const pages = listPages(DIST);
  const linkCache = new Map();
  try {
    for (const width of WIDTHS) {
      const page = await openPage(browser, width);
      for (const pagePath of pages) await checkPage(page, server.base, pagePath, linkCache, problems);
      for (const [name, pagePath] of SHOTS) {
        await page.goto(server.base + pagePath, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(outDir, `${name}-${width}.png`), fullPage: true });
      }
      await page.close();
    }
    await checkInteractions(browser, server.base, outDir, problems);
  } finally {
    await browser.close();
    server.stop();
  }
  console.log(`Проверено страниц: ${pages.length} × ${WIDTHS.length} ширины. Скриншоты: ${outDir}`);
  console.log(problems.length ? `Проблемы:\n  ${problems.join('\n  ')}` : 'Проблем не найдено');
  process.exitCode = problems.length ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
