// Схема в первом экране: двухконтурная установка с рекуперацией — приток и вытяжка
// проходят через теплообменник. Линии потоков анимируются (отключается при prefers-reduced-motion).
// На телефоне подписи у линий не поместятся читаемым шрифтом: там у линий остаются только номера,
// а расшифровка выводится легендой под схемой (.hero-legend, видна только на телефоне).
import './HeatRecoveryDiagram.css';

// [x, y, номер, подпись, поток: cool — наружный/приточный, warm — из комнат/на улицу, якорь текста]
const FLOW_LABELS = [
  [20, 146, '01', 'НАРУЖНЫЙ ВОЗДУХ', 'cool', 'start'],
  [540, 266, '02', 'В КОМНАТЫ', 'cool', 'end'],
  [540, 146, '03', 'ИЗ КОМНАТ', 'warm', 'end'],
  [20, 266, '04', 'НА УЛИЦУ', 'warm', 'start'],
];
const JOINTS = [
  [180, 160],
  [380, 160],
  [180, 280],
  [380, 280],
];

export default function HeatRecoveryDiagram() {
  return (
    <figure className="hero-drawing" aria-hidden="true">
      <svg viewBox="0 64 560 326" role="presentation">
        <defs>
          <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="0.6" />
          </pattern>
          <radialGradient id="hero-fade">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-mask">
            <rect y="40" width="560" height="360" fill="url(#hero-fade)" />
          </mask>
        </defs>
        <rect y="40" width="560" height="360" fill="url(#hero-grid)" mask="url(#hero-mask)" />
        <g className="drawing-frame" fill="none" stroke="var(--ink)" strokeWidth="1.4">
          <rect x="180" y="110" width="200" height="220" rx="14" />
          <path d="M280 110v220M180 220h200" strokeDasharray="3 5" stroke="var(--ink-soft)" strokeWidth="1" />
          <path d="M226 166l108 108M334 166L226 274" stroke="var(--ink-soft)" strokeWidth="1" />
        </g>
        <g fill="none" strokeWidth="3" strokeLinecap="round">
          <path className="flow flow-cool" d="M20 160H180M380 280H540" stroke="var(--accent)" />
          <path className="flow flow-cool" d="M180 160C250 160 310 280 380 280" stroke="var(--accent)" opacity="0.6" />
          <path className="flow flow-warm" d="M540 160H380M180 280H20" stroke="var(--warm)" />
          <path className="flow flow-warm" d="M380 160C310 160 250 280 180 280" stroke="var(--warm)" opacity="0.6" />
        </g>
        <g fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.2">
          {JOINTS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
          ))}
        </g>
        <g className="drawing-labels" fill="var(--ink-soft)">
          {FLOW_LABELS.map(([left, top, number, label, , anchor]) => (
            <text key={number} x={left} y={top} textAnchor={anchor}>
              <tspan className="label-number">{number}</tspan>
              <tspan className="label-name">{` ${label}`}</tspan>
            </text>
          ))}
          <text className="label-caption" x="280" y="96" textAnchor="middle">
            BLIZZARD L2 · ДВА КОНТУРА
          </text>
          <text className="label-caption" x="280" y="358" textAnchor="middle">
            РЕКУПЕРАЦИЯ ТЕПЛА
          </text>
        </g>
        <g stroke="var(--ink-soft)" strokeWidth="1">
          <path d="M180 372h200M180 366v12M380 366v12" />
        </g>
      </svg>
      <ul className="hero-legend">
        {FLOW_LABELS.map(([, , number, label, flow]) => (
          <li key={number} className={`legend-${flow}`}>
            <b>{number}</b> {label.toLowerCase()}
          </li>
        ))}
      </ul>
    </figure>
  );
}
