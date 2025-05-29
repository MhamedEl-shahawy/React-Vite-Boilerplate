#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Package info
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);

program
  .name('create-react-vite-boilerplate')
  .description('Create a new React Vite Boilerplate project')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (default: full)', 'full')
  .option('-p, --package-manager <pm>', 'Package manager to use (npm, yarn, pnpm)', 'npm')
  .option('--skip-install', 'Skip installing dependencies')
  .option('--skip-git', 'Skip git initialization')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error.message);
      process.exit(1);
    }
  });

async function createProject(projectName, options) {
  // Get project name if not provided
  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-react-app',
        validate: (input) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
    ]);
    projectName = answers.projectName;
  }

  // Get additional options if not provided
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager would you like to use?',
      choices: ['npm', 'yarn', 'pnpm'],
      default: options.packageManager,
      when: !options.packageManager,
    },
    {
      type: 'confirm',
      name: 'installDependencies',
      message: 'Install dependencies?',
      default: true,
      when: !options.skipInstall,
    },
    {
      type: 'confirm',
      name: 'initializeGit',
      message: 'Initialize git repository?',
      default: true,
      when: !options.skipGit,
    },
    {
      type: 'confirm',
      name: 'setupEnvironment',
      message: 'Set up environment variables?',
      default: true,
    },
  ]);

  const config = {
    projectName,
    packageManager: options.packageManager || answers.packageManager || 'npm',
    installDependencies: !options.skipInstall && (answers.installDependencies !== false),
    initializeGit: !options.skipGit && (answers.initializeGit !== false),
    setupEnvironment: answers.setupEnvironment !== false,
    template: options.template,
  };

  console.log(chalk.blue('\n🚀 Creating your React Vite Boilerplate project...\n'));

  const projectPath = path.resolve(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${projectName} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Project creation cancelled.'));
      return;
    }

    fs.removeSync(projectPath);
  }

  // Copy template files
  const spinner = ora('Copying template files...').start();
  try {
    const templatePath = path.join(__dirname, '..', 'template');
    fs.copySync(templatePath, projectPath);
    spinner.succeed('Template files copied');
  } catch (error) {
    spinner.fail('Failed to copy template files');
    throw error;
  }

  // Update package.json with project name
  const projectPackageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(projectPackageJsonPath)) {
    const projectPackageJson = JSON.parse(fs.readFileSync(projectPackageJsonPath, 'utf8'));
    projectPackageJson.name = projectName;
    fs.writeFileSync(projectPackageJsonPath, JSON.stringify(projectPackageJson, null, 2));
  }

  // Set up environment variables
  if (config.setupEnvironment) {
    const envSpinner = ora('Setting up environment variables...').start();
    try {
      const envExamplePath = path.join(projectPath, '.env.example');
      const envPath = path.join(projectPath, '.env');
      
      if (fs.existsSync(envExamplePath)) {
        fs.copySync(envExamplePath, envPath);
      }
      envSpinner.succeed('Environment variables set up');
    } catch (error) {
      envSpinner.warn('Could not set up environment variables');
    }
  }

  // Initialize git repository
  if (config.initializeGit) {
    const gitSpinner = ora('Initializing git repository...').start();
    try {
      process.chdir(projectPath);
      execSync('git init', { stdio: 'ignore' });
      execSync('git add .', { stdio: 'ignore' });
      execSync('git commit -m "Initial commit from React Vite Boilerplate"', { stdio: 'ignore' });
      gitSpinner.succeed('Git repository initialized');
    } catch (error) {
      gitSpinner.warn('Could not initialize git repository');
    }
  }

  // Install dependencies
  if (config.installDependencies) {
    const installSpinner = ora(`Installing dependencies with ${config.packageManager}...`).start();
    try {
      process.chdir(projectPath);
      
      const installCommand = {
        npm: 'npm install',
        yarn: 'yarn install',
        pnpm: 'pnpm install',
      }[config.packageManager];

      execSync(installCommand, { stdio: 'ignore' });
      installSpinner.succeed('Dependencies installed');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      console.log(chalk.yellow(`\nYou can install dependencies manually by running:`));
      console.log(chalk.cyan(`cd ${projectName} && ${config.packageManager} install`));
    }
  }

  // Success message
  console.log(chalk.green('\n✅ Project created successfully!\n'));
  
  console.log(chalk.bold('Next steps:'));
  console.log(chalk.cyan(`  cd ${projectName}`));
  
  if (!config.installDependencies) {
    console.log(chalk.cyan(`  ${config.packageManager} install`));
  }
  
  console.log(chalk.cyan(`  ${config.packageManager} dev`));
  
  console.log(chalk.bold('\nAvailable scripts:'));
  console.log(chalk.cyan(`  ${config.packageManager} dev          # Start development server`));
  console.log(chalk.cyan(`  ${config.packageManager} build        # Build for production`));
  console.log(chalk.cyan(`  ${config.packageManager} test         # Run unit tests`));
  console.log(chalk.cyan(`  ${config.packageManager} test-e2e     # Run E2E tests`));
  console.log(chalk.cyan(`  ${config.packageManager} storybook    # Start Storybook`));
  console.log(chalk.cyan(`  ${config.packageManager} generate     # Generate components`));
  
  console.log(chalk.bold('\nDocumentation:'));
  console.log(chalk.cyan(`  📚 Architecture docs: docs/README.md`));
  console.log(chalk.cyan(`  🔐 Security guide: docs/SECURITY.md`));
  console.log(chalk.cyan(`  🚀 Deployment guide: docs/DEPLOYMENT.md`));
  
  console.log(chalk.bold('\nFeatures included:'));
  console.log(chalk.green('  ✓ React 18 + TypeScript + Vite'));
  console.log(chalk.green('  ✓ Authentication & Authorization'));
  console.log(chalk.green('  ✓ TailwindCSS + Radix UI'));
  console.log(chalk.green('  ✓ TanStack Query + Zustand'));
  console.log(chalk.green('  ✓ Testing (Vitest + Playwright)'));
  console.log(chalk.green('  ✓ Storybook + Component Generation'));
  console.log(chalk.green('  ✓ ESLint + Prettier + Husky'));
  console.log(chalk.green('  ✓ Comprehensive Documentation'));
  
  console.log(chalk.blue('\n🎉 Happy coding!\n'));
}

program.parse();
