#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const testProjectName = 'test-cli-project';
const testProjectPath = path.join(rootDir, testProjectName);

async function testCLI() {
  console.log('🧪 Testing CLI...\n');

  try {
    // Clean up any existing test project
    if (fs.existsSync(testProjectPath)) {
      console.log('🧹 Cleaning up existing test project...');
      fs.removeSync(testProjectPath);
    }

    // Build template first
    console.log('🏗️  Building template...');
    execSync('npm run build-template', { 
      cwd: rootDir, 
      stdio: 'inherit' 
    });

    // Test CLI with minimal options
    console.log('🚀 Testing CLI with minimal options...');
    execSync(`node bin/cli.js ${testProjectName} --skip-install --skip-git`, {
      cwd: rootDir,
      stdio: 'inherit',
      input: '\n\n\n\n', // Answer prompts with defaults
    });

    // Verify project was created
    if (!fs.existsSync(testProjectPath)) {
      throw new Error('Test project was not created');
    }

    console.log('✅ Project created successfully');

    // Verify essential files exist
    const essentialFiles = [
      'package.json',
      'src/main.tsx',
      'src/app/app.tsx',
      'index.html',
      'vite.config.ts',
      'tailwind.config.cjs',
      '.env.example',
      'docs/README.md',
    ];

    console.log('🔍 Verifying essential files...');
    for (const file of essentialFiles) {
      const filePath = path.join(testProjectPath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Essential file missing: ${file}`);
      }
      console.log(`  ✓ ${file}`);
    }

    // Verify package.json was updated
    const packageJsonPath = path.join(testProjectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.name !== testProjectName) {
      throw new Error(`Package name not updated. Expected: ${testProjectName}, Got: ${packageJson.name}`);
    }
    console.log(`  ✓ package.json name updated to: ${packageJson.name}`);

    // Verify CLI-specific fields were removed
    if (packageJson.bin || packageJson.files) {
      throw new Error('CLI-specific fields not removed from package.json');
    }
    console.log('  ✓ CLI-specific fields removed');

    // Test installation (optional, can be slow)
    if (process.env.TEST_INSTALL === 'true') {
      console.log('📦 Testing dependency installation...');
      execSync('npm install', {
        cwd: testProjectPath,
        stdio: 'inherit',
      });
      console.log('✅ Dependencies installed successfully');

      // Test build
      console.log('🏗️  Testing build...');
      execSync('npm run build', {
        cwd: testProjectPath,
        stdio: 'inherit',
      });
      console.log('✅ Build completed successfully');
    }

    console.log('\n🎉 CLI test completed successfully!');
    console.log(`📁 Test project created at: ${testProjectPath}`);
    console.log('\n💡 To test manually:');
    console.log(`   cd ${testProjectName}`);
    console.log('   npm install');
    console.log('   npm run dev');

  } catch (error) {
    console.error('\n❌ CLI test failed:', error.message);
    process.exit(1);
  }
}

// Clean up function
function cleanup() {
  if (fs.existsSync(testProjectPath)) {
    console.log('\n🧹 Cleaning up test project...');
    fs.removeSync(testProjectPath);
    console.log('✅ Cleanup completed');
  }
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Run test
testCLI().catch(error => {
  console.error('❌ Test failed:', error);
  cleanup();
  process.exit(1);
});
