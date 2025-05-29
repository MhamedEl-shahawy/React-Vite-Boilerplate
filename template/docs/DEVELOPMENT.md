# Development Architecture

## Overview

The development architecture provides a comprehensive developer experience with modern tooling, automated workflows, and quality assurance mechanisms. It emphasizes productivity, code quality, and maintainability.

## 🔧 Development Workflow

### Development Process Flow

```
Feature Branch → Development → Testing → Code Review → Main Branch
      ↓              ↓           ↓           ↓            ↓
   Local Dev → Unit Tests → E2E Tests → PR Review → Deployment
```

### Branch Strategy

#### Git Flow
```bash
# Feature development
git checkout -b feature/user-management
git commit -m "feat: add user profile component"
git push origin feature/user-management

# Create pull request
# Code review and approval
# Merge to main
```

#### Commit Convention
```bash
# Conventional commits
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 🛠️ Development Tools

### Build System (Vite)

#### Configuration
```typescript
// vite.config.ts
export default defineConfig({
  base: './',
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testing/setup-tests.ts',
  },
});
```

#### Development Features
- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **Fast Builds**: Lightning-fast development builds
- **TypeScript Support**: Built-in TypeScript compilation
- **Path Mapping**: Clean import paths with @ alias

### TypeScript Configuration

#### Strict Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Type Safety Benefits
- **Compile-time Error Detection**: Catch errors before runtime
- **IntelliSense**: Enhanced IDE support
- **Refactoring Safety**: Confident code refactoring
- **API Contract Enforcement**: Type-safe API interactions

## 📋 Code Quality

### ESLint Configuration

```javascript
// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'check-file',
    'testing-library',
    'jest-dom',
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{ts,tsx}': 'KEBAB_CASE',
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      },
    ],
  },
};
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Git Hooks (Husky)

```json
// package.json
{
  "lint-staged": {
    "*.+(ts|tsx)": [
      "yarn lint",
      "bash -c 'yarn check-types'"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## 🎨 Component Development

### Component Generation (Plop)

#### Generator Configuration
```javascript
// plopfile.cjs
module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['ui', 'feature', 'layout'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{type}}/{{kebabCase name}}/{{kebabCase name}}.tsx',
        templateFile: 'generators/component/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{kebabCase name}}/index.ts',
        templateFile: 'generators/component/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{kebabCase name}}/{{kebabCase name}}.stories.tsx',
        templateFile: 'generators/component/component.stories.tsx.hbs',
      },
    ],
  });
};
```

#### Component Template
```typescript
// generators/component/component.tsx.hbs
import * as React from 'react';

export interface {{pascalCase name}}Props {
  children?: React.ReactNode;
}

export const {{pascalCase name}} = ({ children }: {{pascalCase name}}Props) => {
  return (
    <div>
      {children}
    </div>
  );
};
```

### Storybook Integration

#### Configuration
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

#### Component Stories
```typescript
// src/components/ui/button/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    isLoading: true,
  },
};
```

## 🧪 Testing Infrastructure

### Unit Testing (Vitest)

#### Test Configuration
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
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
    },
  },
});
```

#### Test Utilities
```typescript
// src/testing/test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### E2E Testing (Playwright)

#### Configuration
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
    trace: 'on-first-retry',
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

## 🔄 Development Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build --base=/",
    "preview": "vite preview",
    "test": "vitest",
    "test-e2e": "pm2 start \"yarn run-mock-server\" --name server && yarn playwright test",
    "prepare": "husky",
    "lint": "eslint src --ignore-path .gitignore",
    "check-types": "tsc --project tsconfig.json --pretty --noEmit",
    "generate": "plop",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "run-mock-server": "vite-node mock-server.ts | pino-pretty -c"
  }
}
```

### Development Commands

```bash
# Start development server
yarn dev

# Run tests in watch mode
yarn test

# Run type checking
yarn check-types

# Generate new component
yarn generate

# Start Storybook
yarn storybook

# Run E2E tests
yarn test-e2e

# Build for production
yarn build
```

## 🔍 Debugging Tools

### React DevTools Integration

```typescript
// src/app/provider.tsx
export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools />}
      {children}
    </QueryClientProvider>
  );
};
```

### Development Logging

```typescript
// Development-only logging
const useDevLogger = (componentName: string) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`${componentName} mounted`);
      return () => console.log(`${componentName} unmounted`);
    }
  }, [componentName]);
};
```

## 📊 Development Metrics

### Bundle Analysis

```bash
# Analyze bundle size
npx vite-bundle-analyzer

# Check for duplicate dependencies
npx depcheck

# Audit dependencies
yarn audit
```

### Performance Monitoring

```typescript
// Development performance monitoring
if (import.meta.env.DEV) {
  // Monitor component render times
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });

  observer.observe({ entryTypes: ['measure'] });
}
```

## 🔧 IDE Configuration

### VS Code Settings

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Recommended Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright"
  ]
}
```

---

This development architecture provides a comprehensive, efficient, and enjoyable developer experience with modern tooling and best practices.
