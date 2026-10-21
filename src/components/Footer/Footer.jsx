// Подвал — светлая «задняя обложка» каталога по центру: сверху призыв и контакты представительства,
// ниже карта сайта строками: раздел и его категории в одну строку, затем страницы компании и документы.
import { catalog, categoryPath, sectionPath, site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import ButtonLink from '../Button/Button';
import Logo from '../Logo/Logo';
import StubText from '../StubText/StubText';
import './Footer.css';

// Год сборки (задаётся в vite.config.js) — одинаковый в готовом HTML и после гидратации.
const YEAR = typeof __BUILD_YEAR__ === 'undefined' ? new Date().getFullYear() : __BUILD_YEAR__;

const COMPANY_LINKS = [
  ['/objects.html', 'Объекты'],
  ['/about.html', 'О компании'],
  ['/contacts.html', 'Контакты'],
  ['/privacy.html', 'Политика обработки персональных данных'],
  ['/consent.html', 'Согласие на обработку данных'],
];

function LinkRow({ links }) {
  return (
    <div className="footer-col footer-col-company">
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
  const brandName = site.brand;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-pitch">
            <Logo />
            <p className="footer-slogan">Подберём тихую вентиляцию и центральный пылесос для вашего дома</p>
          </div>
          <div className="footer-contacts">
            <p className="footer-title">{office.title}</p>
            <a className="footer-phone" href={phoneHref(phone)}>
              {phone}
            </a>
            <a className="footer-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="footer-address">
              <StubText>{office.address}</StubText>
            </p>
            <ButtonLink href={hasForm ? '#request' : '/contacts.html#request'}>Запросить цену</ButtonLink>
          </div>
        </div>
        <nav className="footer-nav" aria-label="Карта сайта">
          {catalog.sections.map((section) => (
            <SectionRow key={section.slug} section={section} />
          ))}
          <LinkRow links={COMPANY_LINKS} />
        </nav>
        <div className="footer-legal">
          <p>
            {`© ${YEAR} Представительство ${brandName} в Санкт-Петербурге. `}
            <StubText>{site.legal.representative}</StubText>
          </p>
          <p>{`Производитель: ${site.legal.company}, ${site.legal.city}, ${site.legal.register}`}</p>
        </div>
      </div>
    </footer>
  );
}
