// «Как работает рекуперация» — схема двух потоков на странице раздела «Вентиляция».
import HeatRecoveryDiagram from '../../components/HeatRecoveryDiagram/HeatRecoveryDiagram';
import SectionTitle from '../../components/SectionTitle/SectionTitle';

export default function HowItWorks() {
  return (
    <section className="how-it-works" aria-labelledby="how-title">
      <div className="wrap how-grid">
        <div>
          <SectionTitle id="how-title" eyebrow="Принцип" title="Как работает рекуперация" />
          <p className="how-text">
            Свежий воздух с улицы и тёплый воздух из комнат проходят через рекуператор навстречу друг другу, не
            смешиваясь. Уличный воздух забирает тепло уходящего — и попадает в комнаты уже подогретым.
          </p>
        </div>
        <HeatRecoveryDiagram />
      </div>
    </section>
  );
}
