// Подсветка заглушек [ЗАГЛУШКА…] и [РЕКВИЗИТЫ…] в тексте.
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StubText from './StubText';

describe('StubText', () => {
  it('подсвечивает заглушки и оставляет обычный текст как есть', () => {
    const { container } = render(
      <p>
        <StubText>{'Адрес: [ЗАГЛУШКА: адрес офиса], оператор [РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА].'}</StubText>
      </p>,
    );
    const stubs = [...container.querySelectorAll('.stub')].map((stub) => stub.textContent);
    expect(stubs).toEqual(['[ЗАГЛУШКА: адрес офиса]', '[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА]']);
    expect(container.textContent).toBe('Адрес: [ЗАГЛУШКА: адрес офиса], оператор [РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА].');
  });

  it('без заглушек — просто текст', () => {
    const { container } = render(
      <p>
        <StubText>Сделано в Германии</StubText>
      </p>,
    );
    expect(container.querySelector('.stub')).toBeNull();
    expect(container.textContent).toBe('Сделано в Германии');
  });
});
