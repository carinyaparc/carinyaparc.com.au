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
  - Includes colocated unit tests in `src/` directory
  - Includes centralized integration, smoke, and security tests in `__tests__/`
  - Configures React testing environment
  - Sets up path aliases matching tsconfig.json

### Test Organization

```
apps/site/
├── src/                        # Source code with colocated unit tests
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── layout.test.tsx     # ✓ Unit test colocated with source
│   │   ├── api/
│   │   │   └── subscribe/
│   │   │       ├── route.ts
│   │   │       └── route.test.ts   # ✓ Unit test colocated with source
│   │   └── (blog)/blog/
│   │       ├── page.tsx
│   │       └── page.test.tsx   # ✓ Unit test colocated with source
│   ├── components/
│   │   └── ui/
│   │       ├── Banner.tsx
│   │       └── Banner.test.tsx # ✓ Unit test colocated with source
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-mobile.test.tsx # ✓ Unit test colocated with source
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── cn.test.ts          # ✓ Unit test colocated with source
│   │   └── schema/
│   │       ├── article.ts
│   │       └── article.test.ts # ✓ Unit test colocated with source
│   └── services/
│       ├── api-service.ts
│       └── api-service.test.ts # ✓ Unit test colocated with source
│
└── __tests__/                  # Centralized test infrastructure
    ├── integration/            # Multi-component interaction tests
    │   └── components/
    │       └── SubscribeForm.test.tsx
    ├── smoke/                  # Critical path verification
    │   ├── Breadcrumb.test.tsx
    │   └── SchemaMarkup.test.tsx
    ├── security/               # Security-related tests
    │   └── headers.test.ts
    ├── fixtures/               # Shared test data
    │   ├── posts.json
    │   └── recipes.json
    ├── mocks/                  # API mocking and test doubles
    │   └── handlers.ts
    ├── helpers/                # Reusable test utilities
    │   ├── renderWithProviders.tsx
    │   └── test-utils.ts
    └── setup/                  # Global test configuration
        ├── vitest.setup.ts
        └── teardown.ts
```

## Test Types

### Unit Tests (Colocated in `src/`)

- **Location**: Next to the source files they test
- **Naming**: `*.test.ts` or `*.test.tsx`
- **Purpose**: Test individual units in isolation
- **Speed**: Very fast (< 100ms per test)
- **Examples**:
  - Component rendering and behavior
  - Hook functionality
  - Utility function logic
  - API route handlers

### Integration Tests (Centralized in `__tests__/integration/`)

- **Location**: `__tests__/integration/`
- **Purpose**: Test how multiple units work together
- **Speed**: Medium (100ms - 1s per test)
- **Examples**:
  - Form submission flows
  - Component interactions
  - Data flow between components

### Smoke Tests (Centralized in `__tests__/smoke/`)

- **Location**: `__tests__/smoke/`
- **Purpose**: Basic verification that critical paths work
- **Speed**: Fast to medium
- **Examples**:
  - Pages render without errors
  - Navigation works
  - Critical features load

### Security Tests (Centralized in `__tests__/security/`)

- **Location**: `__tests__/security/`
- **Purpose**: Verify security measures are in place
- **Speed**: Fast
- **Examples**:
  - Security headers
  - CSP policies
  - Authentication flows

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
pnpm test:unit         # Run only unit tests (colocated)
pnpm test:integration  # Run only integration tests
pnpm test:smoke        # Run only smoke tests
pnpm test:ci           # Run tests in CI mode
```

## Best Practices

### 1. Test Organization

- **Colocate unit tests** with the code they test
- Keep test files in the same directory as source files
- Use centralized directories only for integration, smoke, and infrastructure tests
- Follow the AAA pattern: Arrange, Act, Assert
- Write descriptive test names

### 2. Test Naming Conventions

- Unit tests: `ComponentName.test.tsx` or `functionName.test.ts`
- Integration tests: `FeatureName.test.tsx`
- Smoke tests: `CriticalPath.test.tsx`

### 3. Dependency Management

- Use shared dependencies from the root
- Install package-specific testing libraries at the package level
- Maintain consistent versions across the monorepo

### 4. Mock Management

- Use MSW for API mocking
- Keep fixture data in the `fixtures` directory
- Use dependency injection for easier testing
- Store shared mocks in `__tests__/mocks/`

### 5. Test Helpers

- Store reusable test utilities in `__tests__/helpers/`
- Use `renderWithProviders` for components that need context
- Create custom matchers when needed

### 6. CI Integration

- Unit and smoke tests run on all PRs
- Integration tests run on main branch merges
- Coverage reports are generated and tracked
- Security tests are mandatory

## Migration Notes

This project recently migrated from centralized unit tests to colocated unit tests following Next.js best practices:

- ✗ **Old**: All tests in `__tests__/unit/` mirroring `src/` structure
- ✓ **New**: Unit tests colocated with source files in `src/`
- ✓ **Kept**: Integration, smoke, security tests remain centralized in `__tests__/`

Benefits of this approach:

- Easier to find and update tests
- Better developer experience
- Follows Next.js documentation recommendations
- Aligns with modern React testing practices
