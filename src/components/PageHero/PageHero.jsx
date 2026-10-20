// Шапка внутренней страницы: надзаголовок и h1 слева, вводный текст справа, снизу — необязательный блок.
import StubText from '../StubText/StubText';
import './PageHero.css';

export default function PageHero({ eyebrow, title, paragraphs, children }) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="page-hero-text">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <StubText>{paragraph}</StubText>
            </p>
          ))}
        </div>
      </div>
      {children && <div className="wrap">{children}</div>}
    </section>
  );
}
