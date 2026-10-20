// Правила кода: рекомендованный набор ESLint + React и хуки + запрет коротких непонятных имён.
// Сайт (src/) — браузерный код; сервер, сборка и проверки (server/, scripts/, tools/) — Node.
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  { ignores: ['node_modules/', 'dist/', 'dist-server/', 'public/'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, __BUILD_YEAR__: 'readonly' },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-unused-vars': ['error', { args: 'after-used', caughtErrors: 'none', ignoreRestSiblings: true }],
      'id-length': ['error', { min: 2, exceptions: ['_'], properties: 'never' }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['server/**/*.js', 'scripts/**/*.js', '*.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // Playwright: код в page.evaluate выполняется в браузере.
    files: ['tools/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
