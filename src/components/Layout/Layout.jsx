// Каркас страницы: ссылка «Перейти к содержанию», шапка, хлебные крошки, содержимое и подвал.
import { useEffect } from 'react';
import { startReveal } from '../../lib/reveal';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import TopBar from '../Header/TopBar';
import './Layout.css';

export default function Layout({ page, children }) {
  // Появление блоков при прокрутке — только в браузере, после гидратации
  useEffect(() => startReveal(), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>
      <TopBar currentPath={page.path} />
      <Header currentPath={page.path} hasContacts={Boolean(page.hasContacts)} />
      <main id="main" tabIndex={-1}>
        <Breadcrumbs crumbs={page.breadcrumbs} />
        {children}
      </main>
      <Footer hasContacts={Boolean(page.hasContacts)} />
    </>
  );
}
