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
          srcSet={photo.srcSet || undefined}
          sizes="100vw"
          alt={site.heroImage.alt}
          width="2800"
          height="1826"
          loading="eager"
          decoding="async"
        />
        <div className="wrap hero-copy-wrap">
          <div className="hero-copy">
            <h1>{'Инженерные решения для\u00a0частных домов и\u00a0квартир'}</h1>
            <p className="hero-lead">
              Подбор и поставка оборудования для квартир и домов — в Санкт-Петербурге, Ленинградской области и по всей
              России.
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
