# Loopin City - Branching Strategy & Workflow

## 🌿 Branch Structure

```
main (production) → https://loopin.city
├── develop (staging) → https://staging-loopin.onrender.com
├── feature/ai-chatbot-integration
├── feature/ui-ux-enhancements
├── feature/frontend-improvements
└── hotfix/* (emergency fixes)
```

## 🎯 Branch Purposes

### **Main Branches**
- **`main`**: Production-ready code only. Auto-deploys to production.
- **`develop`**: Integration branch for all features. Auto-deploys to staging.

### **Feature Branches**
- **`feature/ai-chatbot-integration`**: AI chatbot development
- **`feature/ui-ux-enhancements`**: UI/UX improvements
- **`feature/frontend-improvements`**: General frontend work

### **Utility Branches**
- **`hotfix/*`**: Emergency fixes that merge directly to main

## 🔄 Development Workflow

### **Normal Feature Development**
1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test** your feature locally

3. **Push to remote** and create pull request
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create PR** to `develop` branch
   - Assign reviewers
   - Ensure all checks pass (build, lint, type-check)

5. **Merge to develop** → Auto-deploys to staging

6. **Test in staging** environment

7. **Create PR** from `develop` to `main`
   - Final review and approval
   - Merge to main → Auto-deploys to production

### **Hotfix Process (Emergency)**
1. **Create hotfix branch** from `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-issue-description
   ```

2. **Fix the issue** quickly

3. **Create PR directly to main** (bypasses develop)
   - Fast approval process
   - Immediate deployment to production

4. **Later**: Merge hotfix back to develop to keep it in sync

## 🔒 Branch Protection Rules

### **Main Branch (`main`)**
- ✅ Require pull request before merging
- ✅ Require 1 approval (MehulPardeshi)
- ✅ Require status checks: build, lint, type-check
- ✅ Require conversation resolution before merging
- ✅ 100MB file size limit
- ❌ No force pushes
- ❌ No deletions

### **Develop Branch (`develop`)**
- ✅ Require pull request before merging
- ✅ Require 1 approval (MehulPardeshi)
- ✅ Require status checks: build, lint
- ✅ Require conversation resolution before merging
- ✅ Allow force pushes (for integration purposes)
- ❌ No deletions

### **Hotfix Branches (`hotfix/*`)**
- ✅ Require pull request before merging
- ✅ Require 1 approval (MehulPardeshi)
- ✅ Require status checks: build, lint
- ❌ No conversation resolution required (fast merging)
- ✅ Allow force pushes (for urgent fixes)

## 🚀 Deployment Strategy

### **Production Environment**
- **Branch**: `main`
- **URL**: https://loopin.city
- **Auto-deploy**: On merge to main
- **Purpose**: Live application for users

### **Staging Environment**
- **Branch**: `develop`
- **URL**: https://staging-loopin.onrender.com
- **Auto-deploy**: On push to develop
- **Purpose**: Testing features before production
- **Environment**: Same as production (same env variables)

## 🧪 Testing Requirements

### **Automated Tests (Required)**
- **Build Check**: `npm run build` must pass
- **Linting**: `npm run lint` must pass
- **Type Checking**: TypeScript types must be valid

### **Manual Testing (Recommended)**
- **UX/Feel Testing**: 5-10 minutes per feature
- **Mobile Experience**: Test on phone
- **Cross-browser**: Chrome (primary), Safari, Firefox

## 📋 Pull Request Guidelines

### **Required Information**
- **Description**: What the feature does
- **Testing**: How you tested it
- **Screenshots**: If UI changes
- **Breaking Changes**: Any breaking changes

### **Review Process**
- Assign appropriate reviewers
- Address all review comments
- Ensure all checks pass
- Resolve conversations before merging

## 🚨 Rollback Strategy

### **Quick Rollback Options**
1. **Git Rollback**: Revert to previous commit
2. **Render Rollback**: Use Render's built-in rollback
3. **Database Rollback**: If needed, restore from backup

### **When to Rollback**
- Critical bugs in production
- Performance issues
- User experience problems
- Security vulnerabilities

## 🔧 Environment Setup

### **Local Development**
```bash
# Clone repository
git clone https://github.com/Loopin-city/loopin-city.git
cd loopin-city

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Feature Development**
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Develop and test
npm run dev
npm run lint
npm run build

# Push and create PR
git add .
git commit -m "feat: your feature description"
git push -u origin feature/your-feature-name
```

## 📚 Best Practices

### **Commit Messages**
- Use conventional commit format
- Examples: `feat: add AI chatbot`, `fix: resolve login issue`, `docs: update README`

### **Branch Management**
- Keep feature branches small and focused
- Delete merged feature branches
- Regular pulls from develop branch

### **Code Quality**
- Run linting before committing
- Test locally before pushing
- Keep commits atomic and focused

## 🆘 Troubleshooting

### **Common Issues**
1. **Build Fails**: Check for syntax errors, missing dependencies
2. **Lint Errors**: Fix code style issues, run `npm run lint`
3. **Type Errors**: Fix TypeScript type issues
4. **Merge Conflicts**: Resolve conflicts, test thoroughly

### **Getting Help**
- Check this documentation first
- Review GitHub Issues
- Ask in team discussions
- Contact MehulPardeshi for urgent issues

## 🔄 Future Enhancements

### **Phase 2 (Future)**
- Add unit tests
- Add integration tests
- Add performance tests
- Add security scans

### **Phase 3 (Future)**
- Add deployment approvals
- Add automated rollback triggers
- Add performance monitoring
- Add user analytics

---

**Last Updated**: $(date)
**Maintained by**: MehulPardeshi
