# Ruchy Language Support for Visual Studio Code

Official VS Code extension providing comprehensive language support for the Ruchy programming language.

## Features

### 🎨 Syntax Highlighting
- Full TextMate grammar with 340+ patterns
- Semantic token support for rich highlighting
- Special highlighting for Ruchy-specific operators:
  - Pipeline operator `>>`
  - Actor send `<-` and ask `<?` operators

### 📝 Code Snippets
- 30+ snippets for common Ruchy patterns
- Actor definition templates
- Pattern matching helpers
- Pipeline operator chains

### 🔧 Language Features
- Auto-closing pairs for brackets and quotes
- Smart indentation
- Comment toggling (line and block)
- Code folding regions
- Bracket matching

### 💡 IntelliSense
- Keyword completions
- Built-in type suggestions
- Operator completions with documentation
- Hover information for Ruchy constructs

### 🏃 Commands
- **Run Current File**: Execute the active Ruchy file
- **Run Tests**: Run all tests in the workspace
- **Format Document**: Format using Ruchy formatter

### 🔍 Diagnostics
- Missing semicolon detection
- TODO/FIXME comment highlighting
- Unused variable hints

## Installation

### From Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Ruchy"
4. Click Install

### From VSIX
1. Download the `.vsix` file from releases
2. Run: `code --install-extension ruchy-lang-1.0.0.vsix`

## Usage

### File Extensions
- `.rhy` - Ruchy source files
- `.ruchy` - Alternative extension

### Keyboard Shortcuts
- `Ctrl+Shift+R` - Run current file
- `Ctrl+Shift+T` - Run tests
- `Shift+Alt+F` - Format document

### Configuration
The extension provides sensible defaults for Ruchy development:
```json
{
  "[ruchy]": {
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "editor.rulers": [100]
  }
}
```

## Requirements

- VS Code 1.74.0 or higher
- Ruchy compiler (optional, for run/test commands)

## Language Features

### Actor System
```ruchy
actor Counter {
    count: u32,
    
    fn handle(msg: Message) {
        match msg {
            Increment => self.count += 1,
            Get => sender <- self.count,
        }
    }
}

let counter = spawn Counter { count: 0 };
counter <- Increment;
let value = counter <? Get;
```

### Pipeline Operator
```ruchy
data >> validate >> transform >> process >> store
```

### Pattern Matching
```ruchy
match result {
    Ok(value) => println!("Success: {}", value),
    Err(e) => eprintln!("Error: {}", e),
}
```

## Extension Settings

This extension contributes the following settings:

* `ruchy.enableDiagnostics`: Enable/disable diagnostics
* `ruchy.enableCodeLens`: Enable/disable code lens
* `ruchy.formatOnSave`: Format Ruchy files on save

## Known Issues

- Formatter requires Ruchy compiler to be installed
- Debugger support planned for future release

## Release Notes

### 1.0.0
- Initial release
- Complete syntax highlighting
- Basic IntelliSense support
- Code snippets
- Run/test commands

## Contributing

Contributions are welcome! Please see our [contributing guide](https://github.com/ruchy-lang/ruchy-syntax-tools/blob/main/CONTRIBUTING.md).

## License

MIT - See [LICENSE](https://github.com/ruchy-lang/ruchy-syntax-tools/blob/main/LICENSE) for details.

## Quality Metrics

- **Test Coverage**: ≥80%
- **Performance**: <25ms highlighting for 50K lines
- **Zero Lint Warnings**: Enforced via ESLint
- **PMAT Compliant**: All quality gates pass

---

**Publisher**: Ruchy Language Team  
**Repository**: https://github.com/ruchy-lang/ruchy-syntax-tools  
**Issues**: https://github.com/ruchy-lang/ruchy-syntax-tools/issues