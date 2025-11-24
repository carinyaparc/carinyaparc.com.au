# Testing Architecture for Site Package

This document outlines the testing structure and best practices for the site package.

## Structure

### Dependency Management

We follow these best practices for testing dependencies:

- **Root level dependencies:**
  - Core test runners: `vitest`
  - Testing utilities: `@testing-library/jest-dom`, `@testing-library/user-event`
  - Coverage tools: `@vitest/coverage-v8`
  - Mocking libraries: `msw`, `jsdom`

- **Package level dependencies:**
  - Framework-specific testing libraries: `@testing-library/react`
  - Package-specific plugins: `@vitejs/plugin-react` for React testing

### Configuration Files

- **Root config (`vitest.config.js`):**
  - Workspace-level configuration with shared defaults
  - Sets baseline coverage settings
  - Minimal configuration for flexibility

- **Site config (`apps/site/vitest.config.mjs`):**
  - Site-specific test configuration
  - Points to `__tests__/` directory within site package
  - Configures React testing environment
  - Sets up path aliases matching tsconfig.json

### Test Organization

```
apps/site/__tests__/
├── unit/               # Fast-running isolated tests
│   ├── app/           # App router tests
│   │   ├── api/       # API route tests
│   │   └── blog/      # Blog page tests
│   ├── components/    # React component tests
│   ├── hooks/         # Custom hook tests
│   ├── lib/           # Utility function tests
│   └── services/      # Service layer tests
│
├── integration/       # Tests for multiple components working together
│   └── components/    # Integration tests
│
├── smoke/             # Basic verification tests for critical functionality
│
├── fixtures/          # Shared test data
│
├── mocks/             # API mocking and test doubles
│
├── helpers/           # Reusable test utilities
│   └── renderWithProviders.tsx  # Custom render with context
│
├── setup/             # Global test configuration
│   └── vitest.setup.ts  # Test environment setup
│
└── security/          # Security-related tests
```

## Scripts

### Root Package Scripts (via Turbo)

```bash
# Run all tests across all packages
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run only smoke tests
pnpm test:smoke

# Run tests for CI environments
pnpm test:ci
```

### Site Package Scripts

From the root directory:

```bash
# Using turbo (recommended)
pnpm turbo run test --filter=site
pnpm turbo run test:coverage --filter=site
```

From the site directory (`apps/site/`):

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
pnpm test:unit         # Run only unit tests
pnpm test:integration  # Run only integration tests
pnpm test:smoke        # Run only smoke tests
pnpm test:ci           # Run tests in CI mode
```

## Best Practices

1. **Test Organization**
   - Keep tests close to the code they test
   - Follow the AAA pattern: Arrange, Act, Assert
   - Write descriptive test names

2. **Dependency Management**
   - Use shared dependencies from the root
   - Install package-specific testing libraries at the package level
   - Maintain consistent versions across the monorepo

3. **Mock Management**
   - Use MSW for API mocking
   - Keep fixture data in the fixtures directory
   - Use dependency injection for easier testing

4. **CI Integration**
   - Unit and smoke tests run on all PRs
   - Integration tests run on main branch merges
   - Coverage reports are generated and tracked
