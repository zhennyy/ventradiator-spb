// Главная: первый экран, два направления, почему Blizzard, объекты и форма заявки.
import RequestForm from '../../components/RequestForm/RequestForm';
import DirectionsSection from './DirectionsSection';
import HomeHero from './HomeHero';
import ObjectsStrip from './ObjectsStrip';
import ReasonsSection from './ReasonsSection';
import './HomePage.css';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DirectionsSection />
      <ReasonsSection />
      <ObjectsStrip />
      <RequestForm />
    </>
  );
}
