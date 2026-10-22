// Мягкое появление блоков при прокрутке. Работает только с JS и без «уменьшения движения»:
// в готовом HTML всё видно сразу, класс .reveal-ready ставится на <html> уже в браузере.
// Блоки, которые уже на экране, показываются сразу; остальные — когда доезжают до экрана, лесенкой.
const TARGETS = [
  'main > section .section-head',
  '.category-grid > li',
  '.direction-grid > li',
  '.reason-list > li',
  '.object-grid > li',
  '.variant-list > li',
  '.benefits > li',
  '.models-table',
  '.request-grid > *',
].join(',');

export function startReveal(root = document) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const elements = [...root.querySelectorAll(TARGETS)];
  const fold = window.innerHeight;
  const below = elements.filter((element) => element.getBoundingClientRect().top > fold * 0.92);
  if (!below.length) return () => {};

  document.documentElement.classList.add('reveal-ready');
  below.forEach((element) => element.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      const shown = entries.filter((entry) => entry.isIntersecting);
      shown.forEach((entry, index) => {
        entry.target.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  below.forEach((element) => observer.observe(element));
  return () => observer.disconnect();
}
