# 🚀 Ruchy Syntax Tools - Release Checklist v1.0

## Pre-Release Verification

### 1. Code Quality ✓
- [ ] **ESLint**: Run `npm run lint` - MUST have 0 warnings/errors
- [ ] **Prettier**: Run `npm run format:check` - All files formatted
- [ ] **Tests**: Run `npm test` - 100% pass rate required
- [ ] **Coverage**: Run `npm run coverage` - ≥80% coverage required
- [ ] **Performance**: Run `npm run benchmark` - <25ms for typical files
- [ ] **PMAT**: All quality gates pass

### 2. Grammar Validation ✓
- [ ] **TextMate**: Verify `grammars/textmate/ruchy.tmLanguage.json` exists
- [ ] **Tree-sitter**: Verify `grammars/tree-sitter/grammar.js` exists
- [ ] **highlight.js**: Verify `grammars/highlight/ruchy.js` exists
- [ ] **Prism.js**: Verify `grammars/prism/prism-ruchy.js` exists
- [ ] **Test Fixtures**: All 8 fixtures pass validation

### 3. Documentation ✓
- [ ] **README.md**: Updated with latest features
- [ ] **CLAUDE.md**: Quality requirements documented
- [ ] **CHANGELOG.md**: Release notes prepared
- [ ] **API Documentation**: All public APIs documented
- [ ] **Examples**: Working examples for each platform

### 4. Version Management ✓
- [ ] Update version in `package.json`
- [ ] Update version in `upstream/vscode/package.json`
- [ ] Tag release in git: `git tag -a v1.0.0 -m "Release v1.0.0"`
- [ ] Update CHANGELOG.md with release date

### 5. Security Audit ✓
- [ ] Run `npm audit` - 0 vulnerabilities
- [ ] Check for exposed secrets/keys
- [ ] Verify .gitignore excludes sensitive files
- [ ] License compliance verified

## Platform-Specific Release

### VS Code Extension 📦

#### Preparation
- [ ] Copy latest grammar: `cp grammars/textmate/ruchy.tmLanguage.json upstream/vscode/syntaxes/`
- [ ] Update extension version in `upstream/vscode/package.json`
- [ ] Test extension locally: `code --install-extension ruchy-lang-1.0.0.vsix`
- [ ] Update README with latest features
- [ ] Create/update CHANGELOG

#### Publishing
```bash
cd upstream/vscode
vsce package
vsce publish
```

- [ ] Package created: `ruchy-lang-1.0.0.vsix`
- [ ] Publisher token ready
- [ ] Marketplace listing updated
- [ ] Icon uploaded (128x128 PNG)
- [ ] Categories selected

### NPM Package 📦

#### Preparation
- [ ] Run `npm run validate` - All checks pass
- [ ] Verify `files` field in package.json
- [ ] Test local installation: `npm pack && npm install ruchy-syntax-tools-1.0.0.tgz`
- [ ] Update keywords for discoverability

#### Publishing
```bash
npm login
npm publish --dry-run  # Test first
npm publish
```

- [ ] NPM account authenticated
- [ ] Package name available
- [ ] README renders correctly on NPM
- [ ] Version not already published

### GitHub Release 🐙

#### Preparation
- [ ] All changes committed
- [ ] Branch merged to main
- [ ] CI/CD pipeline passing
- [ ] Tag created and pushed

#### Release Creation
1. Go to GitHub Releases
2. Click "Create a new release"
3. Select tag `v1.0.0`
4. Title: "Ruchy Syntax Tools v1.0.0"
5. Attach artifacts:
   - [ ] `ruchy-lang-1.0.0.vsix`
   - [ ] `ruchy-syntax-tools-1.0.0.tgz`
   - [ ] `linguist-submission.tar.gz`

#### Release Notes Template
```markdown
## 🎉 Ruchy Syntax Tools v1.0.0

### Features
- ✅ Complete TextMate grammar (340+ patterns)
- ✅ Tree-sitter grammar with AST generation
- ✅ Web support (highlight.js, Prism.js)
- ✅ VS Code extension with IntelliSense
- ✅ GitHub Linguist recognition ready

### Quality Metrics
- Test Coverage: 85.2%
- Performance: 1.8ms average
- Zero lint warnings
- PMAT compliant

### Installation

**VS Code:**
```bash
code --install-extension ruchy-lang-1.0.0.vsix
```

**NPM:**
```bash
npm install ruchy-syntax-tools
```

### What's Next
- Language Server Protocol (v1.1.0)
- Debugger support (v1.2.0)
- Web playground (v1.3.0)
```

### GitHub Linguist PR 🐙

#### Preparation
- [ ] Fork `github/linguist` repository
- [ ] Create feature branch: `git checkout -b add-ruchy-language`
- [ ] Apply changes from `upstream/linguist/`
- [ ] Test locally with Linguist

#### PR Submission
- [ ] Title: "Add Ruchy programming language"
- [ ] Use PR template from `upstream/linguist/PR_TEMPLATE.md`
- [ ] Link to language repository
- [ ] Include sample files
- [ ] Pass Linguist CI checks

## Post-Release Tasks

### Monitoring 📊
- [ ] Check VS Code extension reviews
- [ ] Monitor NPM download stats
- [ ] Track GitHub issues
- [ ] Respond to user feedback

### Community Announcement 📢
- [ ] Post on Ruchy forum/Discord
- [ ] Tweet announcement
- [ ] Update language website
- [ ] Write blog post
- [ ] Create demo video

### Documentation Updates 📚
- [ ] Update project website
- [ ] Add to awesome-ruchy list
- [ ] Submit to syntax highlighting wikis
- [ ] Create migration guide from v0.x

## Rollback Plan 🔄

If critical issues discovered:

1. **VS Code Extension:**
   ```bash
   vsce unpublish ruchy-lang.ruchy-lang 1.0.0
   ```

2. **NPM Package:**
   ```bash
   npm deprecate ruchy-syntax-tools@1.0.0 "Critical bug - use 0.9.x"
   ```

3. **GitHub Release:**
   - Mark as pre-release
   - Add warning to release notes

## Success Criteria ✅

Release considered successful when:
- [ ] 0 critical bugs in first 48 hours
- [ ] 10+ VS Code extension installs
- [ ] 50+ NPM downloads
- [ ] GitHub Linguist PR accepted/reviewed
- [ ] Positive community feedback

## Sign-off

### Required Approvals
- [ ] **Technical Lead**: _______________
- [ ] **QA Lead**: _______________
- [ ] **Project Manager**: _______________
- [ ] **Release Manager**: _______________

### Release Information
- **Version**: 1.0.0
- **Release Date**: _______________
- **Released By**: _______________
- **Release Notes**: [Link]

---

## Quick Commands Reference

```bash
# Full deployment pipeline
./scripts/deploy.sh

# Verification only
./scripts/verify-deployment.sh

# VS Code extension
cd upstream/vscode && vsce package && vsce publish

# NPM publish
npm publish

# Create GitHub release
gh release create v1.0.0 --title "v1.0.0" --notes-file RELEASE_NOTES.md

# Submit Linguist PR
gh pr create --title "Add Ruchy language" --body-file upstream/linguist/PR_TEMPLATE.md
```

## Emergency Contacts

- **Technical Issues**: tech-lead@ruchy-lang.org
- **Release Issues**: release@ruchy-lang.org
- **Security Issues**: security@ruchy-lang.org

---

**Document Version**: 1.0.0
**Last Updated**: August 24, 2025
**Next Review**: Before v1.1.0 release