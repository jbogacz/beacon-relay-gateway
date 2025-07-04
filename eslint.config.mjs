import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier' // Add prettier to prevent conflicts
  ),
  {
    rules: {
      // Add any custom rules here
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
    },
  },
  {
    ignores: ['.next/*', 'node_modules/*'],
  },
];

export default eslintConfig;
