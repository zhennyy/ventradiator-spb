// Шапка. От 1280px: тонкая верхняя строка (регион, «Объекты», «О компании», «Контакты», телефон) и основная —
// логотип, шесть разделов каталога с мега-меню, «Запросить цену». Ниже — логотип, звонок и кнопка «Меню».
// До 1279px (телефон, планшет, узкий ноутбук) меню сворачивается в кнопку «Меню», а рядом остаётся кнопка звонка:
// на планшете — с номером, на телефоне — круглая иконка. Меню закрывается по Esc, по ссылке и при переходе на ноутбук.
import { useEffect, useRef, useState } from 'react';
import { catalog, site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import ButtonLink from '../Button/Button';
import Logo from '../Logo/Logo';
import NavDropdown from './NavDropdown';
import SectionStrip from './SectionStrip';
import './Header.css';
import './MobileMenu.css';

export const SIMPLE_LINKS = [
  ['/objects.html', 'Объекты'],
  ['/about.html', 'О компании'],
  ['/contacts.html', 'Контакты'],
];

function PhoneIcon() {
  return (
    <svg className="header-call-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6.6 3.5h2.8l1.4 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.4v2.8a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({ currentPath, hasForm }) {
  const [openSection, setOpenSection] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const phone = site.offices[0].phones[0];

  // Клик мимо выпадающих списков закрывает их.
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest('.has-dropdown')) setOpenSection(null);
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  // Открытое мобильное меню: класс на body (блокирует прокрутку), Esc закрывает, на десктопе меню сбрасывается.
  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current.focus();
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = (query) => query.matches && setMenuOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [isMenuOpen]);

  function handleNavClick(event) {
    if (event.target.closest('a')) setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Logo />
        <a className="header-call" href={phoneHref(phone)} aria-label={`Позвонить: ${phone}`}>
          <PhoneIcon />
          <span className="header-call-number">{phone}</span>
        </a>
        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen(!isMenuOpen)}
        >
          <span className="menu-icon" aria-hidden="true">
            <i></i>
            <i></i>
          </span>
          <span className="menu-label">Меню</span>
        </button>
        <nav className="site-nav" id="site-nav" aria-label="Основное меню" onClick={handleNavClick}>
          <ul className="nav-list">
            {catalog.sections.map((section) => (
              <NavDropdown
                key={section.slug}
                section={section}
                currentPath={currentPath}
                isOpen={openSection === section.slug}
                onOpenChange={(isOpen) => setOpenSection(isOpen ? section.slug : null)}
              />
            ))}
            {SIMPLE_LINKS.map(([href, label]) => (
              <li className="nav-item nav-item-secondary" key={href}>
                <a className="nav-link" href={href} aria-current={href === currentPath ? 'page' : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <a className="header-phone" href={phoneHref(phone)}>
              {phone}
            </a>
            <ButtonLink href={hasForm ? '#request' : '/contacts.html#request'} small>
              Запросить цену
            </ButtonLink>
          </div>
        </nav>
        {/* Затемнение за выдвижной панелью меню (планшет и узкий ноутбук): клик по нему закрывает меню */}
        <div className="nav-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />
      </div>
      <SectionStrip currentPath={currentPath} />
    </header>
  );
}
