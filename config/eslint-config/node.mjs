import base from './base.mjs';
import globals from 'globals';

export default [
  ...base,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Node.js 환경용 규칙
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
