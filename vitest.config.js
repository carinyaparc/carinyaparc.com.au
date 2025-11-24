import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// Root-level vitest configuration
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.d.ts',
        '**/.next/**',
        '**/coverage/**',
        '**/*.config.*',
        '**/apps/site/.next/**',
      ],
    },
    include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['./tests/security/**', '**/node_modules/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/site/src'),
      '@/src': resolve(__dirname, './apps/site/src'),
      '@/app': resolve(__dirname, './apps/site/src/app'),
      '@/src/app': resolve(__dirname, './apps/site/src/app'),
      '@/components': resolve(__dirname, './apps/site/src/components'),
      '@/src/components': resolve(__dirname, './apps/site/src/components'),
      '@/lib': resolve(__dirname, './apps/site/src/lib'),
      '@/src/lib': resolve(__dirname, './apps/site/src/lib'),
      '@/types': resolve(__dirname, './apps/site/src/types'),
      '@/src/types': resolve(__dirname, './apps/site/src/types'),
      '@/hooks': resolve(__dirname, './apps/site/src/hooks'),
      '@/src/hooks': resolve(__dirname, './apps/site/src/hooks'),
      '@/utils': resolve(__dirname, './apps/site/src/utils'),
      '@/src/utils': resolve(__dirname, './apps/site/src/utils'),
      '@/styles': resolve(__dirname, './apps/site/src/styles'),
      '@/src/styles': resolve(__dirname, './apps/site/src/styles'),
      // React imports should resolve to the site package
      react: resolve(__dirname, './apps/site/node_modules/react'),
      'react-dom': resolve(__dirname, './apps/site/node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, './apps/site/node_modules/react/jsx-runtime'),
      'react/jsx-dev-runtime': resolve(__dirname, './apps/site/node_modules/react/jsx-dev-runtime'),
      '@testing-library/react': resolve(__dirname, './node_modules/@testing-library/react'),
      '@site': resolve(__dirname, './apps/site/src'),
    },
  },
});
