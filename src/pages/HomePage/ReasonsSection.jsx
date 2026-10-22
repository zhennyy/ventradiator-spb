// «Почему эти системы»: слева заголовок, справа шесть причин из data/site.json — список «термин — пояснение», как в спецификации.
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import StubText from '../../components/StubText/StubText';
import { site } from '../../lib/content';
import './ReasonsSection.css';

export default function ReasonsSection() {
  return (
    <section className="reasons" aria-labelledby="reasons-title">
      <div className="wrap">
        <div className="reasons-layout">
          <SectionTitle eyebrow="Почему эти системы" title="Инженерия, которую не слышно" id="reasons-title" />
          <dl className="reason-list">
            {site.reasons.map(([title, body]) => (
              <div className="reason" key={title}>
                <dt>{title}</dt>
                <dd>
                  <StubText>{body}</StubText>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
