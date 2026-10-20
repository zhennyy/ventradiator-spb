// Схема в первом экране: двухконтурная установка с рекуперацией — приток и вытяжка
// проходят через теплообменник. Линии потоков анимируются (отключается при prefers-reduced-motion).
import './HeatRecoveryDiagram.css';

const LABELS = [
  [20, 146, '01 НАРУЖНЫЙ ВОЗДУХ'],
  [376, 146, '03 ИЗ КОМНАТ'],
  [20, 306, '04 НА УЛИЦУ'],
  [376, 306, '02 В КОМНАТЫ'],
  [150, 96, 'BLIZZARD L2 · ДВА КОНТУРА'],
  [150, 356, 'РЕКУПЕРАЦИЯ ТЕПЛА'],
];
const JOINTS = [
  [150, 160],
  [370, 160],
  [150, 280],
  [370, 280],
];

export default function HeatRecoveryDiagram() {
  return (
    <figure className="hero-drawing" aria-hidden="true">
      <svg viewBox="0 0 520 440" role="presentation">
        <defs>
          <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="hero-fade">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mask">
            <rect width="520" height="440" fill="url(#hero-fade)" />
          </mask>
        </defs>
        <rect x="0" y="0" width="520" height="440" fill="url(#hero-grid)" mask="url(#hero-mask)" />
        <g className="drawing-frame" fill="none" stroke="var(--ink)" strokeWidth="1.4">
          <rect x="150" y="110" width="220" height="220" rx="14" />
          <path d="M260 110v220M150 220h220" strokeDasharray="3 5" stroke="var(--ink-soft)" strokeWidth="1" />
          <path d="M200 160l120 120M320 160L200 280" stroke="var(--ink-soft)" strokeWidth="1" />
        </g>
        <g fill="none" strokeWidth="3" strokeLinecap="round">
          <path className="flow flow-cool" d="M20 160H150M370 280H500" stroke="var(--accent)" />
          <path className="flow flow-cool" d="M150 160C220 160 300 280 370 280" stroke="var(--accent)" opacity="0.6" />
          <path className="flow flow-warm" d="M500 160H370M150 280H20" stroke="var(--warm)" />
          <path className="flow flow-warm" d="M370 160C300 160 220 280 150 280" stroke="var(--warm)" opacity="0.6" />
        </g>
        <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2">
          {JOINTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
          ))}
        </g>
        <g className="drawing-labels" fontSize="12" fill="var(--ink-soft)">
          {LABELS.map(([left, top, label]) => (
            <text key={label} x={left} y={top}>
              {label}
            </text>
          ))}
        </g>
        <g stroke="var(--ink-soft)" strokeWidth="1">
          <path d="M150 370h220M150 364v12M370 364v12" />
        </g>
      </svg>
    </figure>
  );
}
