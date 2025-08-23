# ruchy-syntax-tools

Comprehensive syntax highlighting and language support for the Ruchy programming language across 9 major platforms.

## 🚀 Features

- **9 Platform Support**: TextMate, Tree-sitter, highlight.js, Prism.js, Monaco, CodeMirror 6, Rouge, Pygments, LSP
- **Complete VS Code Extension**: Full IDE integration with themes, snippets, and IntelliSense
- **Production Ready**: Quality-tested with performance benchmarks
- **Upstream Contributions**: Ready-to-submit packages for major platforms

## 📦 Installation

```bash
npm install ruchy-syntax-tools
```

## 🎯 Supported Platforms

| Platform | Usage | Status |
|----------|-------|--------|
| TextMate | VS Code, Sublime Text | ✅ Complete |
| Tree-sitter | Neovim, Helix, GitHub | ✅ Complete |
| highlight.js | Web applications | ✅ Complete |
| Prism.js | Documentation sites | ✅ Complete |
| Monaco Editor | VS Code online | ✅ Complete |
| CodeMirror 6 | Modern web editors | ✅ Complete |
| Rouge | GitHub/GitLab | ✅ Complete |
| Pygments | Python documentation | ✅ Complete |
| LSP Server | IDE integration | ✅ Complete |

## 🔧 Usage

Import specific platforms:

```javascript
// TextMate grammar
const textmate = require('ruchy-syntax-tools/textmate');

// Tree-sitter grammar
const treesitter = require('ruchy-syntax-tools/tree-sitter');

// highlight.js language
const hljs = require('ruchy-syntax-tools/highlight');

// LSP server
const lsp = require('ruchy-syntax-tools/lsp');
```

## 📊 Quality Metrics

- **Performance**: 1.8ms average (target: <25ms)
- **Coverage**: 85%+ language construct coverage
- **Test Suite**: Cross-platform validation
- **Package Size**: Optimized for production use

## 🔗 Links

- **Repository**: https://github.com/noahgift/ruchy-syntax-tools
- **Issues**: https://github.com/noahgift/ruchy-syntax-tools/issues
- **NPM Package**: https://www.npmjs.com/package/ruchy-syntax-tools

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.