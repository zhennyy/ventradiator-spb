// Контакты: карточка офиса в Санкт-Петербурге (адрес пока заглушка) и блок контактов.
import PageHero from '../../components/PageHero/PageHero';
import ContactBlock from '../../components/ContactBlock/ContactBlock';
import StubText from '../../components/StubText/StubText';
import { site } from '../../lib/content';
import { hasContent, phoneHref } from '../../lib/text';
import './ContactsPage.css';

// Офис одной строкой без рамки: слева регион и название, дальше колонки «Телефон», «Адрес», «Почта».
// Пустые поля (адрес-заглушка на готовом сайте) просто не выводятся; на телефоне колонки встают друг под другом.
function Office({ office }) {
  const phone = office.phones[0];
  const details = [
    phone && {
      label: 'Телефон',
      value: (
        <a className="office-phone" href={phoneHref(phone)}>
          {phone}
        </a>
      ),
    },
    hasContent(office.address) && { label: 'Адрес', value: <StubText>{office.address}</StubText> },
    office.email && { label: 'Почта', value: <a href={`mailto:${office.email}`}>{office.email}</a> },
  ].filter(Boolean);

  return (
    <article className="office">
      <div className="office-head">
        <p className="eyebrow">{office.region}</p>
        <h2>{office.title}</h2>
      </div>
      {details.length ? (
        details.map(({ label, value }) => (
          <div className="office-item" key={label}>
            <p className="office-label">{label}</p>
            <div className="office-value">{value}</div>
          </div>
        ))
      ) : (
        <p className="office-note">
          Телефон и адрес офиса появятся здесь в ближайшее время. А пока <a href="#request">напишите нам</a> — ответим и
          подготовим расчёт.
        </p>
      )}
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
          'Представительство в Санкт-Петербурге: вентиляция, пылеудаление, радиаторы, конвекторы и инженерные системы для домов и квартир — в Петербурге, Ленинградской области и по всей России.',
        ]}
      />
      <section className="contacts">
        <div className="wrap office-grid">
          {site.offices.map((office) => (
            <Office key={office.id} office={office} />
          ))}
        </div>
      </section>
      <ContactBlock heading="Написать в представительство" />
    </>
  );
}
