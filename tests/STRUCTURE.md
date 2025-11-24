# Testing Architecture for CarinyaParc Monorepo

This document outlines the testing structure and best practices for the CarinyaParc monorepo.

## Structure

### Dependency Management

We follow these best practices for testing dependencies:

- **Root level dependencies:**
  - Core test runners: `vitest`
  - Testing utilities: `@testing-library/jest-dom`, `@testing-library/user-event`
  - Coverage tools: `@vitest/coverage-v8`
  - Mocking libraries: `msw`, `jsdom`

- **Package level dependencies:**
  - Framework-specific testing libraries: `@testing-library/react` in React packages
  - Package-specific plugins: `@vitejs/plugin-react` for React testing

### Configuration Files

- **Root config (`vitest.config.js`):**
  - Used for running monorepo-wide tests
  - Configures shared aliases and setup
  - Sets default test environment

- **Package configs (`apps/site/vitest.config.mjs`):**
  - Package-specific test configuration
  - Points to the tests directory for that package
  - Configures framework-specific plugins

### Test Organization

```
tests/
├── unit/               # Fast-running isolated tests
│   ├── components/     # React component tests
│   ├── hooks/          # Custom hook tests
│   └── lib/            # Utility function tests
│
├── integration/        # Tests for multiple components working together
│   └── components/     # Integration tests
│
├── smoke/              # Basic verification tests for critical pages
│
├── fixtures/           # Shared test data
│
├── mocks/              # API mocking and test doubles
│
├── helpers/            # Reusable test utilities
│
└── setup/              # Global test configuration
```

## Scripts

### Root Package Scripts

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

### Package Scripts

Each package has its own test scripts that can be run directly:

```bash
# From the site directory
pnpm test           # Run all tests for this package
pnpm test:unit      # Run only unit tests for this package
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
