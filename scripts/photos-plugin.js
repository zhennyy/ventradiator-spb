// Vite-плагин для фотографий из images/:
//   • модуль `virtual:photos` — список настоящих фото, которые уже лежат в images/ (resolveImage в src/lib/images.js
//     по нему решает: фото или заглушка);
//   • в режиме разработки отдаёт SVG-заглушки /images/placeholders/<имя>.svg (при сборке их пишет scripts/prerender.js).
import fs from 'node:fs';
import path from 'node:path';

const VIRTUAL_ID = 'virtual:photos';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
export const PHOTO_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;

export function listPhotos(imagesDir) {
  if (!fs.existsSync(imagesDir)) return [];
  return fs
    .readdirSync(imagesDir)
    .filter((fileName) => PHOTO_EXTENSIONS.test(fileName))
    .sort();
}

export default function photosPlugin({ imagesDir = path.resolve('images') } = {}) {
  return {
    name: 'blizzard-photos',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(listPhotos(imagesDir))};`;
    },
    configureServer(server) {
      // Положили или удалили фото — список пересобирается, страница перезагружается.
      server.watcher.add(imagesDir);
      server.watcher.on('all', (event, file) => {
        if (!file.startsWith(imagesDir)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
      server.middlewares.use(async (req, res, next) => {
        const match = req.url.match(/^\/images\/placeholders\/([\w-]+)\.svg$/);
        if (!match) return next();
        const entry = await server.ssrLoadModule('/src/entry-server.jsx');
        const image = entry.listImages().find((item) => item.src === match[0]);
        if (!image) return next();
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.end(entry.renderPlaceholder(image));
      });
    },
  };
}
