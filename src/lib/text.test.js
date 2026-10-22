// Склонение «категория» после числа.
import { describe, expect, it } from 'vitest';
import { countCategories, hasContent, isStub } from './text';

describe('countCategories', () => {
  it.each([
    [1, '1 категория'],
    [3, '3 категории'],
    [9, '9 категорий'],
    [11, '11 категорий'],
    [21, '21 категория'],
    [24, '24 категории'],
  ])('%i → %s', (count, text) => {
    expect(countCategories(count)).toBe(text);
  });
});

describe('заглушки', () => {
  it('isStub — вся строка заглушка', () => {
    expect(isStub('[ЗАГЛУШКА: адрес офиса]')).toBe(true);
    expect(isStub('[РЕКВИЗИТЫ ПРЕДСТАВИТЕЛЬСТВА]')).toBe(true);
    expect(isStub('Невский пр., 1')).toBe(false);
  });

  it('hasContent — в разработке заглушку видно, пустое поле — нет', () => {
    expect(hasContent('[ЗАГЛУШКА: адрес офиса]')).toBe(true);
    expect(hasContent('Невский пр., 1')).toBe(true);
    expect(hasContent('')).toBe(false);
  });
});
