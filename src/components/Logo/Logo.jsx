// Логотип: знак-«поток воздуха» и название; ведёт на главную. Используется в шапке и подвале.
import { site } from '../../lib/content';
import './Logo.css';

export default function Logo() {
  return (
    <a className="logo" href="/" aria-label={`${site.brand} — на главную`}>
      <svg className="logo-mark" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 12h12a3 3 0 1 0-3-3M7 17h17a3 3 0 1 1-3 3M7 22h8"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      {/* Только название — без подписи города: город и так есть в шапке и в тексте */}
      <span className="logo-text">
        <b>{site.brand}</b>
      </span>
    </a>
  );
}
