// Главная: первый экран, два направления, почему эти системы и контакты.
import ContactBlock from '../../components/ContactBlock/ContactBlock';
import DirectionsSection from './DirectionsSection';
import HomeHero from './HomeHero';
import ReasonsSection from './ReasonsSection';
import './HomePage.css';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DirectionsSection />
      <ReasonsSection />
      <ContactBlock />
    </>
  );
}
