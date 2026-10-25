// «Услуги»: чем занимаемся — проекты вентиляции и кондиционирования, монтаж.
// Каждый блок — фото и текст рядом (фото чередуется слева/справа), под текстом короткий список работ.
import { useEffect, useRef } from 'react';
import CatalogImage from '../../components/CatalogImage/CatalogImage';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { resolveImage } from '../../lib/images';

// Видео без звука по кругу. React не выводит атрибут muted при пререндере, поэтому звук
// выключаем и запускаем ролик уже в браузере (иначе мобильные браузеры не дают автозапуск).
function AutoVideo({ src, poster, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    // Тихий ролик по кругу; если пользователь просит меньше анимации — не запускаем (остаётся обложка)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (/jsdom/.test(navigator.userAgent)) return;
    video.play?.()?.catch?.(() => {});
  }, []);
  return <video ref={ref} src={src} poster={poster} aria-label={label} loop playsInline preload="metadata" />;
}

export default function ServiceWorks({ works }) {
  return works.map((work, index) => (
    <section
      className={`work${index % 2 ? ' work-reverse' : ''}`}
      id={work.id}
      key={work.id}
      aria-labelledby={`${work.id}-title`}
    >
      <div className="wrap work-grid">
        <div className="work-media">
          {work.video ? (
            // Ролик «как работает вентиляция»: без звука, по кругу, как живая картинка; пока грузится — кадр-обложка
            <AutoVideo src={work.video} poster={resolveImage(work.image, work.title).src} label={work.alt} />
          ) : (
            <CatalogImage image={resolveImage(work.image, work.title)} alt={work.alt} />
          )}
        </div>
        <div className="work-body">
          <SectionTitle id={`${work.id}-title`} eyebrow={work.eyebrow} title={work.title} />
          <div className="work-text">
            {work.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="work-points">
            {work.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  ));
}
