// Скриншоты ключевых страниц на всех контрольных ширинах (телефоны, планшеты, ноутбуки, широкий экран)
// и открытое мобильное меню — для ручной проверки адаптивной вёрстки. Заодно ищет горизонтальную прокрутку.
//
//   npm run build && npm run screens                (скриншоты — в /tmp/blizzard-screens, или --out <папка>)
//   node tools/screens.js --widths 390,834 --pages home,product
//
// Нужен установленный Chromium для Playwright (PLAYWRIGHT_BROWSERS_PATH).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { waitForHydration } from './smoke-checks.js';
import { startServer } from './smoke-server.js';

// [имя, ширина, высота окна]
const VIEWPORTS = [
  ['360', 360, 780],
  ['390', 390, 844],
  ['430', 430, 932],
  ['768', 768, 1024],
  ['834', 834, 1194],
  ['1024', 1024, 1366],
  ['1024l', 1024, 768],
  ['1280', 1280, 800],
  ['1366', 1366, 768],
  ['1440', 1440, 900],
  ['1920', 1920, 1080],
];
const PAGES = [
  ['home', '/'],
  ['ventilation', '/ventilation.html'],
  ['dust', '/dust-removal.html'],
  ['product', '/ventilation/r2.html'],
  ['product-v2', '/dust-removal/v2.html'],
  ['objects', '/objects.html'],
  ['about', '/about.html'],
  ['contacts', '/contacts.html'],
];
const MENU_MAX_WIDTH = 1024;

function readList(name) {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1].split(',') : null;
}

async function shoot(page, base, outDir, name, pagePath, problems) {
  await page.goto(base + pagePath, { waitUntil: 'networkidle' });
  await waitForHydration(page);
  await page.evaluate(() => document.fonts.ready);
  // Картинки грузятся лениво — прокручиваем страницу, чтобы на полном скриншоте были все фото.
  await page.evaluate(async () => {
    for (let top = 0; top < document.body.scrollHeight; top += window.innerHeight) {
      window.scrollTo({ top, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    const loaded = [...document.images].map((image) => image.decode().catch(() => {}));
    await Promise.race([Promise.all(loaded), new Promise((resolve) => setTimeout(resolve, 2000))]);
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${name}: горизонтальная прокрутка ${overflow}px`);
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
}

async function main() {
  const outIndex = process.argv.indexOf('--out');
  const outDir = outIndex > 0 ? process.argv[outIndex + 1] : '/tmp/blizzard-screens';
  const widths = readList('--widths');
  const pageNames = readList('--pages');
  fs.mkdirSync(outDir, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch();
  const problems = [];
  try {
    for (const [label, width, height] of VIEWPORTS) {
      if (widths && !widths.includes(label)) continue;
      const page = await browser.newPage({ viewport: { width, height }, hasTouch: width <= MENU_MAX_WIDTH });
      for (const [pageName, pagePath] of PAGES) {
        if (pageNames && !pageNames.includes(pageName)) continue;
        await shoot(page, server.base, outDir, `${pageName}-${label}`, pagePath, problems);
      }
      if (width <= MENU_MAX_WIDTH) {
        await page.goto(server.base + '/', { waitUntil: 'networkidle' });
        await waitForHydration(page);
        await page.click('.menu-button');
        await page.locator('.nav-toggle').first().click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(outDir, `menu-${label}.png`) });
      }
      await page.close();
    }
  } finally {
    await browser.close();
    server.stop();
  }
  console.log(`Скриншоты: ${outDir}`);
  console.log(problems.length ? `Проблемы:\n  ${problems.join('\n  ')}` : 'Горизонтальной прокрутки нет');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
