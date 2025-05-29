#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const templateDir = path.join(rootDir, 'template');

// Files and directories to exclude from the template
const excludePatterns = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  '.DS_Store',
  'Thumbs.db',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  'lerna-debug.log',
  'coverage',
  '.nyc_output',
  'playwright-report',
  'test-results',
  'storybook-static',
  '.storybook/manager-head.html',
  'bin',
  'scripts',
  'template',
];

// Files to process and update for template
const filesToProcess = ['package.json', 'README.md', '.gitignore'];

function shouldExclude(filePath, basePath) {
  const relativePath = path.relative(basePath, filePath);

  return excludePatterns.some((pattern) => {
    if (pattern.includes('*')) {
      // Handle glob patterns
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(relativePath);
    }

    // Handle exact matches and directory matches
    return (
      relativePath === pattern ||
      relativePath.startsWith(pattern + '/') ||
      path.basename(filePath) === pattern
    );
  });
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (shouldExclude(srcPath, rootDir)) {
      console.log(`Excluding: ${path.relative(rootDir, srcPath)}`);
      continue;
    }

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${path.relative(rootDir, srcPath)}`);
    }
  }
}

function processTemplateFiles() {
  // Process package.json
  const packageJsonPath = path.join(templateDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Remove CLI-specific fields
    delete packageJson.bin;
    delete packageJson.files;

    // Reset name and version for template
    packageJson.name = 'my-react-app';
    packageJson.version = '0.1.0';
    packageJson.private = true;

    // Remove CLI dependencies
    if (packageJson.devDependencies) {
      delete packageJson.devDependencies.chalk;
      delete packageJson.devDependencies.commander;
      delete packageJson.devDependencies['fs-extra'];
      delete packageJson.devDependencies.inquirer;
      delete packageJson.devDependencies.ora;
    }

    // Remove CLI scripts
    if (packageJson.scripts) {
      delete packageJson.scripts.prepublishOnly;
      delete packageJson.scripts['build-template'];
      delete packageJson.scripts['test-cli'];
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Processed: package.json');
  }

  // Create template-specific .gitignore
  const gitignorePath = path.join(templateDir, '.gitignore');
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/
playwright-report/
test-results/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Storybook
storybook-static/

# MSW
public/mockServiceWorker.js

# Husky
.husky/_/
`;

  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('Created: .gitignore');

  // Create template README
  const readmePath = path.join(templateDir, 'README.md');
  const readmeContent = `# {{PROJECT_NAME}}

A modern, production-ready React application built with the React Vite Boilerplate.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm/yarn/pnpm** (latest version)

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run generate\` - Generate new components

### Testing
- \`npm run test\` - Run unit tests
- \`npm run test-e2e\` - Run E2E tests
- \`npm run storybook\` - Start Storybook

### Code Quality
- \`npm run lint\` - Run ESLint
- \`npm run check-types\` - Type checking

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

\`\`\`
src/
├── app/                    # App configuration and routing
├── components/             # Reusable UI components
├── features/              # Feature-based modules
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── testing/               # Testing utilities
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log('Created: README.md');
}

async function buildTemplate() {
  console.log('🏗️  Building template...\n');

  // Remove existing template directory
  if (fs.existsSync(templateDir)) {
    fs.removeSync(templateDir);
    console.log('Removed existing template directory');
  }

  // Copy all files except excluded ones
  console.log('\n📁 Copying files...');
  copyDirectory(rootDir, templateDir);

  // Process template-specific files
  console.log('\n⚙️  Processing template files...');
  processTemplateFiles();

  console.log('\n✅ Template built successfully!');
  console.log(
    `📦 Template location: ${path.relative(process.cwd(), templateDir)}`,
  );
}

buildTemplate().catch((error) => {
  console.error('❌ Error building template:', error);
  process.exit(1);
});
