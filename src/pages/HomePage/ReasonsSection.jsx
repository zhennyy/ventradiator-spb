// «Почему Blizzard» — единственная тёмная полоса на главной: шесть причин из data/site.json.
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import StubText from '../../components/StubText/StubText';
import { site } from '../../lib/content';
import { pad } from '../../lib/text';
import './ReasonsSection.css';

export default function ReasonsSection() {
  return (
    <section className="reasons" aria-labelledby="reasons-title">
      <div className="wrap">
        <SectionTitle eyebrow="Почему Blizzard" title="Инженерия, которую не слышно" id="reasons-title" />
        <ol className="reason-grid">
          {site.reasons.map(([title, body], index) => (
            <li className="reason" key={title}>
              <span className="reason-index">{pad(index + 1)}</span>
              <h3>{title}</h3>
              <p>
                <StubText>{body}</StubText>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
