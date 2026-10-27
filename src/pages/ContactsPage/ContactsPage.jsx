// Контакты: вступление и один блок «Контакты» (телефон, почта, Telegram, MAX и адрес офиса, когда он появится).
// Отдельной карточки офиса нет — она повторяла бы телефон и почту из блока.
import ContactBlock from '../../components/ContactBlock/ContactBlock';
import PageHero from '../../components/PageHero/PageHero';
import { site } from '../../lib/content';

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Санкт-Петербург · работаем по всей России"
        title="Контакты"
        paragraphs={[
          'Представительство в Санкт-Петербурге: вентиляция, пылеудаление, радиаторы, конвекторы и инженерные системы для домов и квартир — в Петербурге, Ленинградской области и по всей России.',
        ]}
      />
      <ContactBlock heading="Написать в представительство" address={site.offices[0].address} />
    </>
  );
}
