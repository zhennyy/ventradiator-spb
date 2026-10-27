// Просмотр фото крупно: окно поверх страницы на тёмном фоне.
// Листается стрелками на экране, клавишами ← → и свайпом; закрывается крестиком, Esc или нажатием на фон.
// photos — [{ src, title }], index — какое фото открыто (null — окно закрыто).
import { useEffect, useRef } from 'react';
import './Lightbox.css';

// Насколько надо провести пальцем, чтобы перелистнуть фото
const SWIPE_DISTANCE = 50;

export default function Lightbox({ photos, index, onChange, onClose }) {
  const dialogRef = useRef(null);
  const touchStart = useRef(null);
  const isOpen = index !== null && index !== undefined;
  const count = photos.length;

  // Открываем и закрываем как модальное окно браузера: фокус внутри, страница под ним не нажимается
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== 'function') return undefined;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return undefined;
    // Страница под окном не прокручивается
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [isOpen]);

  if (!count) return null;
  const go = (step) => onChange((index + step + count) % count);
  const photo = isOpen ? photos[index] : null;

  function handleKeyDown(event) {
    if (count < 2) return;
    if (event.key === 'ArrowRight') go(1);
    if (event.key === 'ArrowLeft') go(-1);
  }

  function handleTouchEnd(event) {
    if (touchStart.current === null || count < 2) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > SWIPE_DISTANCE) go(distance < 0 ? 1 : -1);
  }

  return (
    // Esc закрывает окно сам браузер (событие cancel) — сообщаем об этом наверх
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Просмотр фото"
      onCancel={onClose}
      onKeyDown={handleKeyDown}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      {photo && (
        <>
          <figure className="lightbox-figure" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <img key={photo.src} src={photo.src} alt={photo.title} />
            <figcaption>
              {photo.title}
              {count > 1 && (
                <span className="lightbox-count">
                  {index + 1} / {count}
                </span>
              )}
            </figcaption>
          </figure>
          <button className="lightbox-close" type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
          {count > 1 && (
            <>
              <button
                className="lightbox-arrow is-prev"
                type="button"
                onClick={() => go(-1)}
                aria-label="Предыдущее фото"
              >
                ‹
              </button>
              <button
                className="lightbox-arrow is-next"
                type="button"
                onClick={() => go(1)}
                aria-label="Следующее фото"
              >
                ›
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
}
