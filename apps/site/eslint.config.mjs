import { nextJsConfig } from '@repo/eslint-config/next-js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...nextJsConfig,
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      prettier,
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      'prettier/prettier': 'error',
      'turbo/no-undeclared-env-vars': [
        'warn',
        {
          allowList: [
            'NODE_ENV',
            'MAILERLITE_API_KEY',
            'NEXT_PUBLIC_GTM_ID',
            'NEXT_RUNTIME',
            'SESSION_SECRET',
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
