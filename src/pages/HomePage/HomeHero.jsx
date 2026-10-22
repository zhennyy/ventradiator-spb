// Первый экран главной: обещание, кнопки, установка L2 крупным планом с выносками и строка фактов.
import ButtonLink from '../../components/Button/Button';
import { site } from '../../lib/content';
import HeroProduct from './HeroProduct';

export default function HomeHero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Представительство в Санкт-Петербурге · работаем по всей России</p>
          <h1>{'Тихая немецкая вентиляция и\u00a0чистый воздух в\u00a0доме'}</h1>
          <p className="hero-lead">
            Вентиляция с рекуперацией тепла, центральные пылесосы, радиаторы и конвекторы для квартир и домов в
            Санкт-Петербурге, Ленинградской области и по всей России.
          </p>
          <div className="hero-actions">
            <ButtonLink href="#directions" variant="ghost">
              Смотреть каталог
            </ButtonLink>
            <ButtonLink href="#request">Запросить цену</ButtonLink>
          </div>
        </div>
        <HeroProduct />
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
