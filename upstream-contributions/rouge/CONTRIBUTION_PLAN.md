# Rouge Contribution Plan for Ruchy Language

## Language Overview
- **Name**: Ruchy
- **Extensions**: `.rhy`, `.ruchy`
- **Category**: Systems programming language
- **Key Features**: Actor model, pipeline operators, Rust-like syntax

## Contribution Strategy

### 1. Rouge Requirements Met ✅
- **Original lexer**: Created from scratch, not copied
- **Follows Rouge patterns**: Uses Rouge::RegexLexer base class
- **Comprehensive**: Covers all Ruchy language features
- **Tested**: Includes test files and fixtures

### 2. Unique Ruchy Features Highlighted
- **Actor keywords**: `actor`, `spawn`, `send` with special highlighting
- **Pipeline operator**: `>>` with distinct coloring
- **Actor operators**: `<-` (send) and `<?` (ask)
- **Modern syntax**: Similar to Rust but with actor model extensions

### 3. Implementation Quality
- **Well-documented**: Extensive comments explaining language features
- **Performance optimized**: Efficient regex patterns
- **Error handling**: Graceful handling of edge cases
- **SATD detection**: Highlights technical debt comments

## Files to Submit

### Core Implementation
1. **`lib/rouge/lexers/ruchy.rb`** - Main lexer implementation
2. **`spec/lexers/ruchy_spec.rb`** - Test suite
3. **`spec/visual/samples/ruchy`** - Visual test samples

### Documentation
4. **Language demo file** - Comprehensive example showing all features
5. **Test fixtures** - Multiple example files covering edge cases

## Submission Approach

### Phase 1: Initial PR
- Submit complete lexer implementation
- Include basic tests and documentation
- Request feedback on language patterns

### Phase 2: Refinement
- Address maintainer feedback
- Add additional test cases if needed
- Optimize performance based on suggestions

### Phase 3: Integration
- Update Rouge's language list
- Add to CI/CD pipeline
- Celebrate! 🎉

## Why This Contribution Matters

1. **Growing Language**: Ruchy represents modern systems programming trends
2. **Unique Features**: Actor model integration is increasingly relevant
3. **Educational Value**: Good example of language evolution
4. **Community Service**: Helps early Ruchy adopters with syntax highlighting

This lexer will enable syntax highlighting for Ruchy code on:
- GitHub and GitLab (via Rouge)
- Jekyll blogs and documentation sites
- Any Ruby application using Rouge
- Static site generators