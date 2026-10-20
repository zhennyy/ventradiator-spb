// Форма заявки: имя, телефон, комментарий и согласие (по умолчанию не отмечено).
// Отправляется скриптом /scripts/request-form.js на POST /api/request.
const { escapeHtml, phoneHref } = require('../lib/html');

function renderRequestForm({ site, product = '', heading = 'Запросить цену и подбор' }) {
  const phone = site.offices[0].phones[0];
  const productField = product
    ? `<p class="form-product">Товар: <b>${escapeHtml(product)}</b></p>
          <input type="hidden" name="product" value="${escapeHtml(product)}" />`
    : '';
  return `<section class="request" id="request" aria-labelledby="request-title">
    <div class="wrap request-grid">
      <div class="request-intro">
        <p class="eyebrow">Заявка</p>
        <h2 id="request-title">${escapeHtml(heading)}</h2>
        <p>Цены не публикуются: стоимость зависит от состава системы. Оставьте телефон — специалист представительства перезвонит, уточнит задачу и подготовит расчёт.</p>
        <p class="request-phone">Или позвоните: <a href="${phoneHref(phone)}">${escapeHtml(phone)}</a></p>
      </div>
      <form class="request-form" action="/api/request" method="post" novalidate data-request-form>
        ${productField}
        <div class="field">
          <label for="request-name">Имя</label>
          <input id="request-name" name="name" type="text" autocomplete="name" required minlength="2" maxlength="80" />
        </div>
        <div class="field">
          <label for="request-phone">Телефон</label>
          <input id="request-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+7 (___) ___-__-__" maxlength="25" />
        </div>
        <div class="field">
          <label for="request-comment">Комментарий <span class="optional">необязательно</span></label>
          <textarea id="request-comment" name="comment" rows="3" maxlength="1000" placeholder="Например: дом 180 м², нужна вентиляция и центральный пылесос"></textarea>
        </div>
        <div class="consent">
          <input id="request-consent" name="consent" type="checkbox" required />
          <label for="request-consent">Даю <a href="/consent.html">согласие на обработку персональных данных</a> в соответствии с <a href="/privacy.html">политикой</a></label>
        </div>
        <button class="button button-primary button-wide" type="submit">Отправить заявку</button>
        <p class="form-status" role="status" aria-live="polite" data-form-status></p>
      </form>
    </div>
  </section>`;
}

module.exports = { renderRequestForm };
