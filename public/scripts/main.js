// Лендинг: калькулятор примерной стоимости и отправка заявки на замер
import { setupCalculator } from './calculator.js';
import { setupRequestForm } from './request-form.js';

setupCalculator(document.querySelector('[data-calculator]'));
setupRequestForm(document.querySelector('[data-request-form]'));
