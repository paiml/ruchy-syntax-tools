# Ruchy Language Definition for highlight.js

This is a comprehensive language definition for the Ruchy programming language, ready for integration into highlight.js.

## Language Overview

**Ruchy** is a modern systems programming language that combines:
- **Rust-like syntax** for systems programming
- **Built-in actor model** for concurrent programming  
- **Pipeline operators** for functional programming
- **Memory safety** through ownership and lifetimes

## Key Features Supported

### Core Language Features
- ✅ **Keywords**: All control flow, declarations, and modifiers
- ✅ **Operators**: Including pipeline (`>>`) and actor operators (`<-`, `<?`)
- ✅ **Literals**: Strings, numbers, characters, booleans
- ✅ **Comments**: Line, block, and documentation comments

### Ruchy-Specific Features
- ✅ **Actor Model**: `actor`, `spawn`, `send` keywords with special highlighting
- ✅ **Pipeline Operators**: `>>` for functional composition
- ✅ **Message Passing**: `<-` (send) and `<?` (ask) operators
- ✅ **Pattern Matching**: Advanced match expressions
- ✅ **Lifetimes**: `'static`, `'a` lifetime annotations

### Advanced Features
- ✅ **String Interpolation**: `${expression}` syntax
- ✅ **Raw Strings**: `r"..."` and `r#"..."#` variants
- ✅ **Attributes**: `#[...]` and `#![...]` annotations
- ✅ **Generics**: Type parameters and constraints
- ✅ **SATD Detection**: TODO, FIXME, HACK highlighting

## File Information

- **Language File**: `ruchy.js` - Complete language definition
- **Test File**: `test.rhy` - Comprehensive test examples
- **Aliases**: `rhy` (short form)
- **Extensions**: `.rhy`, `.ruchy`

## Implementation Details

### Architecture
- **Base**: Uses highlight.js standard language definition pattern
- **Performance**: Optimized regex patterns for fast highlighting
- **Maintainability**: Well-documented with clear structure
- **Extensibility**: Easy to add new features as language evolves

### Code Quality
- **Comprehensive**: Covers all language constructs
- **Tested**: Includes extensive test cases
- **Documented**: Clear comments explaining patterns
- **Standards Compliant**: Follows highlight.js conventions

## Usage Example

```javascript
import hljs from 'highlight.js';
import ruchy from './ruchy.js';

// Register the language
hljs.registerLanguage('ruchy', ruchy);

// Use in HTML
// <pre><code class="language-ruchy">
//   actor MessageProcessor { ... }
// </code></pre>
```

## Test Coverage

The included test file demonstrates:
- Actor definitions and spawning
- Pipeline operator usage
- Message passing patterns
- Pattern matching
- All numeric literal formats
- String interpolation
- Error handling
- Documentation comments
- Technical debt markers

## Maintenance

This language definition will be maintained by the Ruchy Language Team. We commit to:
- **Bug fixes** for any highlighting issues
- **Updates** as the language evolves  
- **Performance** optimization based on usage
- **Community** responsiveness to feedback

## License

MIT License - Same as highlight.js core

## Links

- **Language Website**: https://ruchy-lang.org
- **Documentation**: https://docs.ruchy-lang.org  
- **Repository**: https://github.com/ruchy-lang/ruchy
- **Syntax Tools**: https://github.com/ruchy-lang/ruchy-syntax-tools

---

**Ready for integration into highlight.js core or as a third-party language pack!**