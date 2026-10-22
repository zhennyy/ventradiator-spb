// «О компании»: представительство в Петербурге, производство в Германии и принципы систем.
import PageHero from '../../components/PageHero/PageHero';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Specs from '../../components/Specs/Specs';
import StubText from '../../components/StubText/StubText';
import { site } from '../../lib/content';
import './AboutPage.css';

export default function AboutPage() {
  const { legal } = site;
  return (
    <>
      <PageHero
        eyebrow="Представительство в Санкт-Петербурге"
        title="О компании"
        paragraphs={['Подбор и поставка немецких систем вентиляции с рекуперацией тепла и встроенного пылеудаления.']}
      />
      <section className="about">
        <div className="wrap about-grid">
          <div className="prose">
            <p>
              Продукция производится в Германии. Производственные площадки также есть в Швейцарии, Нидерландах и
              Бельгии.
            </p>
            <p>
              Производитель работает в разных странах через собственные филиалы и авторизованных партнёров. В
              Санкт-Петербурге работает офис представительства — здесь можно запросить цену и подобрать оборудование для
              дома или квартиры в Петербурге, Ленинградской области и по всей России.
            </p>
            <p>
              Два направления — <a href="/ventilation.html">вентиляция</a> и{' '}
              <a href="/dust-removal.html">пылеудаление</a>
              {`. В СНГ ${site.objectsTotal} `}
              <a href="/objects.html">объектов с этими системами</a>.
            </p>
          </div>
          <aside className="legal-card" aria-label="Реквизиты представительства">
            <p className="eyebrow">Представительство в СПб</p>
            <p>
              <StubText>{legal.representative}</StubText>
            </p>
          </aside>
        </div>
        <div className="wrap">
          <SectionTitle eyebrow="Принципы" title="Почему эти системы" />
          <Specs rows={site.reasons} wide />
        </div>
      </section>
    </>
  );
}
