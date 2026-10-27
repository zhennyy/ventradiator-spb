// Шапка. От 1280px: тонкая верхняя строка (регион, «О компании», «Контакты», телефон) и основная —
// логотип, шесть разделов каталога с мега-меню, «Запросить цену». Ниже — логотип, звонок и кнопка «Меню».
// До 1279px (телефон, планшет, узкий ноутбук) меню сворачивается в кнопку «Меню», а рядом остаётся кнопка звонка:
// на планшете — с номером, на телефоне — круглая иконка. Меню закрывается по Esc, по ссылке и при переходе на ноутбук.
import { useEffect, useRef, useState } from 'react';
import { catalog, site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import ButtonLink from '../Button/Button';
import NavDropdown from './NavDropdown';
import SectionStrip from './SectionStrip';
import './Header.css';
import './MobileMenu.css';

// На сколько пикселей надо прокрутить, чтобы шапка спряталась или вернулась: мелкие рывки пальцем не считаем
const SCROLL_STEP = 24;

export const SIMPLE_LINKS = [
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

export default function Header({ currentPath, hasContacts }) {
  const [openSection, setOpenSection] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const phone = site.offices[0].phones[0];

  // Мышь на ноутбуке: мега-меню открывается после короткой паузы (если курсор просто проезжает — не мелькает),
  // между разделами переключается сразу, без закрытия и повторного «выплывания», закрывается с задержкой.
  const hoverTimer = useRef(0);
  const switchTimer = useRef(0);
  const [isSwitching, setSwitching] = useState(false);
  useEffect(
    () => () => {
      clearTimeout(hoverTimer.current);
      clearTimeout(switchTimer.current);
    },
    [],
  );
  const isDesktopMouse = (event) =>
    event.pointerType === 'mouse' && window.matchMedia('(min-width: 1280px) and (hover: hover)').matches;
  function scheduleHover(slug, delay) {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenSection(slug), delay);
  }
  function handleNavPointerOver(event) {
    if (!isDesktopMouse(event)) return;
    // Курсор внутри открытой панели — ничего не меняем, только отменяем закрытие
    if (event.target.closest('.dropdown')) {
      clearTimeout(hoverTimer.current);
      return;
    }
    const item = event.target.closest('.nav-item');
    // Промежутки между пунктами и кнопка «Запросить цену» — ничего не меняем (иначе меню мигает по пути)
    if (!item) {
      clearTimeout(hoverTimer.current);
      return;
    }
    const slug = item.dataset.section || null;
    if (slug === openSection) {
      clearTimeout(hoverTimer.current);
      return;
    }
    if (slug && openSection) {
      // Переключение между разделами: панель остаётся на месте, меняется только содержимое
      clearTimeout(hoverTimer.current);
      clearTimeout(switchTimer.current);
      setSwitching(true);
      setOpenSection(slug);
      switchTimer.current = setTimeout(() => setSwitching(false), 900);
      return;
    }
    scheduleHover(slug, slug ? 150 : 300);
  }
  function handleNavPointerLeave(event) {
    if (!isDesktopMouse(event) || !openSection) return;
    scheduleHover(null, 400);
  }

  // Клик мимо выпадающих списков закрывает их.
  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!event.target.closest('.has-dropdown')) setOpenSection(null);
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, []);

  // Открытое мобильное меню: класс на body (блокирует прокрутку), Esc закрывает, на десктопе меню сбрасывается.
  // Страница под меню становится inert: Tab и скринридер не уходят из открытого меню в содержимое под ним.
  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    const behindMenu = document.querySelectorAll('main, .site-footer');
    behindMenu.forEach((element) => {
      element.inert = isMenuOpen;
    });
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

  // Шапка уезжает вверх, когда листаешь вниз, и возвращается при прокрутке вверх —
  // так она не съедает пол-экрана над содержимым. С открытым меню остаётся на месте.
  const [isHidden, setHidden] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      // На iPhone страница «пружинит» у краёв — эти рывки не считаем прокруткой
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const currentY = Math.min(Math.max(window.scrollY, 0), maxY);
      const delta = currentY - lastY;
      setScrolled(currentY > 8);
      if (currentY < 160) setHidden(false);
      else if (delta > SCROLL_STEP) setHidden(true);
      else if (delta < -SCROLL_STEP) setHidden(false);
      if (Math.abs(delta) > SCROLL_STEP || currentY < 160) lastY = currentY;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  const headerClass = [
    'site-header',
    isHidden && !isMenuOpen && !openSection ? 'is-hidden' : '',
    isScrolled ? 'is-scrolled' : '',
    isSwitching && openSection ? 'menu-switching' : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleNavClick(event) {
    if (event.target.closest('a')) setMenuOpen(false);
  }

  return (
    <header className={headerClass}>
      <div className="wrap header-row">
        {/* Слева — ссылка на главную: на ноутбуке домик и «Главная», на планшете и телефоне — подпись о представительстве */}
        <a className="header-home" href="/" aria-label="На главную">
          <svg className="header-home-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M3 9.5 10 3.5l7 6M5 8v8.5h3.5v-5h3v5H15V8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span className="header-home-desk">Главная</span>
          <span className="header-home-long">Представительство в Санкт-Петербурге · по всей России</span>
          <span className="header-home-short">Представительство в СПб</span>
        </a>
        {/* Номер ещё не известен — кнопку звонка не показываем */}
        {phone && (
          <a className="header-call" href={phoneHref(phone)} aria-label={`Позвонить: ${phone}`}>
            <PhoneIcon />
            <span className="header-call-number">{phone}</span>
          </a>
        )}
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
        <nav
          className="site-nav"
          id="site-nav"
          aria-label="Основное меню"
          onClick={handleNavClick}
          onPointerOver={handleNavPointerOver}
          onPointerLeave={handleNavPointerLeave}
        >
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
            {phone && (
              <a className="header-phone" href={phoneHref(phone)}>
                {phone}
              </a>
            )}
            <ButtonLink href={hasContacts ? '#request' : '/contacts.html#request'} small>
              Запросить цену
            </ButtonLink>
            {/* Подпись внизу выдвижного меню (на ноутбуке скрыта) */}
            <p className="nav-note">Представительство в Санкт-Петербурге · работаем по всей России</p>
          </div>
        </nav>
        {/* Затемнение за выдвижной панелью меню (планшет и узкий ноутбук): клик по нему закрывает меню */}
        <div className="nav-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />
      </div>
      <SectionStrip currentPath={currentPath} />
    </header>
  );
}
