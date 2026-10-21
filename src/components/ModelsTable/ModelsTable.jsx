// Таблица моделей и артикулов категории. Первая колонка — заголовок строки; ячейки-заглушки подсвечены.
// Таблица прокручивается по горизонтали внутри своего блока (тени по краям подсказывают, что есть ещё),
// страница при этом не уезжает вбок. На телефоне каждая строка — карточка: подписи колонок берутся из data-label.
import { isStub } from '../../lib/text';
import StubText from '../StubText/StubText';
import './ModelsTable.css';

function Cell({ value, index, label }) {
  const Tag = index === 0 ? 'th' : 'td';
  return (
    <Tag
      scope={index === 0 ? 'row' : undefined}
      className={isStub(value) ? 'is-stub' : undefined}
      data-label={index === 0 ? undefined : label}
    >
      <StubText>{value}</StubText>
    </Tag>
  );
}

export default function ModelsTable({ models }) {
  const { columns, rows, caption } = models;
  return (
    <section className="models" aria-labelledby="models-title">
      <div className="wrap">
        <div className="models-head">
          <h2 id="models-title">Модели и артикулы</h2>
          <p>Цены по запросу — стоимость зависит от комплектации.</p>
        </div>
        <div className="table-scroll" tabIndex={0} role="region" aria-labelledby="models-title">
          <table className="models-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th scope="col" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, index) => (
                    <Cell key={index} value={value} index={index} label={columns[index]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {caption && (
          <p className="table-note">
            <StubText>{caption}</StubText>
          </p>
        )}
      </div>
    </section>
  );
}
