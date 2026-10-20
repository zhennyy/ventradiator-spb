// Шапка: логотип, меню с выпадающими списками разделов, телефон, «Запросить цену» и мобильное меню.
// Мобильное меню (до 1080px) открывается кнопкой «Меню», закрывается по Esc, по ссылке и при переходе на десктоп.
import { useEffect, useRef, useState } from 'react';
import { catalog, site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import ButtonLink from '../Button/Button';
import Logo from '../Logo/Logo';
import NavDropdown from './NavDropdown';
import './Header.css';
import './MobileMenu.css';

const SIMPLE_LINKS = [
  ['/objects.html', 'Объекты'],
  ['/about.html', 'О компании'],
  ['/contacts.html', 'Контакты'],
];

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
    const desktop = window.matchMedia('(min-width: 1081px)');
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
              <li className="nav-item" key={href}>
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
      </div>
    </header>
  );
}
