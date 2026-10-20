// Заявка на замер: проверяем поля и согласие, отправляем на сервер (/api/request), сервер пересылает её владельцу.
const PHONE_PATTERN = /^[+\d][\d\s()-]{9,}$/;

export function setupRequestForm(form) {
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');

  const showStatus = (text, state) => {
    status.textContent = text;
    status.dataset.state = state;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fields = form.elements;
    if (!fields.name.value.trim()) return showStatus('Как к вам обращаться?', 'error');
    if (!PHONE_PATTERN.test(fields.phone.value.trim())) return showStatus('Проверьте номер телефона', 'error');
    if (!fields.consent.checked) return showStatus('Отметьте согласие на обработку данных', 'error');

    submitButton.disabled = true;
    showStatus('Отправляем…', 'pending');
    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.value.trim(),
          phone: fields.phone.value.trim(),
          comment: fields.comment.value.trim(),
          consent: true,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      showStatus('Спасибо! Перезвоним в течение 15 минут в рабочее время.', 'ok');
    } catch {
      showStatus('Не получилось отправить. Позвоните нам: +7 (383) 000-00-00', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
}
