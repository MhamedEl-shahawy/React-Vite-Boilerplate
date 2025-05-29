# Testing Architecture

## Overview

The testing architecture implements a comprehensive testing strategy with multiple layers of testing, ensuring code quality, reliability, and maintainability. It follows the testing pyramid principle with unit tests, integration tests, and end-to-end tests.

## 🏗️ Testing Strategy

### Testing Pyramid

```
        E2E Tests (Playwright)
             ↑
      Integration Tests (MSW)
             ↑
       Unit Tests (Vitest)
```

### Testing Layers

#### 1. Unit Tests (70%)
- **Component Testing**: Individual component behavior
- **Hook Testing**: Custom hook functionality
- **Utility Testing**: Pure function testing
- **Service Testing**: API service functions

#### 2. Integration Tests (20%)
- **Feature Testing**: Complete feature workflows
- **API Integration**: Mock API interactions
- **State Management**: Complex state scenarios
- **User Interactions**: Multi-component interactions

#### 3. E2E Tests (10%)
- **Critical Paths**: Essential user journeys
- **Authentication Flows**: Login/logout scenarios
- **Cross-Browser**: Browser compatibility
- **Performance**: Load time and responsiveness

## 🧪 Unit Testing (Vitest)

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testing/setup-tests.ts',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      include: ['src/**'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        'src/testing/**',
        'src/main.tsx',
      ],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### Test Setup

```typescript
// src/testing/setup-tests.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Component Testing

```typescript
// src/components/ui/button/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

### Hook Testing

```typescript
// src/hooks/__tests__/use-disclosure.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from '../use-disclosure';

describe('useDisclosure', () => {
  it('initializes with default closed state', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('initializes with custom default state', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('opens and closes correctly', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles state correctly', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
```

### API Testing

```typescript
// src/features/auth/api/__tests__/login.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/testing/test-utils';
import { useLogin } from '../login';

describe('useLogin', () => {
  it('successfully logs in user', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
      })
    );
  });

  it('handles login errors', async () => {
    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
```

## 🔗 Integration Testing (MSW)

### Mock Service Worker Setup

```typescript
// src/testing/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

### Mock Handlers

```typescript
// src/testing/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';

export const authHandlers = [
  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
        },
        jwt: 'mock-jwt-token',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  http.get(`${env.API_URL}/auth/me`, () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
    });
  }),

  http.post(`${env.API_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),
];
```

### Feature Integration Testing

```typescript
// src/features/auth/components/__tests__/login-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '@/testing/test-utils';
import { LoginForm } from '../login-form';

describe('LoginForm', () => {
  it('successfully logs in user', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.type(screen.getByLabelText(/email/i), 'invalid@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

## 🎭 E2E Testing (Playwright)

### Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'yarn dev --port 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Authentication Setup

```typescript
// e2e/tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/login');
  
  await page.fill('[name="email"]', 'admin@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/app');
  
  await page.context().storageState({ path: authFile });
});
```

### E2E Test Examples

```typescript
// e2e/tests/discussions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Discussions', () => {
  test('should create a new discussion', async ({ page }) => {
    await page.goto('/app/discussions');
    
    await page.click('text=Create Discussion');
    await page.fill('[name="title"]', 'Test Discussion');
    await page.fill('[name="body"]', 'This is a test discussion');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Test Discussion')).toBeVisible();
  });

  test('should edit existing discussion', async ({ page }) => {
    await page.goto('/app/discussions');
    
    await page.click('text=Test Discussion');
    await page.click('text=Edit');
    await page.fill('[name="title"]', 'Updated Discussion');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Updated Discussion')).toBeVisible();
  });

  test('should delete discussion', async ({ page }) => {
    await page.goto('/app/discussions');
    
    await page.click('text=Updated Discussion');
    await page.click('text=Delete');
    await page.click('text=Confirm');

    await expect(page.locator('text=Updated Discussion')).not.toBeVisible();
  });
});
```

### Visual Testing

```typescript
// e2e/tests/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('landing page screenshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('landing-page.png');
  });

  test('dashboard screenshot', async ({ page }) => {
    await page.goto('/app');
    await expect(page).toHaveScreenshot('dashboard.png');
  });
});
```

## 📊 Test Utilities

### Custom Test Utilities

```typescript
// src/testing/test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  user?: User;
}

export const createWrapper = ({ initialEntries = ['/'], user }: CustomRenderOptions = {}) => {
  return ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();

    if (user) {
      queryClient.setQueryData(['user'], user);
    }

    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    );
  };
};

export const renderApp = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: createWrapper(options),
    ...options,
  });
};

export * from '@testing-library/react';
export { renderApp as render };
```

### Data Generators

```typescript
// src/testing/data-generators.ts
import { faker } from '@faker-js/faker';

export const createUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: 'USER',
  teamId: faker.string.uuid(),
  ...overrides,
});

export const createDiscussion = (overrides: Partial<Discussion> = {}): Discussion => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraphs(),
  author: createUser(),
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: faker.string.uuid(),
  body: faker.lorem.paragraph(),
  author: createUser(),
  discussionId: faker.string.uuid(),
  createdAt: faker.date.recent().toISOString(),
  ...overrides,
});
```

## 📈 Testing Best Practices

### Test Organization

```typescript
// Group related tests
describe('UserProfile', () => {
  describe('when user is authenticated', () => {
    it('should display user information', () => {});
    it('should allow editing profile', () => {});
  });

  describe('when user is not authenticated', () => {
    it('should redirect to login', () => {});
  });
});
```

### Test Naming

```typescript
// Use descriptive test names
it('should display error message when login fails with invalid credentials', () => {});
it('should disable submit button when form is invalid', () => {});
it('should redirect to dashboard after successful login', () => {});
```

### Async Testing

```typescript
// Proper async testing
test('should load user data', async () => {
  render(<UserProfile />);
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  // Assert final state
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

---

This testing architecture ensures comprehensive coverage, reliable tests, and confidence in code quality across all layers of the application.
