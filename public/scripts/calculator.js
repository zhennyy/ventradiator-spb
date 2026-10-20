// Калькулятор: примерная цена по виду работ и количеству. Цены — заглушки, заменить на цены клиента.
const PRICE_RULES = {
  radiators: { label: 'Количество радиаторов', unit: 'шт.', min: 1, max: 20, start: 5, pricePerUnit: 9000, note: 'с работой и материалами' },
  ventilation: { label: 'Площадь помещения', unit: 'м²', min: 20, max: 300, start: 60, pricePerUnit: 2500, note: 'приточно-вытяжная система' },
  conditioner: { label: 'Количество комнат', unit: 'шт.', min: 1, max: 6, start: 2, pricePerUnit: 38000, note: 'сплит-система с монтажом' },
};

const formatRubles = (amount) => Math.round(amount / 1000) * 1000;

export function setupCalculator(form) {
  if (!form) return;
  const amountInput = form.querySelector('[data-amount]');
  const amountLabel = form.querySelector('[data-amount-label]');
  const amountValue = form.querySelector('[data-amount-value]');
  const result = form.querySelector('[data-result]');
  const resultNote = form.querySelector('[data-result-note]');

  const currentRule = () => PRICE_RULES[form.elements.kind.value];

  function render() {
    const rule = currentRule();
    const amount = Number(amountInput.value);
    amountValue.textContent = `${amount} ${rule.unit}`;
    result.textContent = `от ${formatRubles(rule.pricePerUnit * amount).toLocaleString('ru-RU')} ₽`;
    resultNote.textContent = rule.note;
  }

  function switchKind() {
    const rule = currentRule();
    amountLabel.textContent = rule.label;
    Object.assign(amountInput, { min: rule.min, max: rule.max, value: rule.start });
    render();
  }

  form.addEventListener('change', (event) => {
    if (event.target.name === 'kind') switchKind();
  });
  amountInput.addEventListener('input', render);
  switchKind();
}
