// SVG-заглушка вместо фото: светлая «чертёжная» карточка с названием товара и именем файла,
// который нужно положить в images/, чтобы заглушка сменилась настоящим фото.
// При сборке рендерится в отдельные файлы /images/placeholders/*.svg (scripts/prerender.js).
const WIDTH = 1200;
const HEIGHT = 900;
const LINE_HEIGHT = 68;

// Делим длинное название на строки примерно по 22 символа, чтобы оно не вылезало за край.
export function splitTitle(title, maxLength = 22) {
  const lines = [];
  let current = '';
  for (const word of title.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export default function PlaceholderSvg({ title, fileName, kind = 'product' }) {
  const lines = splitTitle(title);
  const startY = HEIGHT / 2 - ((lines.length - 1) * LINE_HEIGHT) / 2 + 20;
  const label = kind === 'object' ? 'ФОТО ОБЪЕКТА' : 'ФОТО ТОВАРА';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label={title}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#ddd8cd" strokeWidth="1" />
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#faf9f5" />
          <stop offset="1" stopColor="#ece9e1" />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#fade)" />
      <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" opacity="0.7" />
      <g fill="none" stroke="#23578a" strokeWidth="2" opacity="0.28">
        <circle cx="930" cy="450" r="190" />
        <circle cx="930" cy="450" r="130" />
        <circle cx="930" cy="450" r="70" />
        <path d="M700 450H1160M930 220V680" />
      </g>
      <g fontFamily="'Golos Text', 'Segoe UI', Arial, sans-serif" fill="#17191b">
        <text x="96" y="140" fontSize="26" letterSpacing="4" fill="#23578a">
          {`${label} · ЗАГЛУШКА`}
        </text>
        <text fontSize="58" fontWeight="600">
          {lines.map((line, index) => (
            <tspan key={index} x="96" y={startY + index * LINE_HEIGHT}>
              {line}
            </tspan>
          ))}
        </text>
        <text x="96" y="790" fontSize="24" fill="#55595d">
          {`images/${fileName}`}
        </text>
      </g>
      <path d="M96 170H360" stroke="#23578a" strokeWidth="3" />
    </svg>
  );
}
