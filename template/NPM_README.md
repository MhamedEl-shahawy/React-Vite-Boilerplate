# Create React Vite Boilerplate

A modern, production-ready React application boilerplate built with Vite, TypeScript, and enterprise-grade features. Get started with a fully-configured React app in seconds.

## 🚀 Quick Start

Create a new React project with one command:

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

Then navigate to your project and start developing:

```bash
cd my-app
npm install  # if not automatically installed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app running!

## ✨ What's Included

### 🏗️ **Modern Foundation**
- **React 18** - Latest React with concurrent features
- **TypeScript** - Full type safety and excellent DX
- **Vite** - Lightning-fast development and builds
- **ESM** - Modern JavaScript modules

### 🎨 **Styling & UI**
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Class Variance Authority** - Component variants
- **Lucide React** - Beautiful icons
- **Responsive Design** - Mobile-first approach

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Admin/User permissions
- **Protected Routes** - Route-level security
- **Input Validation** - Zod schemas for type safety
- **XSS Protection** - Content sanitization

### 📊 **State Management**
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Optimistic Updates** - Immediate UI feedback

### 🧪 **Testing & Quality**
- **Vitest** - Fast unit testing
- **Playwright** - Reliable E2E testing
- **React Testing Library** - Component testing
- **MSW** - API mocking for development
- **Storybook** - Component documentation

### 🛠️ **Developer Experience**
- **TypeScript Strict Mode** - Maximum type safety
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates
- **Component Generation** - Automated scaffolding

### 📚 **Documentation**
- **Comprehensive Docs** - Architecture and implementation guides
- **Security Guide** - Security best practices
- **Deployment Guide** - Multiple deployment options
- **Testing Strategy** - Complete testing approach

## 🎯 Features Overview

### Authentication System
- Login/Register with email and password
- JWT token management with HTTP-only cookies
- Role-based permissions (Admin/User)
- Protected routes and components
- Team-based organization

### Discussion Platform
- Create, edit, and delete discussions (Admin only)
- Threaded comments system
- Markdown content support
- Real-time optimistic updates
- User permissions and moderation

### User Management
- User profiles and settings
- Admin user management
- Role assignment and permissions
- Team membership handling

### UI Components
- Complete design system
- Accessible components (WCAG 2.1 AA)
- Dark/light mode support
- Responsive layouts
- Form components with validation

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/                    # App configuration and routing
│   ├── components/             # Reusable UI components
│   │   ├── ui/                # Design system components
│   │   ├── layouts/           # Layout components
│   │   └── errors/            # Error boundaries
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication
│   │   ├── discussions/       # Discussion system
│   │   ├── comments/          # Comments system
│   │   ├── users/             # User management
│   │   └── teams/             # Team management
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Core libraries and utilities
│   ├── testing/               # Testing utilities and mocks
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── docs/                      # Comprehensive documentation
├── e2e/                       # End-to-end tests
├── public/                    # Static assets
└── stories/                   # Storybook stories
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate new components
```

### Testing
```bash
npm run test         # Run unit tests
npm run test-e2e     # Run E2E tests
npm run storybook    # Start Storybook
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run check-types  # TypeScript type checking
```

## 🌐 Deployment

The boilerplate supports multiple deployment options:

- **Vercel** - Zero-config deployment
- **Netlify** - Continuous deployment
- **GitHub Pages** - Free static hosting
- **Docker** - Containerized deployment
- **AWS S3 + CloudFront** - Scalable cloud hosting

See the [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📖 Documentation

Comprehensive documentation is included:

- **[Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)** - System design and principles
- **[Security Guide](./docs/SECURITY.md)** - Security implementation details
- **[Development Guide](./docs/DEVELOPMENT.md)** - Development workflow and tools
- **[Testing Strategy](./docs/TESTING.md)** - Testing approach and examples
- **[Performance Guide](./docs/PERFORMANCE.md)** - Optimization strategies
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deployment options and CI/CD

## 🎨 Customization

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_API_URL=http://localhost:8080/api
VITE_APP_URL=http://localhost:3000
VITE_ENABLE_API_MOCKING=true
```

### Styling

- Customize TailwindCSS in `tailwind.config.cjs`
- Modify design tokens in `src/components/ui/`
- Add custom CSS in `src/index.css`

### Features

- Add new features in `src/features/`
- Generate components with `npm run generate`
- Extend API client in `src/lib/api-client.ts`

## 🤝 Contributing

We welcome contributions.

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📞 Support

- 📖 **Documentation**: Check the comprehensive docs in the `docs/` folder
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/MhamedEl-shahawy/React-Vite-Boilerplate/issues)
- 💬 **Discussions**: Join discussions on [GitHub Discussions](https://github.com/MhamedEl-shahawy/React-Vite-Boilerplate/discussions)
- 📧 **Email**: Contact [Mohamed@thanawi.io](mailto:Mohamed@thanawi.io)

---

**Built with ❤️ by [Mohamed Shahawy](https://github.com/MhamedEl-shahawy)**

Start building amazing React applications today! 🚀
