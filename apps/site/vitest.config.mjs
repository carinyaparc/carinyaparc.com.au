import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../../tests/setup/vitest.setup.ts'],
    include: [
      '../../tests/unit/**/*.test.{ts,tsx}',
      '../../tests/integration/**/*.test.{ts,tsx}',
      '../../tests/smoke/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup/',
        'tests/mocks/',
        '.next/',
        '.turbo/',
        'coverage/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/instrumentation*.ts',
        'sentry.*.config.ts',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
    deps: {
      external: ['@sentry/nextjs'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/src': resolve(__dirname, './src'),
      'test-utils': resolve(__dirname, '../../tests/helpers/renderWithProviders.tsx'),
    },
  },
  define: {
    'process.env': process.env,
  },
});
