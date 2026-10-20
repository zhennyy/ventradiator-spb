// Контакты: офис в Петербурге (адрес пока заглушка), офис для России/СНГ/Прибалтики и форма заявки.
import PageHero from '../../components/PageHero/PageHero';
import RequestForm from '../../components/RequestForm/RequestForm';
import Specs from '../../components/Specs/Specs';
import { site } from '../../lib/content';
import { phoneHref } from '../../lib/text';
import './ContactsPage.css';

function Office({ office }) {
  return (
    <article className="office">
      <p className="eyebrow">{office.region}</p>
      <h2>{office.title}</h2>
      <div className="office-phones">
        {office.phones.map((phone) => (
          <a className="office-phone" href={phoneHref(phone)} key={phone}>
            {phone}
          </a>
        ))}
      </div>
      <Specs
        rows={[
          ['Адрес', office.address],
          [
            'Почта',
            <a key="email" href={`mailto:${site.email}`}>
              {site.email}
            </a>,
          ],
        ]}
      />
    </article>
  );
}

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Контакты"
        paragraphs={[
          'Представительство Blizzard в Санкт-Петербурге: подбор вентиляции и центральных пылесосов для домов и квартир в Петербурге и Ленинградской области.',
        ]}
      />
      <section className="contacts">
        <div className="wrap office-grid">
          {site.offices.map((office) => (
            <Office key={office.id} office={office} />
          ))}
        </div>
      </section>
      <RequestForm heading="Написать в представительство" />
    </>
  );
}
