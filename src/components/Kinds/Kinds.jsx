// «Какие бывают»: виды товара внутри категории — короткие карточки без фото
// (например, внутрипольные конвекторы с естественной конвекцией, с вентилятором, «тепло–холод»).
import './Kinds.css';

export default function Kinds({ category }) {
  if (!category.kinds?.length) return null;
  return (
    <section className="kinds" aria-labelledby="kinds-title">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Виды</p>
          <h2 id="kinds-title">Какие бывают</h2>
        </div>
        <ul className="kind-list">
          {category.kinds.map((kind, index) => (
            <li className="kind" key={kind.title}>
              <span className="kind-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{kind.title}</h3>
              <p>{kind.text}</p>
              {kind.series && <p className="kind-series">{kind.series}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
