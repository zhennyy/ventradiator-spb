"""Лёгкие копии фото для сайта: images/opt/<имя>-640.webp и <имя>-1200.webp (для главного фото — ещё 1600 и 2800).
Браузер сам выбирает нужный размер (srcset), исходные JPG/PNG остаются как запасной вариант.
Запуск после добавления или замены фото:  python3 tools/optimize-images.py
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'images'
OUT = SRC / 'opt'
WIDTHS = [640, 1200]
HERO = {'direction-ventilation.jpg': [640, 1200, 1600, 2800]}

OUT.mkdir(exist_ok=True)
names = sorted(p for p in SRC.iterdir() if p.suffix.lower() in ('.jpg', '.jpeg', '.png') and not p.name.startswith('logo-'))
expected = set()
for path in names:
    with Image.open(path) as im:
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
        for width in HERO.get(path.name, WIDTHS):
            if width > im.width and width != HERO.get(path.name, WIDTHS)[0]:
                continue
            target = OUT / f'{path.stem}-{width}.webp'
            expected.add(target.name)
            if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
                continue
            w = min(width, im.width)
            copy = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) if w < im.width else im
            copy.save(target, 'WEBP', quality=80, method=6)
for stale in OUT.glob('*.webp'):
    if stale.name not in expected:
        stale.unlink()
print(f'images/opt: {len(expected)} файлов')
