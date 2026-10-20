// Хлебные крошки на внутренних страницах: «Главная / Раздел / Категория», последняя — текущая страница.
import './Breadcrumbs.css';

export default function Breadcrumbs({ crumbs }) {
  if (!crumbs || crumbs.length === 0) return null;
  const items = [{ href: '/', label: 'Главная' }, ...crumbs];
  return (
    <nav className="breadcrumbs wrap" aria-label="Хлебные крошки">
      <ol>
        {items.map((crumb, index) => (
          <li key={crumb.href}>
            {index === items.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <a href={crumb.href}>{crumb.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
