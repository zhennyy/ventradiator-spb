// Страница 404: сервер отдаёт её на любой неизвестный адрес. Ниже кнопок — все разделы каталога.
import ButtonLink from '../../components/Button/Button';
import { catalog, sectionPath } from '../../lib/content';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <section className="page-hero not-found">
      <div className="wrap">
        <p className="eyebrow">Ошибка 404</p>
        <h1>Страница не найдена</h1>
        <p className="section-lead">Возможно, адрес изменился. Начните с главной или выберите раздел каталога:</p>
        <div className="hero-actions">
          <ButtonLink href="/">На главную</ButtonLink>
          <ButtonLink href="/contacts.html" variant="ghost">
            Контакты
          </ButtonLink>
        </div>
        <ul className="not-found-sections">
          {catalog.sections.map((section) => (
            <li key={section.slug}>
              <a href={sectionPath(section)}>{section.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
