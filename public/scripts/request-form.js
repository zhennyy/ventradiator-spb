// Отправка заявки на /api/request JSON-запросом. Поля проверяются здесь и ещё раз на сервере,
// результат показывается в строке статуса (aria-live), чтобы его услышали и скринридеры.
(function setupRequestForms() {
  const MESSAGES = {
    sending: 'Отправляем…',
    success: 'Спасибо! Заявка отправлена — мы перезвоним в рабочее время.',
    consent: 'Отметьте согласие на обработку персональных данных.',
    invalid: 'Проверьте имя и телефон.',
    tooMany: 'Слишком много заявок подряд. Попробуйте через несколько минут или позвоните нам.',
    failed: 'Не удалось отправить заявку. Позвоните нам, пожалуйста.',
  };

  function countDigits(value) {
    return (value.match(/\d/g) || []).length;
  }

  function validate(form) {
    const name = form.elements.name.value.trim();
    const phoneDigits = countDigits(form.elements.phone.value);
    form.elements.name.setAttribute('aria-invalid', String(name.length < 2));
    form.elements.phone.setAttribute('aria-invalid', String(phoneDigits < 10 || phoneDigits > 15));
    if (name.length < 2) return { message: MESSAGES.invalid, field: form.elements.name };
    if (phoneDigits < 10 || phoneDigits > 15) return { message: MESSAGES.invalid, field: form.elements.phone };
    if (!form.elements.consent.checked) return { message: MESSAGES.consent, field: form.elements.consent };
    return null;
  }

  async function submitForm(form, status) {
    const problem = validate(form);
    if (problem) {
      status.textContent = problem.message;
      status.dataset.state = 'error';
      problem.field.focus();
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = MESSAGES.sending;
    status.dataset.state = 'pending';
    const payload = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      comment: form.elements.comment.value.trim(),
      product: form.elements.product ? form.elements.product.value : '',
      consent: form.elements.consent.checked,
    };
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        form.reset();
        status.textContent = MESSAGES.success;
        status.dataset.state = 'success';
      } else {
        status.textContent = response.status === 429 ? MESSAGES.tooMany : MESSAGES.failed;
        status.dataset.state = 'error';
      }
    } catch (error) {
      status.textContent = MESSAGES.failed;
      status.dataset.state = 'error';
    } finally {
      button.disabled = false;
    }
  }

  document.querySelectorAll('[data-request-form]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form, status);
    });
  });
})();
