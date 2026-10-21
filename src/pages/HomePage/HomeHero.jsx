// Первый экран главной: обещание бренда, кнопки, схема рекуперации и строка фактов.
import ButtonLink from '../../components/Button/Button';
import HeatRecoveryDiagram from '../../components/HeatRecoveryDiagram/HeatRecoveryDiagram';
import { site } from '../../lib/content';

export default function HomeHero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Blizzard — представительство в Санкт-Петербурге</p>
          <h1>{'Тихая немецкая вентиляция и\u00a0чистый воздух в\u00a0доме'}</h1>
          <p className="hero-lead">
            Приточно-вытяжные установки с рекуперацией тепла и центральные пылесосы Blizzard для квартир и домов в
            Санкт-Петербурге, Ленинградской области и по всей России.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#request">Запросить цену</ButtonLink>
            <ButtonLink href="#directions" variant="ghost">
              Смотреть каталог
            </ButtonLink>
          </div>
        </div>
        <HeatRecoveryDiagram />
      </div>
      <div className="wrap">
        <ul className="facts">
          {site.facts.map(([value, label]) => (
            <li key={label}>
              <span className="fact-value">{value}</span>
              <span className="fact-label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
