// Проверки для tools/smoke.js: страница целиком (консоль, гидратация, прокрутка, ссылки),
// меню с клавиатуры и мобильное меню, форма заявки — всё уже после гидратации.

// React вешает на контейнер служебное свойство __reactContainer… — значит, гидратация прошла.
export async function waitForHydration(page) {
  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    return root && Object.keys(root).some((key) => key.startsWith('__reactContainer'));
  });
}

function sameOriginPath(base, href, currentPath) {
  const url = new URL(href, base + currentPath);
  return url.origin === new URL(base).origin ? { path: url.pathname, hash: url.hash.slice(1) } : null;
}

// Ссылки и картинки страницы: адрес отвечает 200, якорь есть на целевой странице.
export async function checkLinks(page, base, currentPath, cache, problems) {
  const targets = await page.evaluate(() => [
    ...[...document.querySelectorAll('a[href]')].map((link) => link.getAttribute('href')),
    ...[...document.querySelectorAll('img[src]')].map((image) => image.getAttribute('src')),
  ]);
  for (const href of new Set(targets)) {
    if (/^(mailto:|tel:)/.test(href)) continue;
    const target = sameOriginPath(base, href, currentPath);
    if (!target) continue;
    if (!cache.has(target.path)) {
      const response = await fetch(base + target.path);
      const body = response.headers.get('content-type')?.includes('text/html') ? await response.text() : '';
      cache.set(target.path, {
        status: response.status,
        ids: new Set([...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])),
      });
    }
    const { status, ids } = cache.get(target.path);
    if (status !== 200) problems.push(`${currentPath}: ссылка ${href} → статус ${status}`);
    else if (target.hash && !ids.has(target.hash)) problems.push(`${currentPath}: ссылка ${href} — нет якоря`);
  }
}

export async function checkPage(page, base, pagePath, cache, problems) {
  const messages = [];
  const onConsole = (message) => {
    if (['error', 'warning'].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
  };
  const onError = (error) => messages.push(`исключение: ${error.message}`);
  page.on('console', onConsole);
  page.on('pageerror', onError);
  const response = await page.goto(base + pagePath, { waitUntil: 'networkidle' });
  const isNotFound = pagePath === '/404.html';
  if (!isNotFound && response.status() !== 200) problems.push(`${pagePath}: статус ${response.status()}`);
  await waitForHydration(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${pagePath}: горизонтальная прокрутка ${overflow}px`);
  await checkLinks(page, base, pagePath, cache, problems);
  page.off('console', onConsole);
  page.off('pageerror', onError);
  messages.forEach((text) => problems.push(`${pagePath}: консоль — ${text}`));
}

async function expectState(problems, label, check) {
  try {
    if (!(await check())) problems.push(`меню/форма: ${label}`);
  } catch (error) {
    problems.push(`меню/форма: ${label} (${error.message.split('\n')[0]})`);
  }
}

// Десктоп: выпадающий список с клавиатуры (Enter, ↓, Esc).
export async function checkDesktopMenu(page, problems) {
  const toggle = page.locator('.nav-toggle').first();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expectState(
    problems,
    'Enter открывает список',
    async () => (await toggle.getAttribute('aria-expanded')) === 'true',
  );
  await expectState(problems, 'фокус на первой ссылке списка', () =>
    page.evaluate(() => document.activeElement === document.querySelector('.has-dropdown .dropdown a')),
  );
  await page.keyboard.press('ArrowDown');
  await expectState(problems, '↓ переводит на вторую ссылку', () =>
    page.evaluate(() => document.activeElement === document.querySelectorAll('.has-dropdown .dropdown a')[1]),
  );
  await page.keyboard.press('Escape');
  await expectState(problems, 'Esc закрывает и возвращает фокус', async () => {
    const expanded = await toggle.getAttribute('aria-expanded');
    return expanded === 'false' && (await toggle.evaluate((element) => element === document.activeElement));
  });
  await page.keyboard.press('ArrowDown');
  await expectState(problems, '↓ на закрытой кнопке открывает список и ведёт в него', () =>
    page.evaluate(() => document.activeElement === document.querySelector('.has-dropdown .dropdown a')),
  );
  await page.keyboard.press('Escape');
}

// Телефон: кнопка «Меню», подменю раздела, Esc.
export async function checkMobileMenu(page, problems) {
  await page.click('.menu-button');
  await expectState(problems, 'кнопка «Меню» открывает меню', () => page.locator('#site-nav').isVisible());
  await page.locator('.nav-toggle').first().click();
  await expectState(problems, 'подменю раздела раскрывается', () => page.locator('.dropdown').first().isVisible());
}

export async function closeMobileMenu(page, problems) {
  await page.keyboard.press('Escape');
  await expectState(
    problems,
    'Esc закрывает мобильное меню',
    async () => !(await page.locator('#site-nav').isVisible()),
  );
}

// Форма: пустая → ошибка, без согласия → просьба отметить, с согласием → «Спасибо».
export async function checkForm(page, problems, telegramCalls) {
  const status = page.locator('.form-status');
  const submit = page.locator('.request-form button[type="submit"]');
  await submit.click();
  await expectState(problems, 'пустая форма — ошибка', async () => (await status.textContent()).includes('Проверьте'));
  await page.fill('#request-name', 'Анна');
  await page.fill('#request-phone', '+7 (921) 555-12-34');
  await submit.click();
  await expectState(problems, 'без согласия — просьба отметить', async () =>
    (await status.textContent()).includes('согласие'),
  );
  await page.check('#request-consent');
  const callsBefore = telegramCalls.length;
  await submit.click();
  await page
    .waitForFunction(() => document.querySelector('.form-status').dataset.state === 'success', null, {
      timeout: 5000,
    })
    .catch(() => {});
  await expectState(problems, 'заявка отправлена', async () => (await status.textContent()).startsWith('Спасибо'));
  await expectState(
    problems,
    'заявка дошла до (подменённого) Telegram с товаром',
    async () => telegramCalls.length === callsBefore + 1 && /Товар: /.test(telegramCalls.at(-1)),
  );
}
