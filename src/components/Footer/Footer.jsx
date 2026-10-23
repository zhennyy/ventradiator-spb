// Подвал — «задняя обложка» каталога. Сверху: слева призыв и кнопка, справа контакты крупно.
// Ниже: карта сайта колонками (разделы с категориями + «Компания»), внизу строка © и документы.
import { catalog, categoryPath, sectionPath, site } from '../../lib/content';
import { hasContent, phoneHref } from '../../lib/text';
import ButtonLink from '../Button/Button';
import StubText from '../StubText/StubText';
import './Footer.css';

// Год сборки (задаётся в vite.config.js) — одинаковый в готовом HTML и после гидратации.
const YEAR = typeof __BUILD_YEAR__ === 'undefined' ? new Date().getFullYear() : __BUILD_YEAR__;

const COMPANY_LINKS = [
  ['/objects.html', 'Объекты'],
  ['/about.html', 'О компании'],
  ['/contacts.html', 'Контакты'],
];
const DOCUMENT_LINKS = [
  ['/privacy.html', 'Политика обработки персональных данных'],
  ['/consent.html', 'Согласие на обработку данных'],
];

// Разделы без категорий (инженерные системы, услуги) — обычные ссылки в нижней строке, без пустого заголовка.
const PLAIN_SECTION_LINKS = catalog.sections
  .filter((section) => section.categories.length === 0)
  .map((section) => [sectionPath(section), section.title]);

function LinkRow({ links }) {
  return (
    <div className="footer-col footer-col-company">
      <p className="footer-title">Компания</p>
      <ul>
        {links.map(([href, label]) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionRow({ section }) {
  return (
    <div className="footer-col footer-col-catalog">
      <p className="footer-title">
        <a href={sectionPath(section)}>{section.title}</a>
      </p>
      <ul>
        {section.categories.map((category) => (
          <li key={category.slug}>
            <a href={categoryPath(section, category)}>{category.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ hasForm = false }) {
  const office = site.offices[0];
  const phone = office.phones[0];
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-pitch">
            <p className="footer-slogan">Подберём вентиляцию, отопление и пылеудаление для вашего дома</p>
            <p className="footer-lead">Пришлите план — рассчитаем систему и подберём оборудование под ваш дом.</p>
            <ButtonLink href={hasForm ? '#request' : '/contacts.html#request'}>Запросить цену</ButtonLink>
          </div>
          <div className="footer-contacts">
            <p className="footer-title">{office.title}</p>
            <a className="footer-phone" href={phoneHref(phone)}>
              {phone}
            </a>
            <a className="footer-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            {hasContent(office.address) && (
              <p className="footer-address">
                <StubText>{office.address}</StubText>
              </p>
            )}
          </div>
        </div>
        <nav className="footer-nav" aria-label="Карта сайта">
          {catalog.sections
            .filter((section) => section.categories.length > 0)
            .map((section) => (
              <SectionRow key={section.slug} section={section} />
            ))}
          <LinkRow links={[...PLAIN_SECTION_LINKS, ...COMPANY_LINKS]} />
        </nav>
        <div className="footer-legal">
          <p>
            {`© ${YEAR} ${site.brand}, Санкт-Петербург. `}
            {hasContent(site.legal.representative) && <StubText>{site.legal.representative}</StubText>}
          </p>
          <ul className="footer-docs">
            {DOCUMENT_LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
