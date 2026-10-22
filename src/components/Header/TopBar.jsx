// Верхняя строка над шапкой (только от 1280px): регион, «Объекты», «О компании», «Контакты» и телефон —
// чтобы основная строка шапки вместила шесть разделов каталога. Прокручивается вместе со страницей.
import { site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import { SIMPLE_LINKS } from './Header';

export default function TopBar({ currentPath }) {
  const phone = site.offices[0].phones[0];
  return (
    <div className="top-bar">
      <div className="wrap top-bar-row">
        <p className="top-bar-region">Представительство в Санкт-Петербурге · работаем по всей России</p>
        <ul className="top-bar-links">
          {SIMPLE_LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href} aria-current={href === currentPath ? 'page' : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="top-bar-phone" href={phoneHref(phone)}>
          {phone}
        </a>
      </div>
    </div>
  );
}
