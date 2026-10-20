// Заголовок секции: надзаголовок (eyebrow), заголовок h2/h1 и необязательный вводный абзац.
import StubText from '../StubText/StubText';
import './SectionTitle.css';

export default function SectionTitle({ eyebrow, title, lead, id, level = 'h2' }) {
  const Heading = level;
  return (
    <div className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={id}>{title}</Heading>
      {lead && (
        <p className="section-lead">
          <StubText>{lead}</StubText>
        </p>
      )}
    </div>
  );
}
