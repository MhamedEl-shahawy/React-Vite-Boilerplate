# NPM Publication Checklist

Use this checklist to ensure everything is ready before publishing to npm.

## ✅ Pre-Publication Checklist

### 📋 **Package Configuration**
- [ ] Package name is unique and available on npm
- [ ] Version number is updated in `package.json`
- [ ] Description is clear and informative
- [ ] Keywords are relevant for discoverability
- [ ] Author information is correct
- [ ] License is specified (MIT)
- [ ] Repository URL is correct
- [ ] Homepage URL is set
- [ ] Engines specify minimum Node.js version (>=20.0.0)

### 🔧 **CLI Configuration**
- [ ] `bin` field points to correct CLI script (`./bin/cli.js`)
- [ ] CLI script has proper shebang (`#!/usr/bin/env node`)
- [ ] CLI script is executable
- [ ] CLI dependencies are installed (`chalk`, `commander`, `fs-extra`, `inquirer`, `ora`)

### 📁 **Files Configuration**
- [ ] `files` field includes necessary directories (`template`, `bin`, `README.md`)
- [ ] Template directory will be created by build script
- [ ] Unnecessary files are excluded from package

### 🏗️ **Build Process**
- [ ] `build-template` script exists and works
- [ ] Template excludes development files (node_modules, .git, etc.)
- [ ] Template package.json is cleaned (no CLI fields)
- [ ] Template .gitignore is appropriate

### 🧪 **Testing**
- [ ] CLI can be tested locally (`npm run test-cli`)
- [ ] Generated project structure is correct
- [ ] Package.json is updated with project name
- [ ] Environment files are copied correctly
- [ ] Dependencies can be installed in generated project
- [ ] Generated project can be built and run

### 📚 **Documentation**
- [ ] Main README.md explains npm usage
- [ ] NPM_README.md is comprehensive
- [ ] Installation instructions are clear
- [ ] Feature list is up-to-date
- [ ] Documentation links work

### 🔐 **Security**
- [ ] No sensitive information in template
- [ ] Environment variables are properly handled
- [ ] Dependencies are up-to-date and secure
- [ ] npm audit shows no vulnerabilities

## 🚀 Publication Steps

### 1. **Final Preparation**
```bash
# Update version
npm version patch|minor|major

# Build template
npm run build-template

# Test CLI
npm run test-cli

# Run full test with installation
npm run test-cli-full
```

### 2. **NPM Account Setup**
```bash
# Login to npm
npm login

# Verify login
npm whoami

# Check 2FA is enabled (recommended)
npm profile get
```

### 3. **Pre-publish Verification**
```bash
# Check what will be published
npm pack --dry-run

# Verify package contents
npm pack
tar -tf create-react-vite-boilerplate-*.tgz
```

### 4. **Publish**
```bash
# Dry run first
npm publish --dry-run

# Publish to npm
npm publish

# For beta versions
npm publish --tag beta
```

### 5. **Post-Publication Verification**
```bash
# Check package on npm
npm view create-react-vite-boilerplate

# Test installation
npx create-react-vite-boilerplate test-app
cd test-app
npm install
npm run dev
```

## 📊 Post-Publication Tasks

### **GitHub Release**
- [ ] Create GitHub release with version tag
- [ ] Include changelog and feature highlights
- [ ] Attach any relevant assets

### **Documentation Updates**
- [ ] Update main README with npm installation instructions
- [ ] Update project documentation
- [ ] Create usage examples and tutorials

### **Community**
- [ ] Share on social media
- [ ] Submit to relevant awesome lists
- [ ] Write blog post or tutorial
- [ ] Update personal portfolio

### **Monitoring**
- [ ] Monitor npm download statistics
- [ ] Watch for GitHub issues and feedback
- [ ] Respond to community questions
- [ ] Plan future updates and improvements

## 🔄 Maintenance Checklist

### **Regular Updates**
- [ ] Keep dependencies updated
- [ ] Monitor security vulnerabilities
- [ ] Update documentation as needed
- [ ] Respond to user feedback and issues

### **Version Management**
- [ ] Follow semantic versioning
- [ ] Maintain changelog
- [ ] Test thoroughly before releases
- [ ] Communicate breaking changes clearly

## 🐛 Troubleshooting

### **Common Issues**
- **Permission denied**: Ensure npm login and 2FA setup
- **Package name taken**: Choose a different unique name
- **CLI not working**: Check bin field and file permissions
- **Template issues**: Verify build-template script output

### **Debug Commands**
```bash
# Check npm configuration
npm config list

# Verify package contents
npm pack && tar -tf *.tgz

# Test CLI locally
npm link
create-react-vite-boilerplate test-project

# Check for issues
npm audit
npm outdated
```

## 📞 Support Resources

- **NPM Documentation**: https://docs.npmjs.com/
- **Semantic Versioning**: https://semver.org/
- **Package.json Guide**: https://docs.npmjs.com/cli/v10/configuring-npm/package-json
- **CLI Best Practices**: https://github.com/sindresorhus/awesome-nodejs#command-line-apps

---

**Remember**: Always test thoroughly before publishing. Once published, versions cannot be unpublished after 24 hours!
