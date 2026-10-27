// Проверки для tools/smoke.js: страница целиком (консоль, гидратация, прокрутка, ссылки),
// меню с клавиатуры и мобильное меню, блок контактов — всё уже после гидратации.

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

// Шапка: на ноутбуке — полное меню без кнопок «Меню» и звонка; до 1279px — кнопка «Меню» и звонок
// (на планшете с номером, на телефоне — иконка), все не меньше 44px.
export async function checkHeaderCall(page, problems, width) {
  const isCollapsed = width <= 1279;
  // Номер ещё не известен — кнопки звонка нет; проверяем только «Меню»
  if (!(await page.$('.header-call'))) {
    const menu = await page.evaluate(() => document.querySelector('.menu-button').getBoundingClientRect().height);
    if (isCollapsed && menu < 44) problems.push(`шапка ${width}px: кнопка «Меню» ниже 44px`);
    return;
  }
  const state = await page.evaluate(() => {
    const box = (selector) => document.querySelector(selector).getBoundingClientRect();
    // Видим = есть размер и не скрыт через visibility (мобильное меню скрывается плавно, а не display: none)
    const visible = (selector) =>
      box(selector).width > 0 && getComputedStyle(document.querySelector(selector)).visibility !== 'hidden';
    return {
      call: visible('.header-call'),
      menu: visible('.menu-button'),
      number: visible('.header-call-number'),
      nav: visible('.site-nav'),
      callHeight: box('.header-call').height,
      menuHeight: box('.menu-button').height,
    };
  });
  const label = `шапка ${width}px`;
  if (state.call !== isCollapsed || state.menu !== isCollapsed || state.nav === isCollapsed)
    problems.push(`${label}: ${isCollapsed ? 'нужны кнопки «Меню» и звонка' : 'нужно полное меню'}`);
  if (isCollapsed && state.number !== width > 600) problems.push(`${label}: номер у кнопки звонка`);
  if (isCollapsed && Math.min(state.callHeight, state.menuHeight) < 44) problems.push(`${label}: кнопки ниже 44px`);
}

// Планшет и телефон: кнопка «Меню», подменю раздела, Esc.
export async function checkMobileMenu(page, problems) {
  await page.click('.menu-button');
  await expectState(problems, 'кнопка «Меню» открывает меню', () => page.locator('#site-nav').isVisible());
  await page.locator('.nav-toggle').first().click();
  // Подменю раскрывается плавно по высоте — ждём конец анимации
  await page.waitForTimeout(450);
  await expectState(problems, 'подменю раздела раскрывается', () => page.locator('.dropdown').first().isVisible());
}

export async function closeMobileMenu(page, problems) {
  await page.keyboard.press('Escape');
  await expectState(
    problems,
    'Esc закрывает мобильное меню',
    // Панель уезжает плавно — ждём окончания анимации
    async () => {
      await page.locator('#site-nav').waitFor({ state: 'hidden', timeout: 2000 });
      return true;
    },
  );
}

// Контакты: телефон — ссылка tel:, по нажатию на почту адрес копируется и появляется «Скопировано».
export async function checkContacts(page, problems) {
  await expectState(problems, 'телефон в контактах — ссылка tel:', async () =>
    (await page.locator('#request .contact-phone').getAttribute('href'))?.startsWith('tel:'),
  );
  await page.locator('#request button.contact-channel').click();
  await expectState(problems, 'почта скопирована', async () => {
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    return copied.includes('@') && (await page.locator('#request .contact-email[data-copied]').count()) === 1;
  });
}
