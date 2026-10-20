// SVG-заглушка вместо фото: светлая «чертёжная» карточка с названием товара и именем файла,
// который нужно положить в images/, чтобы заглушка сменилась настоящим фото.
const { escapeHtml } = require('./html');

const WIDTH = 1200;
const HEIGHT = 900;

// Делим длинное название на строки примерно по 22 символа, чтобы оно не вылезало за край.
function splitTitle(title, maxLength = 22) {
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

function renderPlaceholder({ title, fileName, kind = 'product' }) {
  const lines = splitTitle(title);
  const lineHeight = 68;
  const startY = HEIGHT / 2 - ((lines.length - 1) * lineHeight) / 2 + 20;
  const titleLines = lines
    .map((line, index) => `<tspan x="96" y="${startY + index * lineHeight}">${escapeHtml(line)}</tspan>`)
    .join('');
  const label = kind === 'object' ? 'ФОТО ОБЪЕКТА' : 'ФОТО ТОВАРА';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="${escapeHtml(title)}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#d5dee7" stroke-width="1"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3f6f9"/>
      <stop offset="1" stop-color="#e3ebf3"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#fade)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" opacity="0.7"/>
  <g fill="none" stroke="#1f5bd8" stroke-width="2" opacity="0.28">
    <circle cx="930" cy="450" r="190"/>
    <circle cx="930" cy="450" r="130"/>
    <circle cx="930" cy="450" r="70"/>
    <path d="M700 450H1160M930 220V680"/>
  </g>
  <g font-family="Onest, 'Segoe UI', Arial, sans-serif" fill="#0e1a26">
    <text x="96" y="140" font-size="26" letter-spacing="4" fill="#1f5bd8">${label} · ЗАГЛУШКА</text>
    <text font-size="58" font-weight="600">${titleLines}</text>
    <text x="96" y="790" font-size="24" fill="#5b6772">images/${escapeHtml(fileName)}</text>
  </g>
  <path d="M96 170H360" stroke="#1f5bd8" stroke-width="3"/>
</svg>
`;
}

module.exports = { renderPlaceholder };
