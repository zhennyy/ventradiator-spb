// Склонение «категория» после числа.
import { describe, expect, it } from 'vitest';
import { countCategories } from './text';

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
