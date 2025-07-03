# Testing Guide

This document provides information about the testing setup and how to run tests for the h8x-app project.

## Test Structure

The testing suite includes three types of tests:

### 1. Unit Tests (Jest + React Testing Library)

- **Location**: `src/__tests__/components/`, `src/__tests__/utils/`
- **Purpose**: Test individual components and utility functions
- **Framework**: Jest with React Testing Library
- **Files**: `*.test.tsx` or `*.test.ts`

### 2. Integration Tests (Jest + Prisma Mocks)

- **Location**: `src/__tests__/actions/`
- **Purpose**: Test server actions and API routes
- **Framework**: Jest with Prisma mocks
- **Files**: `*.test.ts`

### 3. End-to-End Tests (Playwright)

- **Location**: `tests/e2e/`
- **Purpose**: Test complete user workflows
- **Framework**: Playwright
- **Files**: `*.spec.ts`

## Running Tests

### Unit and Integration Tests

```bash
# Run all Jest tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests

```bash
# Run all Playwright tests (headless)
npm run test:e2e

# Run Playwright tests with browser UI
npm run test:e2e:headed

# Run Playwright tests with interactive UI
npm run test:e2e:ui
```

### Run All Tests

```bash
# Run all tests (unit, integration, and e2e)
npm run test:all

# Run all tests with coverage (for CI)
npm run test:ci
```

## Test Configuration

### Jest Configuration

- **File**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Key features**:
  - TypeScript support
  - React Testing Library setup
  - Next.js integration
  - Module path mapping
  - Coverage reporting
  - Mocking for Next.js router and navigation

### Playwright Configuration

- **File**: `playwright.config.ts`
- **Key features**:
  - Multi-browser testing (Chromium, Firefox, WebKit)
  - Mobile device testing
  - Automatic dev server startup
  - Screenshots and videos on failure
  - Trace collection for debugging

## Test Utilities

### Database Testing

- **File**: `src/__tests__/utils/db-setup.ts`
- **Purpose**: Mock Prisma client and provide test data factories
- **Usage**: Import `prismaMock` and `dbTestUtils` for database testing

### Authentication Testing

- **File**: `src/__tests__/utils/auth-utils.ts`
- **Purpose**: Mock authentication and provide test session data
- **Usage**: Import `authTestUtils` for authentication testing

### React Testing

- **File**: `src/__tests__/utils/test-utils.tsx`
- **Purpose**: Custom render function with providers
- **Usage**: Import `render` and other utilities for component testing

## Writing Tests

### Unit Test Example

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MyComponent from "@/components/MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { prismaMock } from "../utils/db-setup";
import { myAction } from "@/app/actions";

describe("myAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a record", async () => {
    const mockData = { id: "test-id", name: "Test" };
    prismaMock.myModel.create.mockResolvedValue(mockData);

    const result = await myAction(mockData);

    expect(result).toEqual(mockData);
    expect(prismaMock.myModel.create).toHaveBeenCalledWith({
      data: mockData,
    });
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from "@playwright/test";

test.describe("User Flow", () => {
  test("should complete user registration", async ({ page }) => {
    await page.goto("/register");

    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
  });
});
```

## Environment Setup

### Test Environment Variables

Create a `.env.test` file with test-specific environment variables:

```env
NODE_ENV=test
DATABASE_URL="postgresql://username:password@localhost:5432/test_db"
BETTER_AUTH_SECRET=test-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup for Testing

The tests use Prisma mocks by default, but for integration testing with a real database:

1. Set up a test database
2. Configure the `DATABASE_URL` in `.env.test`
3. Run migrations: `npx prisma migrate dev`

## Continuous Integration

The test suite is configured to run in CI environments:

- **Unit/Integration Tests**: Run with coverage reporting
- **E2E Tests**: Run against production build
- **Artifacts**: Screenshots, videos, and coverage reports are saved

## Debugging Tests

### Jest Tests

- Use `console.log()` for debugging
- Use `screen.debug()` to see rendered HTML
- Use `--verbose` flag for detailed output

### Playwright Tests

- Use `await page.screenshot()` for visual debugging
- Use `await page.pause()` to pause execution
- Use the Playwright Inspector with `--debug` flag

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach` and `afterEach` for setup/teardown
3. **Mocking**: Mock external dependencies and API calls
4. **Assertions**: Use descriptive expect statements
5. **Coverage**: Aim for >80% code coverage
6. **Performance**: Keep tests fast and focused

## Common Issues

### Module Resolution

If you encounter import issues, check:

- Jest `moduleNameMapper` in `jest.config.js`
- TypeScript path mapping in `tsconfig.json`

### Authentication in Tests

- Use `authTestUtils` for mocking authentication
- Mock the `useSession` hook for component tests

### Database Mocking

- Use `prismaMock` for database operations
- Reset mocks between tests with `mockReset()`

## Adding New Tests

1. **Components**: Add tests in `src/__tests__/components/`
2. **Actions**: Add tests in `src/__tests__/actions/`
3. **E2E**: Add tests in `tests/e2e/`
4. **Follow naming convention**: `*.test.ts` or `*.spec.ts`
5. **Update this README** if adding new test patterns or utilities
