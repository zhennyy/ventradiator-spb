// Форма заявки: имя, телефон, комментарий и согласие (по умолчанию не отмечено).
// Поля проверяются здесь (validation.js) и ещё раз на сервере; заявка уходит JSON-запросом на POST /api/request.
// Результат показывается в строке статуса (aria-live), чтобы его услышали и скринридеры.
import { useState } from 'react';
import { site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import '../Button/Button.css';
import './RequestForm.css';
import { MESSAGES, messageForStatus, validateRequestForm } from './validation';

const ENDPOINT = '/api/request';

function readForm(form) {
  const { elements } = form;
  return {
    name: elements.name.value.trim(),
    phone: elements.phone.value.trim(),
    comment: elements.comment.value.trim(),
    product: elements.product ? elements.product.value : '',
    consent: elements.consent.checked,
  };
}

export default function RequestForm({ product = '', heading = 'Запросить цену и подбор' }) {
  const [status, setStatus] = useState({ text: '', state: undefined });
  const [invalid, setInvalid] = useState({});
  const [isSending, setSending] = useState(false);
  const phone = site.offices[0].phones[0];

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readForm(form);
    const check = validateRequestForm(values);
    setInvalid(check.invalid);
    if (check.problem) {
      setStatus({ text: check.problem.message, state: 'error' });
      form.elements[check.problem.field].focus();
      return;
    }
    setSending(true);
    setStatus({ text: MESSAGES.sending, state: 'pending' });
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) form.reset();
      setStatus({ text: messageForStatus(response.status), state: response.ok ? 'success' : 'error' });
    } catch {
      setStatus({ text: MESSAGES.failed, state: 'error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="request" id="request" aria-labelledby="request-title">
      <div className="wrap request-grid">
        <div className="request-intro">
          <p className="eyebrow">Заявка</p>
          <h2 id="request-title">{heading}</h2>
          <p>
            Цены не публикуются: стоимость зависит от состава системы. Оставьте телефон — специалист представительства
            перезвонит, уточнит задачу и подготовит расчёт.
          </p>
          {phone && (
            <p className="request-phone">
              Или позвоните: <a href={phoneHref(phone)}>{phone}</a>
            </p>
          )}
        </div>
        <form className="request-form" action={ENDPOINT} method="post" noValidate onSubmit={handleSubmit}>
          {product && (
            <>
              <p className="form-product">
                Товар: <b>{product}</b>
              </p>
              <input type="hidden" name="product" value={product} />
            </>
          )}
          <div className="field">
            <label htmlFor="request-name">Имя</label>
            <input
              id="request-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              aria-invalid={invalid.name}
            />
          </div>
          <div className="field">
            <label htmlFor="request-phone">Телефон</label>
            <input
              id="request-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              placeholder="+7 (___) ___-__-__"
              maxLength={25}
              aria-invalid={invalid.phone}
            />
          </div>
          <div className="field">
            <label htmlFor="request-comment">
              Комментарий <span className="optional">необязательно</span>
            </label>
            <textarea
              id="request-comment"
              name="comment"
              rows={3}
              maxLength={1000}
              placeholder="Например: дом 180 м², нужны вентиляция и радиаторы"
            ></textarea>
          </div>
          <div className="consent">
            <input id="request-consent" name="consent" type="checkbox" required />
            <label htmlFor="request-consent">
              Даю <a href="/consent.html">согласие на обработку персональных данных</a> в соответствии с{' '}
              <a href="/privacy.html">политикой</a>
            </label>
          </div>
          <button className="button button-primary button-wide" type="submit" disabled={isSending}>
            Отправить заявку
          </button>
          <p className="form-status" role="status" aria-live="polite" data-state={status.state}>
            {status.text}
          </p>
        </form>
      </div>
    </section>
  );
}
