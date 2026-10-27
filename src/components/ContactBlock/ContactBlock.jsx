// Блок «Контакты» внизу страниц вместо формы заявки: крупный телефон и ряд «Почта · Telegram · MAX».
// Данные — site.contacts (data/site.json). Пустое поле не становится ссылкой: вместо него подпись «скоро появится».
// MAX: ссылка https://… — кнопкой, любой другой текст («по номеру …») — просто подписью.
// id="request" остаётся прежним, чтобы кнопки «Запросить цену» (#request) вели сюда.
import { site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import './ContactBlock.css';

const SOON = 'скоро появится';

// «+7 (812) 000-00-00» → ['+7 (812) ', '000-00-00']: последнюю группу цифр красим акцентом
export function splitPhone(phone) {
  const match = /^(.*?)(\d[\d\s-]*\d)$/.exec(phone.replace(/\s+$/, ''));
  if (!match || !match[1].trim()) return ['', phone];
  return [match[1], match[2].replace(/-/g, '‑')];
}

// Почта, Telegram и MAX: подпись, ссылка (или null, пока нет данных) и что показать под подписью
export function channelLinks(contacts, product) {
  const subject = product ? `?subject=${encodeURIComponent(`Запрос: ${product}`)}` : '';
  const telegram = contacts.telegram?.replace(/^@/, '');
  return [
    { label: 'Почта', href: contacts.email ? `mailto:${contacts.email}${subject}` : null, text: contacts.email },
    { label: 'Telegram', href: telegram ? `https://t.me/${telegram}` : null, text: telegram && `@${telegram}` },
    /^https?:\/\//.test(contacts.max ?? '')
      ? { label: 'MAX', href: contacts.max, text: 'Написать в чат' }
      : { label: 'MAX', href: null, text: contacts.max },
  ];
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

export default function ContactBlock({ product = '', heading = 'Запросить цену и подбор' }) {
  const contacts = site.contacts;
  const [phoneStart, phoneEnd] = contacts.phone ? splitPhone(contacts.phone) : [];

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
              {phoneStart}
              <span>{phoneEnd}</span>
            </a>
          ) : (
            <p className="contact-phone is-empty">Телефон {SOON}</p>
          )}
          {contacts.hours && <p className="contact-hours">{contacts.hours}</p>}
          <div className="contact-channels">
            {channelLinks(contacts, product).map((channel) => (
              <Channel key={channel.label} {...channel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
