# {{PROJECT_NAME}}

A modern, production-ready React application built with the React Vite Boilerplate.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm/yarn/pnpm** (latest version)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate` - Generate new components

### Testing
- `npm run test` - Run unit tests
- `npm run test-e2e` - Run E2E tests
- `npm run storybook` - Start Storybook

### Code Quality
- `npm run lint` - Run ESLint
- `npm run check-types` - Type checking

## 📚 Documentation

- **[Architecture Documentation](./docs/README.md)** - Comprehensive architecture guide
- **[Security Guide](./docs/SECURITY.md)** - Security implementation details
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow and tools
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Build and deployment strategies

## ✨ Features

- 🚀 **React 18** with TypeScript and Vite
- 🔐 **Authentication** with JWT and role-based access control
- 🎨 **TailwindCSS** with Radix UI components
- 📊 **TanStack Query** for server state management
- 🧪 **Comprehensive Testing** with Vitest and Playwright
- 📚 **Storybook** for component development
- 🔧 **Developer Tools** with ESLint, Prettier, and Husky

## 🏗️ Project Structure

```
src/
├── app/                    # App configuration and routing
├── components/             # Reusable UI components
├── features/              # Feature-based modules
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── testing/               # Testing utilities
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
