// Текст из данных: заглушки [ЗАГЛУШКА…] и [РЕКВИЗИТЫ…] подсвечиваются жёлтым, чтобы их было видно на странице.
import { splitStubs } from '../../lib/text';
import './StubText.css';

export default function StubText({ children }) {
  return splitStubs(children).map((part, index) =>
    part.isStub ? (
      <span className="stub" key={index}>
        {part.text}
      </span>
    ) : (
      part.text
    ),
  );
}
