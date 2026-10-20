// Теги <head> страницы: title, description, canonical, Open Graph, robots и JSON-LD.
// Рендерится только при сборке (scripts/prerender.js) в готовый HTML — поисковики видят всё без JavaScript.
export default function Head({ meta }) {
  const jsonLd = meta.jsonLd ? JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c') : '';
  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.robots && <meta name="robots" content={meta.robots} />}
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </>
  );
}
