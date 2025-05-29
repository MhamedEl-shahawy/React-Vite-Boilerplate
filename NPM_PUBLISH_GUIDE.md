# NPM Publication Guide

This guide explains how to publish the React Vite Boilerplate as an npm package that users can install via CLI.

## 📦 Package Overview

The package will be published as `create-react-vite-boilerplate` and can be used with:

```bash
# Using npm
npm create react-vite-boilerplate my-app

# Using yarn
yarn create react-vite-boilerplate my-app

# Using pnpm
pnpm create react-vite-boilerplate my-app

# Direct usage
npx create-react-vite-boilerplate my-app
```

## 🚀 Pre-Publication Setup

### 1. Install CLI Dependencies

```bash
npm install --save-dev chalk commander fs-extra inquirer ora
```

### 2. Build Template

The template is automatically built before publishing:

```bash
npm run build-template
```

This creates a `template/` directory with all necessary files, excluding:
- `node_modules`
- Build artifacts (`dist`, `build`)
- Environment files (`.env`)
- Lock files
- CLI-specific files

### 3. Test CLI Locally

Test the CLI before publishing:

```bash
# Test the CLI
npm run test-cli

# Or test with a real project
node bin/cli.js test-project
cd test-project
npm install
npm run dev
```

## 📋 Publication Steps

### 1. Prepare for Publication

1. **Update version** in `package.json`:
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Ensure all changes are committed**:
   ```bash
   git add .
   git commit -m "feat: prepare for npm publication"
   ```

3. **Build template**:
   ```bash
   npm run build-template
   ```

### 2. NPM Account Setup

1. **Create NPM account** at [npmjs.com](https://www.npmjs.com)

2. **Login to NPM**:
   ```bash
   npm login
   ```

3. **Verify login**:
   ```bash
   npm whoami
   ```

### 3. Check Package Name Availability

```bash
npm view create-react-vite-boilerplate
```

If the package doesn't exist, the name is available.

### 4. Publish Package

#### First Publication

```bash
# Dry run to check what will be published
npm publish --dry-run

# Publish to npm
npm publish
```

#### Subsequent Publications

```bash
# Update version (patch/minor/major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Publish new version
npm publish
```

## 🔧 Package Configuration

### package.json Key Fields

```json
{
  "name": "create-react-vite-boilerplate",
  "version": "1.0.0",
  "description": "A modern, production-ready React application boilerplate",
  "bin": {
    "create-react-vite-boilerplate": "./bin/cli.js"
  },
  "files": [
    "template",
    "bin",
    "README.md"
  ],
  "keywords": [
    "react",
    "vite",
    "typescript",
    "boilerplate",
    "template",
    "starter"
  ],
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Important Fields Explained

- **`bin`**: Defines the CLI command
- **`files`**: Specifies which files to include in the package
- **`keywords`**: Helps with npm search discoverability
- **`engines`**: Specifies required Node.js and npm versions

## 📊 Post-Publication

### 1. Verify Publication

```bash
# Check package info
npm view create-react-vite-boilerplate

# Test installation
npx create-react-vite-boilerplate test-app
```

### 2. Update Documentation

Update the main README.md with installation instructions:

```markdown
## 🚀 Quick Start

Create a new project using npm:

\`\`\`bash
npm create react-vite-boilerplate my-app
cd my-app
npm install
npm run dev
\`\`\`
```

### 3. Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Describe the features and changes

## 🔄 Maintenance

### Version Management

Follow semantic versioning:
- **Patch** (1.0.1): Bug fixes, documentation updates
- **Minor** (1.1.0): New features, non-breaking changes
- **Major** (2.0.0): Breaking changes

### Update Process

1. Make changes to the codebase
2. Update version in `package.json`
3. Run `npm run build-template`
4. Test the CLI locally
5. Commit changes
6. Publish to npm
7. Create GitHub release

### Monitoring

- Monitor npm download statistics
- Check for issues and user feedback
- Keep dependencies updated
- Respond to GitHub issues

## 🛡️ Security Considerations

### Package Security

1. **Enable 2FA** on npm account
2. **Use npm audit** to check for vulnerabilities
3. **Keep dependencies updated**
4. **Review template files** for sensitive information

### Template Security

1. **Exclude sensitive files** from template
2. **Use environment variables** for configuration
3. **Include security documentation**
4. **Regular security audits**

## 📈 Promotion

### Documentation

- Update project README with npm installation
- Create usage examples
- Document all CLI options
- Maintain changelog

### Community

- Share on social media
- Submit to awesome lists
- Write blog posts
- Create video tutorials

## 🐛 Troubleshooting

### Common Issues

1. **Permission errors**: Use `npm login` and verify account
2. **Name conflicts**: Choose a unique package name
3. **File exclusion**: Check `.npmignore` and `files` field
4. **CLI not working**: Verify `bin` field and file permissions

### Debug Commands

```bash
# Check what files will be published
npm pack --dry-run

# Verify package contents
npm pack
tar -tf create-react-vite-boilerplate-1.0.0.tgz

# Test CLI locally
npm link
create-react-vite-boilerplate test-project
```

## 📞 Support

For issues with the npm package:
1. Check existing GitHub issues
2. Create new issue with reproduction steps
3. Include npm version and Node.js version
4. Provide error logs and screenshots

---

This guide ensures successful publication and maintenance of the React Vite Boilerplate npm package.
