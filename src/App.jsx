// Маршруты сайта. Каждая страница из src/lib/routes.js открывается по адресу /<путь>.html и без .html;
// неизвестный адрес — страница 404. При сборке те же маршруты пререндерятся в готовый HTML.
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { findCategory, findSection, NOT_FOUND_PAGE, pages, pageUrls } from './lib/routes';
import AboutPage from './pages/AboutPage/AboutPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import ContactsPage from './pages/ContactsPage/ContactsPage';
import HomePage from './pages/HomePage/HomePage';
import LegalPage from './pages/LegalPage/LegalPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import SectionPage from './pages/SectionPage/SectionPage';

export function PageContent({ page }) {
  const section = page.sectionSlug ? findSection(page.sectionSlug) : null;
  switch (page.kind) {
    case 'home':
      return <HomePage />;
    case 'section':
      return <SectionPage section={section} />;
    case 'category':
      return <CategoryPage section={section} category={findCategory(section, page.categorySlug)} />;
    case 'about':
      return <AboutPage />;
    case 'contacts':
      return <ContactsPage />;
    case 'privacy':
      return <LegalPage documentId={page.kind} />;
    default:
      return <NotFoundPage />;
  }
}

function PageRoute({ page }) {
  return (
    <Layout page={page}>
      <PageContent page={page} />
    </Layout>
  );
}

const routablePages = pages.filter((page) => page !== NOT_FOUND_PAGE);

export default function App() {
  return (
    <Routes>
      {routablePages.flatMap((page) =>
        pageUrls(page).map((url) => <Route key={url} path={url} caseSensitive element={<PageRoute page={page} />} />),
      )}
      <Route path="*" element={<PageRoute page={NOT_FOUND_PAGE} />} />
    </Routes>
  );
}
