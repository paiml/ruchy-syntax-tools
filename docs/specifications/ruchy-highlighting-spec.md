# Ruchy Language Highlighting Specification v2.0

## Executive Summary

This specification defines the canonical syntax highlighting implementation for Ruchy, focusing on the lean MVP grammar post-architecture review. Serves as the single source of truth for all highlighting implementations.

## Language Metadata

```yaml
name: Ruchy
scopeName: source.ruchy
extensions: [.rhy, .ruchy]
mime_type: text/x-ruchy
language_type: programming
line_comment: //
block_comment: /* */
doc_comment: /// (line), /** */ (block)
```

## Repository Structure

```
ruchy-highlighting/
├── Makefile                    # Build orchestration
├── README.md                   # Quick start guide
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT
├── spec/
│   ├── ruchy-highlighting-spec.md  # This document
│   └── grammar-bnf.txt           # Formal grammar
├── grammars/
│   ├── textmate/
│   │   ├── ruchy.tmLanguage.json
│   │   └── ruchy.tmLanguage.yaml  # Source
│   ├── tree-sitter/
│   │   ├── grammar.js
│   │   ├── queries/
│   │   │   ├── highlights.scm
│   │   │   ├── locals.scm
│   │   │   └── indents.scm
│   │   └── corpus/              # Test cases
│   ├── highlight.js/
│   │   └── ruchy.js
│   └── prism/
│       └── prism-ruchy.js
├── test/
│   ├── fixtures/               # Sample files
│   │   ├── minimal.rhy        # Core syntax
│   │   ├── actors.rhy         # Concurrency
│   │   ├── errors.rhy         # Error handling
│   │   └── interop.rhy        # FFI examples
│   ├── snapshots/              # Expected output
│   └── runner.js               # Test harness
├── tools/
│   ├── validate.js             # Grammar validator
│   ├── benchmark.js            # Performance tests
│   └── convert.js              # Format converters
└── upstream/
    ├── linguist/               # GitHub PR staging
    ├── vscode/                 # Extension staging
    └── patches/                # Upstream patches
```

## Core Token Categories (MVP)

### Keywords (Priority 1 - Parser Critical)

```
// Control flow (no 'when' - removed for clarity)
if else match case for while loop break continue return

// Declarations
let fn type struct enum impl trait mod use

// Modifiers (minimal set)
pub mut async unsafe

// Special
self Self super as in where
```

### Operators (Simplified)

```
// Arithmetic
+ - * / % **

// Comparison  
== != < > <= >=

// Logical
&& || !

// Pipeline (new - replaces |>)
>>

// Assignment
= += -= *= /= %=

// Type/Path
:: -> =>

// Actor (new syntax)
<- <?

// Pattern
.. | _
```

### Removed Ambiguous Constructs

- ~~`|>` pipeline~~ → `>>` (avoids closure conflict)
- ~~`when` guards~~ → `if` (redundant with `if`)
- ~~`try/catch`~~ → `Result` monadic (Rust alignment)
- ~~Multiple lambda syntaxes~~ → Only `|x| expr`
- ~~`<|` reverse pipe~~ → Removed (complexity budget)

## Precedence Table (Strict)

```
1. Paths/Member access:  ::  .
2. Unary:                ! - 
3. Multiplicative:       * / %
4. Additive:             + -
5. Shift:                << >>
6. Relational:           < > <= >=
7. Equality:             == !=
8. Logical AND:          &&
9. Logical OR:           ||
10. Pipeline:            >> (new)
11. Assignment:          = += -= etc.
12. Actor send:          <- <? (new)
```

## Context-Sensitive Rules

### Type Context Detection
```regex
(?:type|struct|enum|impl|trait|:\s*|->|as)\s+([A-Z][a-zA-Z0-9_]*)
```

### Function Detection
```regex
fn\s+([a-z_][a-zA-Z0-9_]*)\s*(?:<[^>]*>)?\s*\(
```

### Actor Message Detection (New)
```regex
([a-z_][a-zA-Z0-9_]*)\s*(<-|<\?)\s*
```

## Implementation Strategy

### Makefile Targets

```makefile
# Standard targets following GNU conventions
.PHONY: all clean test install dist check

VERSION := 0.1.0
GRAMMAR_SOURCES := $(wildcard grammars/*/*)
TEST_FIXTURES := $(wildcard test/fixtures/*.rhy)

all: build test

build: textmate tree-sitter highlight prism

textmate: grammars/textmate/ruchy.tmLanguage.json
	@echo "Building TextMate grammar..."
	@npx js-yaml grammars/textmate/ruchy.tmLanguage.yaml > $@

tree-sitter: grammars/tree-sitter/grammar.js
	@echo "Building Tree-sitter grammar..."
	@cd grammars/tree-sitter && npm run build

highlight: grammars/highlight.js/ruchy.js
	@echo "Validating highlight.js module..."
	@node tools/validate.js $<

prism: grammars/prism/prism-ruchy.js
	@echo "Building Prism grammar..."
	@node tools/convert.js prism < grammars/textmate/ruchy.tmLanguage.json > $@

test: test-syntax test-performance test-visual

test-syntax: $(TEST_FIXTURES)
	@echo "Running syntax tests..."
	@node test/runner.js

test-performance:
	@echo "Running performance benchmarks..."
	@node tools/benchmark.js

test-visual:
	@echo "Generating visual regression tests..."
	@./tools/generate-visual.sh

install-hooks:
	@cp hooks/pre-commit .git/hooks/
	@chmod +x .git/hooks/pre-commit

check: lint validate
	@echo "Checking grammar consistency..."
	@node tools/validate.js --all

lint:
	@npx eslint tools test
	@npx prettier --check .

format:
	@npx prettier --write .

dist: ruchy-highlighting-$(VERSION).tar.gz

ruchy-highlighting-$(VERSION).tar.gz: $(GRAMMAR_SOURCES)
	@tar czf $@ grammars/ spec/ LICENSE README.md

clean:
	@rm -rf build/ dist/ coverage/
	@rm -f grammars/textmate/*.json
	@rm -f ruchy-highlighting-*.tar.gz

# Upstream submission helpers
upstream-linguist:
	@echo "Preparing GitHub Linguist PR..."
	@./upstream/prepare-linguist.sh

upstream-vscode:
	@echo "Building VS Code extension..."
	@cd upstream/vscode && vsce package

upstream-highlight:
	@echo "Preparing highlight.js PR..."
	@./upstream/prepare-highlight.sh

# Development helpers
watch:
	@npx nodemon -w grammars -e yaml,js -x "make build test-syntax"

serve-docs:
	@npx docsify serve docs

# CI/CD targets
ci: clean build test check

.NOTPARALLEL: test
```

## Lean MVP Grammar (Post-Review)

### Essential Constructs Only

```ebnf
(* Two-page grammar goal *)

program = { item }

item = function
     | struct_def
     | enum_def
     | impl_block
     | use_decl

function = "fn" IDENT [ generics ] params [ "->" type ] block

struct_def = "struct" TYPE_IDENT [ generics ] "{" fields "}"

enum_def = "enum" TYPE_IDENT [ generics ] "{" variants "}"

impl_block = "impl" [ generics ] type "{" { function } "}"

(* Expressions - simplified *)
expr = literal
     | IDENT
     | expr "." IDENT
     | expr "(" args ")"
     | "|" params "|" expr  (* single lambda syntax *)
     | expr ">>" expr       (* pipeline operator *)
     | match_expr
     | if_expr
     | block

(* Pattern matching - core only *)
pattern = "_"
        | IDENT
        | literal
        | pattern "|" pattern

(* Removed: try/catch, when guards, multiple lambda forms *)
```

## Performance Requirements

```yaml
metrics:
  max_highlight_time: 25ms  # Reduced from 50ms
  max_memory: 5MB           # Reduced from 10MB
  max_file_size: 50K_lines
  incremental_threshold: 100_lines
```

## Testing Strategy

### Minimal Test Suite
```javascript
// test/fixtures/minimal.rhy
fn main() {
    let x = 42
    let double = |n| n * 2
    x >> double >> print  // Pipeline operator
}

// test/fixtures/actors.rhy
actor Counter {
    let mut count = 0
    
    fn handle(msg) {
        match msg {
            Inc(n) => count += n
            Get => sender <- count  // Actor send
        }
    }
}

// test/fixtures/errors.rhy
fn divide(a: int, b: int) -> Result<int> {
    if b == 0 {
        Err("division by zero")
    } else {
        Ok(a / b)
    }
}
```

## Upstream Submission Checklist

### Phase 1: Core Infrastructure (Week 1)
- [x] Repository structure
- [x] Makefile automation
- [ ] TextMate grammar (simplified)
- [ ] Test suite (20 files minimum)

### Phase 2: Validation (Week 2)
- [ ] Grammar validator passing
- [ ] Performance benchmarks met
- [ ] Visual regression tests
- [ ] Cross-platform testing

### Phase 3: Extensions (Week 3)
- [ ] VS Code extension (local)
- [ ] Tree-sitter grammar
- [ ] highlight.js module
- [ ] Prism.js support

### Phase 4: Upstream PRs (Week 4)
- [ ] GitHub Linguist PR
  - Sample files (10 minimum)
  - Heuristics for .rhy detection
  - Grammar file
- [ ] VS Code Marketplace
  - Publisher account
  - Extension packaging
  - README with examples
- [ ] highlight.js PR
  - Size < 8KB (reduced target)
  - Test coverage > 90%
  - Demo page

## Design Rationale Addendum

### Why `>>` Over `|>`
The `|>` operator creates an irreconcilable conflict with closure syntax `|x|`. While F# uses whitespace sensitivity to disambiguate, this violates our "no significant whitespace" principle. The `>>` operator:
1. Has precedent in Haskell (monadic sequencing)
2. Visually suggests "forward flow"
3. Parses unambiguously

### Actor Syntax Evolution
- `<-` for send: Universal in actor languages (Erlang, Scala)
- `<?` for ask: New, but follows Rust's `?` pattern for fallible operations
- Removed `!` suffix: Reserved for macro invocation only

### Error Handling Without try/catch
Removing `try/catch` forces idiomatic Rust patterns from day one:
```ruchy
// Instead of try/catch
divide(10, 0)
    .map(|x| x * 2)
    .unwrap_or(0)
```
This is less familiar but architecturally cleaner for transpilation.

## Migration Path for Deferred Features

### v2.0 Roadmap
1. **Refinement Types**: New syntax `type Nat = int { _ >= 0 }`
2. **DataFrame Syntax**: Keep `df!` but clearly document as macro
3. **Effect Handlers**: Requires careful integration with async

## Conclusion

This specification represents Ruchy post-architecture review: a lean, unambiguous grammar that prioritizes correctness over features. The two-page grammar goal forces discipline. Every construct must earn its complexity budget.

The repository structure follows established patterns from successful language projects (Rust, Swift, Zig), ensuring smooth upstream integration. The Makefile provides standard GNU-compatible targets while adding language-specific tooling.

Ship small. Ship correct. Iterate from solid foundation.
