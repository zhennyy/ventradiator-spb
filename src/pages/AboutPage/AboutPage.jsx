// «О компании»: представительство в Петербурге, бренды, направления каталога (ссылки на все разделы) и принципы систем.
import PageHero from '../../components/PageHero/PageHero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Specs from '../../components/Specs/Specs';
import StubText from '../../components/StubText/StubText';
import { catalog, sectionPath, site } from '../../lib/content';
import { hasContent } from '../../lib/text';
import './AboutPage.css';

export default function AboutPage() {
  const { legal } = site;
  return (
    <>
      <PageHero
        eyebrow="Представительство в Санкт-Петербурге"
        title="О компании"
        paragraphs={[
          'Подбор и поставка вентиляции, пылеудаления, отопления и инженерных систем для частных домов и квартир.',
        ]}
      />
      <section className="about">
        <div className="wrap about-grid">
          <div className="prose">
            <p>
              Мы — официальные дилеры. Вентиляция и системы пылеудаления — европейского производства. Радиаторы и
              конвекторы — от брендов с собственными заводами: Kohr, Velar, Royal Thermo, Rifar, Gekon, Vitron. Для
              водоснабжения — станции Balanstar и насосы DAB, для защиты от протечек — Neptun.
            </p>
            <p>
              В Санкт-Петербурге работает офис представительства: здесь подберут оборудование, рассчитают систему и
              организуют поставку на объект — в Петербурге, Ленинградской области и по всей России.
            </p>
          </div>
          <nav className="about-directions" aria-label="Направления">
            <p className="eyebrow">Направления</p>
            <ul>
              {catalog.sections.map((section) => (
                <li key={section.slug}>
                  <a href={sectionPath(section)}>{section.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          {hasContent(legal.representative) && (
            <aside className="legal-card" aria-label="Реквизиты представительства">
              <p className="eyebrow">Представительство в СПб</p>
              <p>
                <StubText>{legal.representative}</StubText>
              </p>
            </aside>
          )}
        </div>
        <div className="wrap">
          <SectionTitle eyebrow="Принципы" title="Почему эти системы" />
          <Specs rows={site.reasons} wide />
        </div>
      </section>
    </>
  );
}
