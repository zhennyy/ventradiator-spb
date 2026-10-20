// Схема в первом экране: двухконтурная установка с рекуперацией — приток и вытяжка
// проходят через теплообменник. Линии потоков анимируются (отключается при prefers-reduced-motion).
function renderHeroDrawing() {
  return `<figure class="hero-drawing" aria-hidden="true">
  <svg viewBox="0 0 520 440" role="presentation">
    <defs>
      <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="var(--line)" stroke-width="0.6"/>
      </pattern>
      <radialGradient id="hero-fade">
        <stop offset="0.55" stop-color="#fff"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <mask id="hero-mask"><rect width="520" height="440" fill="url(#hero-fade)"/></mask>
    </defs>
    <rect x="0" y="0" width="520" height="440" fill="url(#hero-grid)" mask="url(#hero-mask)"/>
    <g class="drawing-frame" fill="none" stroke="var(--ink)" stroke-width="1.4">
      <rect x="150" y="110" width="220" height="220" rx="14"/>
      <path d="M260 110v220M150 220h220" stroke-dasharray="3 5" stroke="var(--ink-soft)" stroke-width="1"/>
      <path d="M200 160l120 120M320 160L200 280" stroke="var(--ink-soft)" stroke-width="1"/>
    </g>
    <g fill="none" stroke-width="3" stroke-linecap="round">
      <path class="flow flow-cool" d="M20 160H150M370 280H500" stroke="var(--accent)"/>
      <path class="flow flow-cool" d="M150 160C220 160 300 280 370 280" stroke="var(--accent)" opacity="0.6"/>
      <path class="flow flow-warm" d="M500 160H370M150 280H20" stroke="var(--warm)"/>
      <path class="flow flow-warm" d="M370 160C300 160 220 280 150 280" stroke="var(--warm)" opacity="0.6"/>
    </g>
    <g fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2">
      <circle cx="150" cy="160" r="5"/><circle cx="370" cy="160" r="5"/>
      <circle cx="150" cy="280" r="5"/><circle cx="370" cy="280" r="5"/>
    </g>
    <g class="drawing-labels" font-size="12" fill="var(--ink-soft)">
      <text x="20" y="146">01 НАРУЖНЫЙ ВОЗДУХ</text>
      <text x="376" y="146">03 ИЗ КОМНАТ</text>
      <text x="20" y="306">04 НА УЛИЦУ</text>
      <text x="376" y="306">02 В КОМНАТЫ</text>
      <text x="150" y="96">BLIZZARD L2 · ДВА КОНТУРА</text>
      <text x="150" y="356">РЕКУПЕРАЦИЯ ТЕПЛА</text>
    </g>
    <g stroke="var(--ink-soft)" stroke-width="1">
      <path d="M150 370h220M150 364v12M370 364v12"/>
    </g>
  </svg>
</figure>`;
}

module.exports = { renderHeroDrawing };
