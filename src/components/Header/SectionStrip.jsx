// Строка разделов под шапкой на планшете, телефоне и узком ноутбуке (до 1279px), где основное меню
// спрятано в «Меню»: разделы каталога всегда на виду, строку можно листать пальцем, текущий раздел выделен.
import { useEffect, useRef } from 'react';
import { catalog, sectionPath } from '../../lib/content';
import './SectionStrip.css';

function isCurrentSection(section, currentPath = '') {
  return currentPath === sectionPath(section) || currentPath.startsWith(`/${section.slug}/`);
}

export default function SectionStrip({ currentPath }) {
  const listRef = useRef(null);

  // На телефоне текущий раздел может оказаться за краем строки — прокручиваем к нему без анимации
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector('.is-current');
    if (current) list.scrollLeft = current.offsetLeft - list.offsetLeft - 16;
  }, [currentPath]);

  return (
    <nav className="section-strip" aria-label="Разделы каталога">
      <ul className="wrap section-strip-list" ref={listRef}>
        {catalog.sections.map((section) => {
          const isCurrent = isCurrentSection(section, currentPath);
          return (
            <li key={section.slug}>
              <a
                className={isCurrent ? 'is-current' : undefined}
                href={sectionPath(section)}
                aria-current={currentPath === sectionPath(section) ? 'page' : undefined}
              >
                {section.navTitle}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
