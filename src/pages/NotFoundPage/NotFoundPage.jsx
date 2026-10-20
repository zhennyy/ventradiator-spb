// Страница 404: сервер отдаёт её на любой неизвестный адрес.
import ButtonLink from '../../components/Button/Button';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <section className="page-hero not-found">
      <div className="wrap">
        <p className="eyebrow">Ошибка 404</p>
        <h1>Страница не найдена</h1>
        <p className="section-lead">Возможно, адрес изменился. Начните с каталога:</p>
        <div className="hero-actions">
          <ButtonLink href="/ventilation.html">Вентиляция</ButtonLink>
          <ButtonLink href="/dust-removal.html" variant="ghost">
            Пылеудаление
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
