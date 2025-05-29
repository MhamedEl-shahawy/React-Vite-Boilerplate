# React Vite Boilerplate

A modern, production-ready React application boilerplate built with Vite, TypeScript, and enterprise-grade features. This boilerplate provides a solid foundation for building scalable web applications with authentication, role-based access control, and a comprehensive discussion system.

## ✨ Features

- 🚀 **Modern Stack**: React 18, Vite, TypeScript
- 🎨 **Styling**: TailwindCSS with custom design system
- 🔐 **Authentication**: Complete auth system with JWT
- 👥 **User Management**: Role-based access control (Admin/User)
- 💬 **Discussion System**: Create, edit, delete discussions and comments
- 🏢 **Team Management**: Multi-tenant team support
- 📱 **Responsive Design**: Mobile-first approach
- 🧪 **Testing**: Unit tests (Vitest) + E2E tests (Playwright)
- 📚 **Storybook**: Component documentation and development
- 🔧 **Developer Experience**: ESLint, Prettier, Husky, TypeScript
- 🎯 **Code Generation**: Automated component generation with Plop
- 🌐 **Mock API**: MSW-powered mock server for development

## 🛠️ Tech Stack

### Core

- **React 18** - UI library with latest features
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and better DX
- **React Router 7** - Client-side routing

### State Management & Data Fetching

- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling with validation

### Styling & UI

- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants

### Development & Testing

- **Vitest** - Unit testing framework
- **Playwright** - E2E testing
- **Storybook** - Component development
- **MSW** - API mocking
- **ESLint & Prettier** - Code quality
- **Husky** - Git hooks

## 🚀 Getting Started

### Quick Start (Recommended)

Create a new project using our npm package:

```bash
# Using npm (recommended)
npm create react-vite-boilerplate my-app

# Using yarn
yarn create react-vite-boilerplate my-app

# Using pnpm
pnpm create react-vite-boilerplate my-app

# Direct usage with npx
npx create-react-vite-boilerplate my-app
```

Then navigate to your project:

```bash
cd my-app
npm install  # if not automatically installed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

### Manual Installation

If you prefer to clone the repository directly:

#### Prerequisites

- **Node.js** 20+
- **Yarn** 1.22+

#### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/MhamedEl-shahawy/React-Vite-Boilerplate.git
   cd React-Vite-Boilerplate
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn generate` - Generate new components with Plop

### Testing

- `yarn test` - Run unit tests
- `yarn test-e2e` - Run E2E tests
- `yarn storybook` - Start Storybook dev server
- `yarn build-storybook` - Build Storybook

### Code Quality

- `yarn lint` - Run ESLint
- `yarn check-types` - Type checking with TypeScript

### Mock Server

- `yarn run-mock-server` - Start standalone mock API server

## � Documentation

This project includes comprehensive architecture documentation organized into focused sections:

### 🎯 **Quick Start Documentation**

- **[Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)** - High-level architecture principles and patterns
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow, tools, and setup
- **[Security Implementation](./docs/SECURITY.md)** - Authentication, authorization, and security measures

### 📖 **Complete Documentation**

For comprehensive architecture documentation, visit **[docs/README.md](./docs/README.md)** which provides:

- **Core Architecture**: Application layers, data flow, and design patterns
- **Technical Implementation**: Network layer, security, and performance optimization
- **Development & Operations**: Testing strategies, deployment, and CI/CD
- **Planning & Decisions**: Scalability considerations and architecture decisions (ADRs)

### 🔍 **Documentation Highlights**

- **Feature-Based Architecture** - Modular, scalable code organization
- **Security-First Design** - Multi-layer security implementation
- **Performance Optimized** - Advanced caching and code splitting
- **Comprehensive Testing** - Unit, integration, and E2E testing strategies
- **Deployment Ready** - Multiple deployment options and CI/CD pipelines

## �📁 Project Structure

```
src/
├── app/                    # App configuration and routing
│   ├── routes/            # Route components
│   ├── provider.tsx       # App providers setup
│   └── router.tsx         # Router configuration
├── components/            # Reusable UI components
│   ├── errors/           # Error boundary components
│   ├── layouts/          # Layout components
│   ├── seo/              # SEO components
│   └── ui/               # Design system components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── comments/         # Comments feature
│   ├── discussions/      # Discussions feature
│   ├── teams/            # Teams feature
│   └── users/            # User management feature
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api-client.ts     # API client configuration
│   ├── auth.tsx          # Authentication logic
│   ├── authorization.tsx # Authorization utilities
│   └── react-query.ts    # React Query configuration
├── testing/              # Testing utilities and mocks
│   ├── mocks/            # MSW mock handlers
│   ├── data-generators.ts # Test data generators
│   └── test-utils.tsx    # Testing utilities
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── config/               # Configuration files
```

## 🎯 Key Features Overview

### Authentication System

- **JWT-based authentication** with secure token handling
- **Role-based access control** (Admin/User roles)
- **Protected routes** with automatic redirects
- **Registration with team support** (join existing or create new)
- **Persistent sessions** with automatic token refresh

### Discussion System

- **Create, read, update, delete discussions** (Admin only)
- **Threaded comments** on discussions
- **Markdown support** for rich text content
- **Real-time updates** with optimistic UI
- **Permission-based actions** based on user roles

### User Management

- **User profiles** with editable information
- **User listing** with search and filtering
- **Role management** and permissions
- **Team-based organization**

### UI Components

- **Design system** built with Radix UI primitives
- **Accessible components** following WCAG guidelines
- **Consistent styling** with TailwindCSS
- **Interactive components** with proper states
- **Form components** with validation support

## 🧪 Testing Strategy

### Unit Testing (Vitest)

- **Component testing** with React Testing Library
- **Hook testing** for custom hooks
- **Utility function testing**
- **Mock implementations** for external dependencies
- **Coverage reporting** for code quality metrics

### E2E Testing (Playwright)

- **User flow testing** across different browsers
- **Authentication flows** testing
- **Critical path testing** for main features
- **Visual regression testing** capabilities
- **CI/CD integration** ready

### Component Testing (Storybook)

- **Component documentation** with interactive examples
- **Visual testing** for UI components
- **Accessibility testing** with a11y addon
- **Design system showcase**

## 🔧 Development Tools

### Code Quality

- **ESLint** - Comprehensive linting rules for React and TypeScript
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for pre-commit validation
- **lint-staged** - Run linters on staged files only

### Type Safety

- **TypeScript** - Full type coverage across the application
- **Zod** - Runtime type validation for forms and API responses
- **Type-safe routing** - Strongly typed route parameters and queries

### Developer Experience

- **Vite** - Lightning-fast HMR and build times
- **Path mapping** - Clean imports with @ alias
- **Component generation** - Automated scaffolding with Plop
- **VS Code integration** - Optimized settings and extensions

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_APP_URL=http://localhost:3000
VITE_APP_MOCK_API_PORT=8080

# Feature Flags
VITE_ENABLE_API_MOCKING=true
```

### Static Deployment

The application can be deployed to any static hosting service:

- **Netlify** - Continuous deployment from Git
- **GitHub Pages** - Free hosting for public repositories
- **AWS S3 + CloudFront** - Scalable cloud deployment

## 🎨 Component Generation

Generate new components with consistent structure:

```bash
yarn generate
```

This will prompt you to:

1. Choose component type (UI component, feature component, etc.)
2. Enter component name
3. Select additional options (stories, tests, etc.)

Generated components include:

- TypeScript component file
- Storybook stories
- Unit tests
- Index file for clean exports

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Architecture Principles

- **Feature-based organization** - Group related files together
- **Separation of concerns** - Keep business logic separate from UI
- **Composition over inheritance** - Prefer composable components
- **Type safety** - Leverage TypeScript for better DX
- **Performance** - Optimize for bundle size and runtime performance

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

**Built with ❤️ by [Mohamed Shahawy](https://github.com/MhamedEl-shahawy)**
