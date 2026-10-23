// Первый экран главной: светлый интерьер на всю ширину, поверх слева — обещание и кнопки,
// Фото неподвижно, текст поверх на мягкой светлой подложке.
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
            <h1>{'Тихая европейская вентиляция и\u00a0чистый воздух в\u00a0доме'}</h1>
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
    </section>
  );
}
