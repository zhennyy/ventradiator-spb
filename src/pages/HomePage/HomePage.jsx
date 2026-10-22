// Главная: первый экран, два направления, почему эти системы и форма заявки.
import RequestForm from '../../components/RequestForm/RequestForm';
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
      <RequestForm />
    </>
  );
}
