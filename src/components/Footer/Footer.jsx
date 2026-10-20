// Подвал: разделы каталога, контакты, юридическая информация и ссылки на документы.
import { Fragment } from 'react';
import { catalog, categoryPath, sectionPath, site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import Logo from '../Logo/Logo';
import StubText from '../StubText/StubText';
import './Footer.css';

// Год сборки (задаётся в vite.config.js) — одинаковый в готовом HTML и после гидратации.
const YEAR = typeof __BUILD_YEAR__ === 'undefined' ? new Date().getFullYear() : __BUILD_YEAR__;

function SectionColumn({ section }) {
  return (
    <div className="footer-col">
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

export default function Footer() {
  const office = site.offices[0];
  const brandName = `${site.brand} ${site.brandSuffix}`;
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Тихая вентиляция с рекуперацией тепла и центральные пылесосы. Сделано в Германии.</p>
        </div>
        {catalog.sections.map((section) => (
          <SectionColumn key={section.slug} section={section} />
        ))}
        <div className="footer-col">
          <p className="footer-title">Контакты</p>
          <p>
            {office.phones.map((phone, index) => (
              <Fragment key={phone}>
                {index > 0 && <br />}
                <a href={phoneHref(phone)}>{phone}</a>
              </Fragment>
            ))}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <StubText>{office.address}</StubText>
          </p>
          <ul>
            <li>
              <a href="/objects.html">Объекты</a>
            </li>
            <li>
              <a href="/about.html">О компании</a>
            </li>
            <li>
              <a href="/contacts.html">Все контакты</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="footer-legal">
          <p>
            {`© ${YEAR} Представительство ${brandName} в Санкт-Петербурге. `}
            <StubText>{site.legal.representative}</StubText>
          </p>
          <p>{`Производитель: ${site.legal.company}, ${site.legal.city}, ${site.legal.register}`}</p>
          <p>
            <a href="/privacy.html">Политика обработки персональных данных</a>
            {' · '}
            <a href="/consent.html">Согласие на обработку данных</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
