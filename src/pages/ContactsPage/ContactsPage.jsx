// Контакты: офис в Петербурге (адрес пока заглушка), офис для России/СНГ/Прибалтики и форма заявки.
import PageHero from '../../components/PageHero/PageHero';
import RequestForm from '../../components/RequestForm/RequestForm';
import Specs from '../../components/Specs/Specs';
import { site } from '../../lib/content';
import { hasContent, phoneHref } from '../../lib/text';
import './ContactsPage.css';

function Office({ office }) {
  return (
    <article className="office">
      <p className="eyebrow">{office.region}</p>
      <h2>{office.title}</h2>
      {office.phones.length === 0 && !hasContent(office.address) && (
        <p className="office-note">
          Телефон и адрес офиса появятся здесь в ближайшее время. А пока оставьте <a href="#request">заявку</a> — мы
          свяжемся с вами.
        </p>
      )}
      {office.phones.length > 0 && (
        <div className="office-phones">
          {office.phones.map((phone) => (
            <a className="office-phone" href={phoneHref(phone)} key={phone}>
              {phone}
            </a>
          ))}
        </div>
      )}
      <Specs
        rows={[
          ...(hasContent(office.address) ? [['Адрес', office.address]] : []),
          ...(site.email
            ? [
                [
                  'Почта',
                  <a key="email" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>,
                ],
              ]
            : []),
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
          'Представительство в Санкт-Петербурге: подбор вентиляции и центральных пылесосов для домов и квартир в Петербурге, Ленинградской области и по всей России.',
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
