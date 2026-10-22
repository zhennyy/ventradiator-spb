// Первый экран главной: светлый интерьер на всю ширину, поверх слева — обещание и кнопки,
// под фото — строка фактов. Фото неподвижно, текст на полупрозрачной карточке.
import ButtonLink from '../../components/Button/Button';
import { site } from '../../lib/content';
import { resolveImage } from '../../lib/images';

export default function HomeHero() {
  const photo = resolveImage(site.heroImage.image, site.heroImage.alt);
  return (
    <section className="hero">
      <div className="hero-stage">
        <img
          className="hero-photo"
          src={photo.src}
          alt={site.heroImage.alt}
          width="1600"
          height="1000"
          loading="eager"
          decoding="async"
        />
        <div className="wrap hero-copy-wrap">
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
        </div>
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
