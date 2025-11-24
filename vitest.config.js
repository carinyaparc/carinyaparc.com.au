import { defineConfig } from 'vitest/config';

// Root-level vitest workspace configuration
// Individual apps define their own vitest configs
export default defineConfig({
  test: {
    // Workspace-level defaults
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/__tests__/**',
        '**/tests/**',
        '**/*.d.ts',
        '**/.next/**',
        '**/.turbo/**',
        '**/coverage/**',
        '**/*.config.*',
        '**/dist/**',
        '**/build/**',
      ],
    },
  },
});
