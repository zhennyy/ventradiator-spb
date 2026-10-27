# Фотографии для сайта

Если фото нет — при сборке (`npm run build`) вместо каждой генерируется аккуратная SVG-заглушка с названием товара и именем файла (её рисует компонент `src/components/Placeholder`).

Фото взяты с сайта клиента (blizzard-klima.ru) и уменьшены до 1400 px. Перед публикацией нужно подтверждение клиента, что их можно использовать. У объектов на сайте клиента — фирменные линейные рисунки, их и используем.

Исключение: `direction-ventilation.jpg`, `direction-dust-removal.jpg`, `direction-engineering.jpg` и `direction-services.jpg` — сгенерированные интерьеры (иллюстрации, не реальные объекты и не продукция Blizzard), 1600×1000. Если клиент даст свои фото интерьеров — лучше заменить.

Тоже сгенерированы: `vent-r2-flat.jpg` (рендер плоских воздуховодов — форма по каталогу, но не фото реального изделия). Лучше заменить на материалы клиента.

## Как заменить заглушку

1. Положите файл в эту папку `images/` **точно с тем именем**, что в таблице (формат `.jpg`).
2. Запустите `npm run build` — сборка сама возьмёт фото вместо заглушки (в режиме `npm run dev` — сразу, без пересборки).

Рекомендуемый размер: **1200×900 px (4:3)**, JPEG, до 300 КБ. Фото направлений на главной обрезаются до 16:10 — главное держите по центру.

Дополнительно (необязательно): `og-cover.jpg` 1200×630 — картинка для превью ссылок в мессенджерах и соцсетях. Если её нет, тег `og:image` просто не выводится.

## Главная — направления

| Файл | Что на фото |
| --- | --- |
| `direction-ventilation.jpg` | Первый экран главной: светлая гостиная с приточной решёткой на потолке |
| `direction-dust-removal.jpg` | Пылеудаление: центральный пылесос или уборка шлангом от пневморозетки |

## Вентиляция

| Файл | Что на фото |
| --- | --- |
| `vent-l2.jpg` | Вентиляционные установки Blizzard — главное фото категории (L2) |
| `vent-diff-d2-round.jpg` | Диффузор D2 R круглый (каталог Blizzard 2025) |
| `vent-diff-d2-square.jpg` | Диффузор D2 Q квадратный (каталог) |
| `vent-diff-d2-floor.jpg` | Напольная решётка D2 (каталог) |
| `vent-diff-d4-round.jpg` | Архитектурный диффузор D4 R (каталог) |
| `vent-diff-d4-linear.jpg` | Линейный диффузор D4 (каталог) |
| `vent-diff-d5-cross.jpg` | Решётка D5 Cross, стекло сатин белое (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-cross-round.jpg` | D5 Cross мини круг (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-bronze.jpg` | D5 Cross, стекло сатин бронзового цвета (скриншот брошюры D5 от клиента) |
| `vent-diff-d5-twist.jpg` | D5 Twist мини круг, коричневое стекло (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-shape.jpg` | D5 Shape, белое стекло (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-pyramid.jpg` | D5 Pyramid, металл (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-avantgarde.jpg` | D5 Avantgarde, нержавеющая сталь (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `vent-diff-d5-interior.jpg` | Решётка D5 Shape в интерьере (брошюра Blizzard D5 «Домашние драгоценности» от клиента) |
| `paint-anthracite.jpg` | Услуги → покраска: радиатор RAL 7016 в интерьере (сгенерированная иллюстрация) |
| `paint-burgundy.jpg` | Покраска: радиатор RAL 3004 (сгенерированная иллюстрация) |
| `paint-green.jpg` | Покраска: радиатор RAL 6005 (сгенерированная иллюстрация) |
| `paint-white.jpg` | Покраска: радиатор RAL 9016 (сгенерированная иллюстрация) |
| `rad-velar-interior.jpg` | Velar в интерьере (сайт velarwh.ru) |
| `vent-l2-unit.jpg` | Blizzard L2 DP (из каталога Blizzard 2025) |
| `vent-l3.jpg` | Blizzard L3 ES (из каталога Blizzard 2025) |
| `vent-l5-450.jpg` | Blizzard L5 450 (из каталога Blizzard 2025) |
| `vent-l5-360.jpg` | Blizzard L5 360, плоская (из каталога Blizzard 2025) |
| `vent-r2.jpg` | Система воздуховодов R2 (общий вид) |
| `vent-r2-round.jpg` | Круглые воздуховоды R2 Ø75 и Ø90 в бухтах |
| `vent-r2-flat.jpg` | Плоские воздуховоды R2 50×100 и 60×130 |
| `vent-collectors.jpg` | Коллекторы: пластиковые (808–216 V) и металлические RS |
| `vent-heat-protection.jpg` | Воздуховоды теплозащитной серии Ø125/160/180 |
| `vent-acoustic.jpg` | Воздуховоды акустической серии Ø125/160/180 |
| `vent-diffusers.jpg` | Диффузоры (эффект Коанда) |
| `vent-accessories.jpg` | Аксессуары для вентиляции |
| `vent-consumables.jpg` | Расходные материалы для вентиляции |
| `vent-valves.jpg` | Приточно-вытяжные клапаны |

## Пылеудаление

| Файл | Что на фото |
| --- | --- |
| `dust-v1.jpg` | Центральные пылесосы серии V1 (M10, M30, C40) |
| `dust-v2.jpg` | Центральные пылесосы серии V2 (C 600 / S 700) |
| `dust-v3.jpg` | Центральные пылесосы серии V3 (360 / 430) |
| `dust-professional.jpg` | Профессиональные системы пылеудаления |
| `dust-hoses.jpg` | Шланги (общий вид) |
| `dust-hoses-integrated.jpg` | Встроенные шланги H-2 и H-3 (выходят из стены) |
| `dust-hoses-quick.jpg` | Шланги быстрой уборки Wally-flex и Vroom |
| `dust-sockets.jpg` | Пневморозетки V1, V2, V3 R в разных цветах |
| `dust-dustpans.jpg` | Пневмосовки (4 цвета) |
| `dust-accessories.jpg` | Насадки, турбощётки, сепаратор для камина |
| `dust-consumables.jpg` | Мешки и фильтры |

## Радиаторы

Фото и логотипы — с официальных сайтов брендов (kohr.ru, velarwh.ru, rifar.ru, royal-thermo.ru, gekon.pro).
Логотипы Kohr и Vitron перекрашены из белого в тёмный, чтобы читались на светлом фоне.

| Файл | Что на фото |
| --- | --- |
| `rad-kohr.jpg` | Трубчатый радиатор Kohr |
| `rad-kohr-2tube.jpg` | Kohr Heim 2-трубный, крупный план (сайт kohr.ru, фон — студийная подложка) |
| `rad-kohr-2tube-full.jpg` | Kohr Heim 2-трубный (сайт kohr.ru, фон — студийная подложка) |
| `rad-kohr-3tube.jpg` | Kohr Heim 3-трубный графит, крупный план (сайт kohr.ru, фон — студийная подложка) |
| `rad-kohr-3tube-full.jpg` | Kohr Heim 3-трубный графит (сайт kohr.ru, фон — студийная подложка) |
| `kohr-thermohead.jpg` | Термоголовка Kohr (сайт kohr.ru, фон — студийная подложка) |
| `kohr-bottom-connection.jpg` | Узел нижнего подключения Kohr (сайт kohr.ru, фон — студийная подложка) |
| `kohr-valve.jpg` | Вентиль Kohr (сайт kohr.ru, фон — студийная подложка) |
| `kohr-bracket.jpg` | Кронштейн Kohr (сайт kohr.ru, фон — студийная подложка) |
| `kohr-floor-bracket.jpg` | Напольный кронштейн Kohr (сайт kohr.ru, фон — студийная подложка) |
| `eng-balanstar.jpg` | Пресс-тройник Balanstar Press Inox (сайт balanstar.ru) |
| `eng-dab.jpg` | Насосы DAB с логотипом на студийной подложке (фото и логотип — сайт db-shop.ru) |
| `rad-velar-2col.jpg` | Трубчатый радиатор Velar, 2-колончатый |
| `rad-velar-3col.jpg` | Трубчатый радиатор Velar, 3-колончатый (и фото раздела) |
| `rad-velar-3col-burgundy.jpg` | Velar 3-колончатый, перекрашен в бордовый (обработка фото Velar) — плитка «Коллекция Velar» |
| `rad-velar-4col.jpg` | Трубчатый радиатор Velar, 4-колончатый |
| `rad-rifar-base.jpg` | Биметаллические радиаторы Rifar Base |
| `rad-royal-panel.jpg` | Панельные радиаторы Royal Thermo COMPACT |
| `rad-gekon-panel.jpg` | Панельный радиатор Gekon |
| `service-projects-video-poster.jpg` | Первый кадр ролика «Как работает вентиляция» (Blizzard), дом целиком — обложка видео в «Услугах»; само видео — `public/video/how-work.mp4` |
| `rad-velar-p30.jpg` | Дизайн-радиатор Velar P30 (сайт velarwh.ru) |
| `rad-velar-p60.jpg` | Velar P60 (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-q40.jpg` | Дизайн-радиатор Velar Q40 (сайт velarwh.ru) |
| `rad-velar-q60.jpg` | Дизайн-радиатор Velar Q60 (сайт velarwh.ru) |
| `rad-velar-q80.jpg` | Дизайн-радиатор Velar Q80 (сайт velarwh.ru) |
| `rad-velar-r32.jpg` | Дизайн-радиатор Velar R32 (сайт velarwh.ru) |
| `rad-velar-r42.jpg` | Velar R42 в интерьере (материалы Velar для партнёров, Яндекс Диск клиента) |
| `rad-velar-r89.jpg` | Velar R89 (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-s.jpg` | Velar S (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-s-detail.jpg` | Velar S крупным планом (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-p60-detail.jpg` | Velar P60 с полотенцедержателем (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-r89-vertical.jpg` | Velar R89 вертикальный (материалы Velar для партнёров (Яндекс Диск клиента), фон — студийная подложка) |
| `rad-velar-sp.jpg` | Дизайн-радиатор Velar SP (сайт velarwh.ru) |
| `rad-zehnder-charleston.jpg` | Трубчатый радиатор Zehnder Charleston (фото от клиента) |
| `rad-rifar-tubog.jpg` | Rifar Tubog (фото от клиента) |
| `rad-rifar-tubog-studio.jpg` | Rifar Tubog на светлом сером фоне |
| `rad-zehnder-charleston-studio.jpg` | Zehnder Charleston на светлом сером фоне |
| `rad-rt-biliner.jpg` | Royal Thermo BiLiner (сайт royal-thermo.ru), фон — студийная подложка |
| `rad-rt-revolution.jpg` | Royal Thermo Revolution Bimetall (royal-thermo.ru), фон — студийная подложка |
| `rad-rt-pianoforte.jpg` | Royal Thermo PianoForte (royal-thermo.ru), фон — студийная подложка |
| `rad-rt-indigo.jpg` | Royal Thermo Indigo Super+ (royal-thermo.ru), фон — студийная подложка |
| `rad-rt-eclipse.jpg` | Royal Thermo Eclipse (сайт royal-thermo.ru, фон расширен до 4:3) |
| `rad-rt-vittoria.jpg` | Royal Thermo Vittoria Super (сайт royal-thermo.ru, фон расширен до 4:3) |
| `rad-rt-monoblock.jpg` | Royal Thermo Monoblock B (сайт royal-thermo.ru, фон расширен до 4:3) |
| `rad-rt-compact.jpg` | Royal Thermo Compact (royal-thermo.ru) |
| `rad-rt-ventil-compact.jpg` | Royal Thermo Ventil Compact (royal-thermo.ru) |
| `rad-rt-hygiene.jpg` | Royal Thermo Hygiene (royal-thermo.ru) |
| `rad-rt-flat.jpg` | Royal Thermo Flat (royal-thermo.ru) |
| `rad-rifar-base-series.jpg` | Rifar Base, три высоты (сайт rifar.ru), фон — студийная подложка |
| `rad-rifar-monolit.jpg` | Rifar Monolit (rifar.ru), фон — студийная подложка |
| `rad-rifar-supremo.jpg` | Rifar SUPReMO (rifar.ru), фон — студийная подложка |
| `logo-kohr.png` | Логотип Kohr |
| `logo-velar.png` | Логотип Velar |
| `logo-rifar.png` | Логотип Rifar |
| `logo-royal-thermo.png` | Логотип Royal Thermo |
| `logo-gekon.png` | Логотип Gekon |

## Конвекторы

Фото — с vitron.ru и velarwh.ru.

| Файл | Что на фото |
| --- | --- |
| `conv-vitron-floor.jpg` | Внутрипольный конвектор Vitron ВК (и фото раздела) |
| `conv-vitron-standing.jpg` | Напольный конвектор Vitron ВКН |
| `conv-vitron-wall.jpg` | Настенный конвектор Vitron ВКС |
| `conv-vitron-vk.jpg` | Vitron ВК (сайт vitron.ru) |
| `conv-vitron-vkv.jpg` | Vitron ВКВ.24 (сайт vitron.ru) |
| `conv-vitron-vke.jpg` | Vitron ВКЭ (сайт vitron.ru) |
| `conv-vitron-vkve.jpg` | Vitron ВКВЭ (сайт vitron.ru) |
| `conv-vitron-vkn.jpg` | Vitron ВКН (сайт vitron.ru) |
| `conv-vitron-vkn-eko.jpg` | Vitron ВКН ЭКО (сайт vitron.ru) |
| `conv-vitron-vken.jpg` | Vitron ВКЭН (сайт vitron.ru) |
| `conv-vitron-vks.jpg` | Vitron ВКС (сайт vitron.ru) |
| `conv-vitron-vks-int.jpg` | Vitron ВКС в интерьере (сайт vitron.ru) |
| `conv-vitron-vks-eko.jpg` | Vitron ВКС ЭКО (сайт vitron.ru) |
| `conv-velar-natural.jpg` | Внутрипольный конвектор Velar с естественной конвекцией |
| `conv-velar-fan.jpg` | Внутрипольный конвектор Velar с вентилятором |
| `logo-vitron.png` | Логотип Vitron |

## Инженерные системы и услуги

| Файл | Что на фото |
| --- | --- |
| `direction-engineering.jpg` | Фото раздела «Инженерные системы»: котельная частного дома (сгенерированная иллюстрация) |
| `direction-services.jpg` | Фото раздела «Услуги»: монтаж радиатора (сгенерированная иллюстрация) |

## Объекты

Подпись на сайте — только «Где установлены эти системы», без описания работ.

| Файл | Что на фото |
| --- | --- |

Фото объектов тоже нужны с правом на использование (от клиента или свободной лицензии).
