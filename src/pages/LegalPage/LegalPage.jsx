// Страница документа (политика или согласие): жёлтая плашка «шаблон», заголовок и пронумерованные разделы.
import StubText from '../../components/StubText/StubText';
import { DOCUMENTS } from './documents';
import './LegalPage.css';

function TemplateBanner() {
  return (
    <div className="template-banner" role="note">
      <b>Шаблон документа.</b> Перед публикацией сайта замените все поля{' '}
      <span className="stub">[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА]</span> и <span className="stub">[ЗАГЛУШКА]</span> реальными
      данными и согласуйте текст с юристом.
    </div>
  );
}

export default function LegalPage({ documentId }) {
  const { eyebrow, title, intro, sections } = DOCUMENTS[documentId];
  return (
    <section className="legal">
      <div className="wrap legal-wrap">
        <TemplateBanner />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="section-lead">
          <StubText>{intro}</StubText>
        </p>
        <div className="prose legal-body">
          {sections.map(([heading, paragraphs], index) => (
            <section key={heading}>
              <h2>{`${index + 1}. ${heading}`}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <StubText>{paragraph}</StubText>
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
