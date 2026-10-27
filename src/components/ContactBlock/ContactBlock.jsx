// Блок «Контакты» внизу страниц вместо формы заявки: телефон крупнее текста и ряд «Почта · Telegram · MAX».
// Данные — site.contacts (data/site.json). Пустое поле не становится ссылкой: вместо него подпись «скоро появится».
// MAX: ссылка https://… — кнопкой, любой другой текст («по номеру …») — просто подписью.
// Почта по нажатию копируется в буфер (у многих нет почтовой программы, и mailto: ничего не открывает).
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

// Telegram и MAX: подпись, ссылка (или null, пока нет данных) и что показать под подписью
export function channelLinks(contacts) {
  const telegram = contacts.telegram?.replace(/^@/, '');
  return [
    { label: 'Telegram', href: telegram ? `https://t.me/${telegram}` : null, text: telegram && `@${telegram}` },
    /^https?:\/\//.test(contacts.max ?? '')
      ? { label: 'MAX', href: contacts.max, text: 'Написать в чат' }
      : { label: 'MAX', href: null, text: contacts.max },
  ];
}

// Почта: нажали — адрес в буфере, вместо стрелки на 2 секунды «Скопировано ✓»
function EmailChannel({ email }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  if (!email) return <Channel label="Почта" href={null} text="" />;

  async function handleClick() {
    if (!(await copyText(email))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" className="contact-channel" onClick={handleClick} aria-label={`Скопировать почту ${email}`}>
      <b>
        Почта <i className={copied ? 'is-copied' : undefined}>{copied ? 'Скопировано ✓' : 'Копировать'}</i>
      </b>
      <small>{email}</small>
      <span className="visually-hidden" role="status">
        {copied ? 'Почта скопирована' : ''}
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
            <EmailChannel email={contacts.email} />
            {channelLinks(contacts).map((channel) => (
              <Channel key={channel.label} {...channel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
