# Contributing to Ruchy Syntax Tools

Thank you for your interest in contributing to the Ruchy syntax tools ecosystem!

## 🎯 Project Overview

This repository provides comprehensive syntax highlighting support for the Ruchy programming language across 9 major platforms:

- **TextMate** (VS Code, Sublime Text)
- **Tree-sitter** (Neovim, Helix)
- **highlight.js** (Web applications)
- **Prism.js** (Documentation sites)
- **Monaco Editor** (VS Code online)
- **CodeMirror 6** (Modern web editors)
- **Rouge** (GitHub/GitLab)
- **Pygments** (Python documentation)
- **LSP Server** (IDE integration)

## 🚀 Quick Start

### Setup
```bash
git clone https://github.com/ruchy-lang/ruchy-syntax-tools.git
cd ruchy-syntax-tools
npm install
```

### Running Tests
```bash
npm test        # Run all tests
npm run lint    # Check code quality
```

## 🛠️ Types of Contributions

### 1. Grammar Improvements
Fix highlighting issues, add missing patterns in `grammars/*/ruchy.*`

### 2. New Platform Support
Add support for additional editors/platforms

### 3. LSP Server Features
Improve IDE integration in `lsp/ruchy-lsp-server.js`

### 4. VS Code Extension
Enhance developer experience in `vscode-extension/`

### 5. Test Coverage
Add test files in `test/fixtures/*.rhy`

## 📋 Pull Request Process

1. **Planning**: Discuss changes in GitHub Issues
2. **Development**: Clear branch names and commits
3. **Testing**: Run tests and add new ones
4. **Documentation**: Update docs and comments
5. **Submission**: Clear PR with issue links

## 🧪 Quality Requirements

- **Coverage**: ≥80% of language constructs
- **Performance**: <25ms for 50K lines
- **Compatibility**: Works across all platforms

## 📜 License

MIT licensed. Contributing means you agree to the same license terms.

---

**Thank you for helping make Ruchy syntax highlighting better!** 🚀