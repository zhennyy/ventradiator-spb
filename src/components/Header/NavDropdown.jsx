// Пункт меню с выпадающим списком категорий раздела.
// Мышь: список раскрывается при наведении (CSS). Клавиатура: Enter/пробел на стрелке — открыть,
// ↓/↑ — по ссылкам списка, Esc — закрыть и вернуть фокус на кнопку; уход фокуса из пункта — закрыть.
import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { categoryPath, sectionPath } from '../../lib/content';

function isKeyboardFocused(element) {
  try {
    return element.matches(':focus-visible');
  } catch {
    return false;
  }
}

export default function NavDropdown({ section, currentPath, isOpen, onOpenChange }) {
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
        <p className="dropdown-title">{section.title}</p>
        <ul>
          {section.categories.map((category) => {
            const categoryHref = categoryPath(section, category);
            return (
              <li key={category.slug}>
                <a href={categoryHref} aria-current={categoryHref === currentPath ? 'page' : undefined}>
                  {category.title}
                </a>
              </li>
            );
          })}
        </ul>
        <a className="dropdown-all" href={href}>
          Весь раздел →
        </a>
      </div>
    </li>
  );
}
