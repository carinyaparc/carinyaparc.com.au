# Carinya Parc Test Suite

This directory contains all the tests for the Carinya Parc website, organized following a comprehensive testing strategy.

## Test Structure

The test suite is organized into the following structure:

```
tests/
├── unit/                           # Fast-running isolated tests for individual components and functions
│   ├── components/                 # React component tests
│   ├── hooks/                      # Custom hook tests
│   ├── lib/                        # Utility function tests
│   └── services/                   # API wrapper tests
│
├── integration/                    # Tests that verify how multiple components work together
│   └── components/                 # Integration tests for component interactions
│
├── smoke/                          # Basic tests to verify critical pages render without errors
│
├── fixtures/                       # Static test data (JSON, mock content)
│
├── mocks/                          # API mocking handlers (MSW) and other test doubles
│
├── helpers/                        # Reusable test utilities and custom renderers
│   └── renderWithProviders.tsx     # Custom renderer with context providers
│
└── setup/                          # Global test configuration
    ├── vitest.setup.ts            # Vitest configuration and global mocks
    └── teardown.ts                # Global test cleanup
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

To run specific types of tests, you can use the Vitest filtering options:

```bash
# Run tests that match a specific filename pattern
pnpm test -- "Banner"

# Run only unit tests
pnpm test -- --dir tests/unit

# Run only integration tests
pnpm test -- --dir tests/integration

# Run only smoke tests
pnpm test -- --dir tests/smoke
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

- Test individual components, hooks, and functions in isolation
- Mock all external dependencies
- Follow the Arrange-Act-Assert pattern
- Keep tests fast and focused

### Integration Tests

- Test how components work together
- Mock only external API calls
- Verify data flows correctly between components

### Smoke Tests

- Verify critical pages render without errors
- Basic sanity checks for the application

## Writing Effective Tests

1. **Use Descriptive Names**: Tests should clearly describe what they're testing
2. **Test Behavior, Not Implementation**: Focus on what components do, not how they do it
3. **Use Specific Queries**: Prefer queries like `getByLabelText` over generic queries like `getByRole`
4. **Isolate Tests**: Each test should be independent of others
5. **Handle Asynchronous Code**: Use `waitFor` and `async/await` for testing async behavior
