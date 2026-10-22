// Характеристики: строки «название — значение» с тонкими линиями. Значение — текст или готовый элемент.
import StubText from '../StubText/StubText';
import './Specs.css';

export default function Specs({ rows = [], wide = false }) {
  if (!rows.length) return null;
  return (
    <dl className={wide ? 'specs specs-wide' : 'specs'}>
      {rows.map(([label, value], index) => (
        <div key={index}>
          <dt>{label}</dt>
          <dd>{typeof value === 'string' ? <StubText>{value}</StubText> : value}</dd>
        </div>
      ))}
    </dl>
  );
}
