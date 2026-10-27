// Блок «Контакты» внизу страниц вместо формы заявки: телефон крупнее текста и ряд «Почта · Telegram · MAX».
// Данные — site.contacts (data/site.json). Пустое поле не становится ссылкой: вместо него подпись «скоро появится».
// Почта и номер MAX по нажатию копируются в буфер (у многих нет почтовой программы, и mailto: ничего не открывает).
// Если в MAX указать ссылку https://…, вместо копирования будет обычная ссылка, как у Telegram.
// id="request" остаётся прежним, чтобы кнопки «Запросить цену» (#request) вели сюда.
import { useEffect, useRef, useState } from 'react';
import { site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import './ContactBlock.css';

const SOON = 'скоро появится';

// Копирует текст в буфер; для старых браузеров и http — запасной путь через скрытое поле
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;opacity:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
}

// Каналы по порядку: почта (копировать), Telegram (ссылка), MAX (ссылка или копировать номер).
// copy — что положить в буфер; href — куда ведёт ссылка; пустые поля — «скоро появится».
export function channelLinks(contacts) {
  const telegram = contacts.telegram?.replace(/^@/, '');
  const maxIsLink = /^https?:\/\//.test(contacts.max ?? '');
  return [
    { label: 'Почта', copy: contacts.email, what: 'почту' },
    { label: 'Telegram', href: telegram ? `https://t.me/${telegram}` : null, text: telegram && `@${telegram}` },
    maxIsLink
      ? { label: 'MAX', href: contacts.max, text: 'Написать в чат' }
      : { label: 'MAX', copy: contacts.max, what: 'номер MAX' },
  ];
}

// Значок «копировать» (два листа) и галочка после копирования — в том же месте, где у соседей стрелка ↗
const COPY_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    aria-hidden="true"
  >
    <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
    <path d="M15.5 8.5V5.5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
  </svg>
);
const CHECK_ICON = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

// Нажали — значение в буфере; значок становится галочкой, вместо значения на 2 секунды «Скопировано»
function CopyChannel({ label, copy, what }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick() {
    if (!(await copyText(copy))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="contact-channel contact-copyable"
      data-copied={copied || undefined}
      onClick={handleClick}
      aria-label={`Скопировать ${what}: ${copy}`}
    >
      <b>
        {label} <i className="contact-copy">{copied ? CHECK_ICON : COPY_ICON}</i>
      </b>
      <small className={copied ? 'is-copied' : undefined}>{copied ? 'Скопировано' : copy}</small>
      <span className="visually-hidden" role="status">
        {copied ? 'Скопировано' : ''}
      </span>
    </button>
  );
}

function Channel({ label, href, text }) {
  const external = href?.startsWith('http');
  const body = (
    <>
      <b>
        {label} {href && <i aria-hidden="true">↗</i>}
      </b>
      <small>{text || SOON}</small>
    </>
  );
  if (!href) return <div className={text ? 'contact-channel' : 'contact-channel is-empty'}>{body}</div>;
  return (
    <a className="contact-channel" href={href} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
      {body}
    </a>
  );
}

export default function ContactBlock({ heading = 'Запросить цену и подбор' }) {
  const contacts = site.contacts;

  return (
    <section className="request" id="request" aria-labelledby="request-title">
      <div className="wrap request-grid">
        <div className="request-intro">
          <p className="eyebrow">Контакты</p>
          <h2 id="request-title">{heading}</h2>
          <p>
            Цены не публикуются: стоимость зависит от состава системы. Позвоните или напишите, как вам удобнее, —
            специалист уточнит задачу и подготовит расчёт.
          </p>
        </div>
        <div className="contact-block">
          <p className="contact-label">Звоните, мы на связи</p>
          {contacts.phone ? (
            <a className="contact-phone" href={phoneHref(contacts.phone)}>
              {contacts.phone}
            </a>
          ) : (
            <p className="contact-phone is-empty">Телефон {SOON}</p>
          )}
          {contacts.hours && <p className="contact-hours">{contacts.hours}</p>}
          <div className="contact-channels">
            {channelLinks(contacts).map((channel) =>
              channel.copy ? (
                <CopyChannel key={channel.label} {...channel} />
              ) : (
                <Channel key={channel.label} {...channel} />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
