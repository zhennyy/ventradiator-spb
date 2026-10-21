// «О компании»: производитель, представительство в Петербурге и принципы Blizzard.
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
        eyebrow="О компании"
        title="BLIZZARD"
        paragraphs={['Немецкий производитель систем вентиляции с рекуперацией тепла и центральных пылесосов.']}
      />
      <section className="about">
        <div className="wrap about-grid">
          <div className="prose">
            <p>
              {`Продукция ${site.brand} производится в Германии. `}
              Производственные площадки также есть в Швейцарии, Нидерландах и Бельгии.
            </p>
            <p>
              Компания работает в разных странах через собственные филиалы и авторизованных партнёров. В
              Санкт-Петербурге работает офис представительства — здесь можно запросить цену и подобрать оборудование для
              дома или квартиры в Петербурге и Ленинградской области.
            </p>
            <p>
              Два направления — <a href="/ventilation.html">вентиляция</a> и{' '}
              <a href="/dust-removal.html">пылеудаление</a>
              {`. В СНГ ${site.objectsTotal} `}
              <a href="/objects.html">объектов с системами Blizzard</a>.
            </p>
          </div>
          <aside className="legal-card" aria-label="Юридическое лицо производителя">
            <p className="eyebrow">Производитель</p>
            <p className="legal-name">{legal.company}</p>
            <p>
              {`${legal.city}, Германия`}
              <br />
              {`Торговый реестр: ${legal.register}`}
            </p>
            <p className="eyebrow">Представительство в СПб</p>
            <p>
              <StubText>{legal.representative}</StubText>
            </p>
          </aside>
        </div>
        <div className="wrap">
          <SectionTitle eyebrow="Принципы" title="Почему Blizzard" />
          <Specs rows={site.reasons} wide />
        </div>
      </section>
    </>
  );
}
