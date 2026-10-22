// Первый экран: установка Blizzard L2 крупным планом, как в печатном каталоге. Нумерованные точки на корпусе
// и тонкие выноски с короткими фактами из каталога; на телефоне выноски превращаются в список под фото.
// Координаты точек и подписей — в процентах от кадра (data/site.json → heroProduct).
import { resolveImage } from '../../lib/images';
import { site } from '../../lib/content';

const EDGE = 3; // отступ подписей от края кадра, %
const ELBOW = 4; // длина диагонального «колена» выноски, %

// Выноски рисуются в координатах самого кадра (1100 × 940), чтобы линии не искажались на любой ширине
const [FRAME_W, FRAME_H] = [1100, 940];

function leaderPoints({ x, y, labelY, side }) {
  const elbowX = side === 'left' ? x - ELBOW : x + ELBOW;
  const endX = side === 'left' ? EDGE : 100 - EDGE;
  return [
    [x, y],
    [elbowX, labelY],
    [endX, labelY],
  ]
    .map(([px, py]) => `${(px * FRAME_W) / 100},${(py * FRAME_H) / 100}`)
    .join(' ');
}

export default function HeroProduct() {
  const product = site.heroProduct;
  const image = resolveImage(product.image, product.name);
  return (
    <figure className="hero-product">
      <div className="hero-product-frame">
        <img
          src={image.src}
          alt={`${product.name} — ${product.caption.toLowerCase()}`}
          width={FRAME_W}
          height={FRAME_H}
        />
        <svg className="hero-leaders" viewBox={`0 0 ${FRAME_W} ${FRAME_H}`} aria-hidden="true">
          {product.callouts.map((callout, index) => (
            <polyline key={callout.title} points={leaderPoints(callout)} pathLength="1" style={{ '--i': index }} />
          ))}
        </svg>
        {product.callouts.map((callout, index) => (
          <span
            key={callout.title}
            className="hero-dot"
            style={{ left: `${callout.x}%`, top: `${callout.y}%`, '--i': index }}
            aria-hidden="true"
          >
            {index + 1}
          </span>
        ))}
        {product.callouts.map((callout, index) => (
          <span
            key={callout.title}
            className={`hero-label hero-label-${callout.side}`}
            style={{ top: `${callout.labelY}%`, '--i': index }}
            aria-hidden="true"
          >
            <b>{callout.title}</b>
            <small>{callout.text}</small>
          </span>
        ))}
      </div>
      {/* Тот же список фактов — для скринридеров и для телефона, где выноски не помещаются */}
      <ol className="hero-facts-list">
        {product.callouts.map((callout) => (
          <li key={callout.title}>
            <b>{callout.title}</b> <span>{callout.text}</span>
          </li>
        ))}
      </ol>
      <figcaption>
        <a href={product.href}>
          <span className="mono">{product.name}</span> · {product.caption}
          <span aria-hidden="true"> →</span>
        </a>
      </figcaption>
    </figure>
  );
}
