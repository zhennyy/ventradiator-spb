// Картинки: если в images/ уже лежит настоящее фото — копируем его в dist,
// иначе генерируем SVG-заглушку с названием. Шаблоны получают готовый путь.
const fs = require('node:fs');
const path = require('node:path');
const { renderPlaceholder } = require('./placeholder');

function createImageResolver({ imagesDir, outDir }) {
  const used = new Map();

  function resolve(fileName, title, kind) {
    if (used.has(fileName)) return used.get(fileName);
    const source = path.join(imagesDir, fileName);
    let publicPath;
    if (fs.existsSync(source)) {
      publicPath = `/images/${fileName}`;
      fs.mkdirSync(path.join(outDir, 'images'), { recursive: true });
      fs.copyFileSync(source, path.join(outDir, 'images', fileName));
    } else {
      const svgName = fileName.replace(/\.\w+$/, '') + '.svg';
      publicPath = `/images/placeholders/${svgName}`;
      fs.mkdirSync(path.join(outDir, 'images', 'placeholders'), { recursive: true });
      fs.writeFileSync(
        path.join(outDir, 'images', 'placeholders', svgName),
        renderPlaceholder({ title, fileName, kind }),
      );
    }
    const image = { src: publicPath, isPlaceholder: !fs.existsSync(source), fileName, title };
    used.set(fileName, image);
    return image;
  }

  return { resolve, list: () => [...used.values()] };
}

module.exports = { createImageResolver };
