# Ruchy Language Support for VS Code

Comprehensive language support for the Ruchy programming language in Visual Studio Code.

## Features

### Syntax Highlighting
- **Complete grammar support** with TextMate-based syntax highlighting
- **Ruchy-specific constructs**: actors, pipeline operators, message passing
- **Semantic highlighting** for improved code readability
- **Custom theme** optimized for Ruchy code

### Language Features
- **IntelliSense** with auto-completion for keywords, types, and functions
- **Error diagnostics** and syntax validation
- **Go-to-definition** for functions, types, and modules
- **Hover information** for language constructs
- **Code snippets** for common patterns

### Ruchy-Specific Support
- **Actor model**: `actor`, `spawn`, `send` keywords
- **Pipeline operators**: `>>` for functional composition
- **Message passing**: `<-` (send) and `<?` (ask) operators
- **Pattern matching** and advanced control flow

### Code Intelligence
- **Language Server Protocol** (LSP) integration
- **Real-time diagnostics** and error checking
- **Code formatting** and organization
- **Symbol navigation** and workspace search

## Quick Start

1. **Install the extension** from VS Code Marketplace
2. **Open a Ruchy file** (`.rhy` or `.ruchy`)
3. **Start coding** with full language support!

### Example Ruchy Code

```ruchy
// Define an actor for message processing
actor MessageProcessor {
    state: Vec<String>,

    fn new() -> Self {
        Self { state: Vec::new() }
    }

    fn handle(&mut self, message: String) -> String {
        self.state.push(message.clone());
        
        // Use pipeline operator for functional composition
        message 
            >> |s| s.to_uppercase()
            >> |s| format!("Processed: {}", s)
    }
}

fn main() {
    // Spawn an actor
    let processor = spawn(MessageProcessor::new());
    
    // Send messages using actor operators
    processor <- "hello".to_string();
    let result = processor <? "world".to_string();
    
    println!("Result: {}", result);
}
```

## Configuration

The extension can be configured through VS Code settings:

```json
{
    "ruchy.lsp.enable": true,
    "ruchy.lsp.serverPath": "",
    "ruchy.formatting.enable": true,
    "ruchy.diagnostics.enable": true,
    "ruchy.completion.enable": true,
    "ruchy.highlighting.semanticTokens": true
}
```

### Settings Details

- **`ruchy.lsp.enable`**: Enable Language Server Protocol support
- **`ruchy.lsp.serverPath`**: Custom path to Ruchy LSP server (auto-detected by default)
- **`ruchy.formatting.enable`**: Enable automatic code formatting
- **`ruchy.diagnostics.enable`**: Enable error checking and diagnostics
- **`ruchy.completion.enable`**: Enable IntelliSense and auto-completion
- **`ruchy.highlighting.semanticTokens`**: Enable semantic syntax highlighting

## Commands

Access these commands via the Command Palette (`Ctrl+Shift+P`):

- **`Ruchy: Restart Language Server`**: Restart the LSP server
- **`Ruchy: Show Output Channel`**: View extension logs and diagnostics
- **`Ruchy: Check Syntax`**: Manually check current file for syntax errors

## Code Snippets

The extension includes comprehensive code snippets for common Ruchy patterns:

| Trigger | Description |
|---------|-------------|
| `fn` | Function definition |
| `actor` | Actor definition with basic structure |
| `struct` | Struct definition |
| `enum` | Enum definition |
| `match` | Match expression |
| `spawn` | Spawn actor instance |
| `send` | Send message to actor |
| `ask` | Send message and wait for response |
| `pipe` | Pipeline expression |
| `impl` | Implementation block |
| `trait` | Trait definition |

## Language Server

This extension integrates with the Ruchy Language Server for advanced features:

### Installation
The language server is automatically detected from:
1. Extension bundle (if included)
2. `ruchy-syntax-tools` npm package
3. Global Ruchy installation

### Manual Installation
```bash
# Via npm (recommended)
npm install -g ruchy-syntax-tools

# Via Rust cargo (if building from source)
cargo install ruchy
```

## File Associations

The extension automatically activates for:
- **`.rhy`** files
- **`.ruchy`** files

## Themes

Includes the **Ruchy Dark** theme optimized for Ruchy syntax highlighting with:
- Enhanced colors for actor-specific keywords
- Distinct highlighting for pipeline operators
- Semantic colors for different language constructs

## Requirements

- **VS Code** 1.74.0 or higher
- **Node.js** 16+ (for LSP server)
- **Ruchy Language** installation (optional, for advanced features)

## Extension Development

This extension is part of the [ruchy-syntax-tools](https://github.com/ruchy-lang/ruchy-syntax-tools) project.

### Building from Source
```bash
git clone https://github.com/ruchy-lang/ruchy-syntax-tools.git
cd ruchy-syntax-tools/vscode-extension
npm install
npm run compile
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](https://github.com/ruchy-lang/ruchy-syntax-tools/blob/main/CONTRIBUTING.md).

## Issues and Support

- **Bug Reports**: [GitHub Issues](https://github.com/ruchy-lang/ruchy-syntax-tools/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/ruchy-lang/ruchy-syntax-tools/discussions)
- **Documentation**: [Ruchy Language Website](https://ruchy-lang.org)

## License

MIT License. See [LICENSE](https://github.com/ruchy-lang/ruchy-syntax-tools/blob/main/LICENSE) for details.

## Changelog

### 1.2.0
- Initial release
- Complete syntax highlighting
- LSP integration
- Code snippets
- Custom theme
- Actor model support
- Pipeline operators
- IntelliSense features

---

**Enjoy coding in Ruchy!** 🚀