// Пункт меню с мега-меню раздела: на ноутбуке — панель во всю ширину под шапкой
// (описание раздела слева, категории с миниатюрами сеткой справа), на планшете и телефоне — простой список.
// Мышь: панель раскрывается при наведении (паузы и переключение — в Header.jsx). Клавиатура: Enter/пробел на стрелке — открыть,
// ↓/↑ — по ссылкам списка, Esc — закрыть и вернуть фокус на кнопку; уход фокуса из пункта — закрыть.
import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { categoryPath, sectionPath } from '../../lib/content';
import { resolveImage } from '../../lib/images';
import { countCategories } from '../../lib/text';
import CatalogImage from '../CatalogImage/CatalogImage';
import './MegaMenu.css';

function isKeyboardFocused(element) {
  try {
    return element.matches(':focus-visible');
  } catch {
    return false;
  }
}

export default function NavDropdown(props) {
  // Раздел без категорий (например, «Услуги») — обычная ссылка без выпадающей панели
  if (!props.section.categories.length) return <SectionLink {...props} />;
  return <SectionDropdown {...props} />;
}

function SectionLink({ section, currentPath }) {
  const href = sectionPath(section);
  return (
    <li className="nav-item">
      <a className="nav-link" href={href} aria-current={currentPath === href ? 'page' : undefined}>
        {section.navTitle}
      </a>
    </li>
  );
}

function SectionDropdown({ section, currentPath, isOpen, onOpenChange }) {
  const itemRef = useRef(null);
  const toggleRef = useRef(null);
  const menuId = `menu-${section.slug}`;
  const href = sectionPath(section);
  const isCurrentSection = currentPath === href || currentPath.startsWith(`/${section.slug}/`);

  // Открываем синхронно, чтобы сразу после этого можно было поставить фокус на ссылку в списке.
  const openNow = () => flushSync(() => onOpenChange(true));
  const menuLinks = () => Array.from(itemRef.current.querySelectorAll('.dropdown a'));

  function handleToggleClick() {
    if (isOpen) {
      onOpenChange(false);
      return;
    }
    openNow();
    if (isKeyboardFocused(toggleRef.current)) menuLinks()[0]?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      // Закрываем только подменю: без stopPropagation Esc дошёл бы до шапки и закрыл всё мобильное меню
      event.stopPropagation();
      onOpenChange(false);
      toggleRef.current.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = menuLinks();
    const position = links.indexOf(document.activeElement);
    if (position === -1 && document.activeElement !== toggleRef.current) return;
    event.preventDefault();
    if (!isOpen) openNow();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    const next = position === -1 ? 0 : (position + step + links.length) % links.length;
    links[next].focus();
  }

  function handleBlur(event) {
    if (isOpen && !itemRef.current.contains(event.relatedTarget)) onOpenChange(false);
  }

  return (
    <li
      ref={itemRef}
      className={isOpen ? 'nav-item has-dropdown is-open' : 'nav-item has-dropdown'}
      data-section={section.slug}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <a
        className={isCurrentSection ? 'nav-link is-current' : 'nav-link'}
        href={href}
        aria-current={currentPath === href ? 'page' : undefined}
      >
        {section.navTitle}
      </a>
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`Подменю: ${section.navTitle}`}
        onClick={handleToggleClick}
      >
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <div className="dropdown" id={menuId}>
        <div className="wrap dropdown-inner">
          <div className="dropdown-intro">
            <p className="dropdown-title">{`Раздел каталога · ${countCategories(section.categories.length)}`}</p>
            <p className="dropdown-heading">{section.title}</p>
            <p className="dropdown-summary">{section.summary}</p>
          </div>
          <ul className="dropdown-grid">
            {section.categories.map((category) => {
              const categoryHref = categoryPath(section, category);
              return (
                <li key={category.slug}>
                  <a href={categoryHref} aria-current={categoryHref === currentPath ? 'page' : undefined}>
                    <span className="dropdown-thumb" aria-hidden="true">
                      <CatalogImage image={resolveImage(category.image, category.title)} alt="" />
                    </span>
                    <span className="dropdown-text">
                      <span className="dropdown-name">{category.title}</span>
                      <span className="dropdown-note" aria-hidden="true">
                        {category.summary}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a className="dropdown-all" href={href}>
            {`Весь раздел «${section.title}»`} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </li>
  );
}
