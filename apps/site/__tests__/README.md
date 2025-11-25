# Carinya Parc Test Suite

This directory contains centralized test infrastructure and end-to-end tests for the Carinya Parc website.

## Test Structure

The test suite follows Next.js best practices with **colocated unit tests** and **centralized integration/smoke tests**:

```
apps/site/
├── src/                            # Source code with colocated unit tests
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── layout.test.tsx         # ✓ Colocated unit test
│   │   ├── api/subscribe/
│   │   │   ├── route.ts
│   │   │   └── route.test.ts       # ✓ Colocated unit test
│   ├── components/ui/
│   │   ├── Banner.tsx
│   │   └── Banner.test.tsx         # ✓ Colocated unit test
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-mobile.test.tsx     # ✓ Colocated unit test
│   └── lib/
│       ├── cn.ts
│       └── cn.test.ts              # ✓ Colocated unit test
│
└── __tests__/                      # Centralized test infrastructure
    ├── integration/                # Multi-component interaction tests
    ├── smoke/                      # Critical path tests
    ├── security/                   # Security-specific tests
    ├── fixtures/                   # Static test data (JSON, mock content)
    ├── mocks/                      # API mocking handlers (MSW)
    ├── helpers/                    # Reusable test utilities
    │   ├── renderWithProviders.tsx # Custom renderer with context providers
    │   └── test-utils.ts           # Shared test utilities
    └── setup/                      # Global test configuration
        ├── vitest.setup.ts         # Vitest configuration and global mocks
        └── teardown.ts             # Global test cleanup
```

## Running Tests

### Running All Tests

To run all tests:

```bash
pnpm test
```

### Running Tests in Watch Mode

During development, you can run tests in watch mode to automatically re-run tests when files change:

```bash
pnpm test:watch
```

### Running Specific Test Types

To run specific types of tests:

```bash
# Run only unit tests (colocated in src/)
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run only smoke tests
pnpm test:smoke

# Run only security tests
pnpm test -- __tests__/security
```

### Code Coverage

To generate a code coverage report:

```bash
pnpm test:coverage
```

The coverage report will be available in the `coverage` directory.

## Test Technologies

The test suite uses the following technologies:

- **Vitest**: Fast and lightweight test runner compatible with Vite
- **React Testing Library**: User-focused testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking using service worker interception
- **@testing-library/jest-dom**: Custom DOM element matchers
- **@testing-library/user-event**: User event simulation

## Test Guidelines

### Unit Tests

- **Colocate with source**: Unit tests live next to the code they test (`*.test.ts` or `*.test.tsx`)
- Test individual components, hooks, and functions in isolation
- Mock all external dependencies
- Follow the Arrange-Act-Assert pattern
- Keep tests fast and focused

### Integration Tests

- **Centralized in `__tests__/integration/`**: Test how components work together
- Mock only external API calls
- Verify data flows correctly between components

### Smoke Tests

- **Centralized in `__tests__/smoke/`**: Verify critical pages render without errors
- Basic sanity checks for the application
- Focus on critical user paths

### Security Tests

- **Centralized in `__tests__/security/`**: Test security headers, CSP, and authentication
- Ensure proper security measures are in place

## Writing Effective Tests

1. **Use Descriptive Names**: Tests should clearly describe what they're testing
2. **Test Behavior, Not Implementation**: Focus on what components do, not how they do it
3. **Use Specific Queries**: Prefer queries like `getByLabelText` over generic queries like `getByRole`
4. **Isolate Tests**: Each test should be independent of others
5. **Handle Asynchronous Code**: Use `waitFor` and `async/await` for testing async behavior

## Benefits of Colocated Unit Tests

- **Discoverability**: Tests live next to the code they test
- **Maintainability**: Easier to update tests when refactoring
- **Import Simplicity**: Use relative imports instead of long paths
- **Coverage Visibility**: Instantly see which files have tests
- **Framework Alignment**: Follows Next.js and modern React best practices
