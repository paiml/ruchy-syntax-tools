# Contributing to Ruchy Syntax Tools

Thank you for your interest in contributing to Ruchy Syntax Tools! This project maintains **extreme quality standards** - all contributions must meet our rigorous requirements.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Quality Requirements](#quality-requirements)
5. [Submission Guidelines](#submission-guidelines)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

## Code of Conduct

We are committed to fostering a welcoming and inclusive community. All contributors must:
- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints

## Getting Started

### Prerequisites

- Node.js ≥16.0.0
- npm ≥7.0.0
- Git
- Make
- ESLint and Prettier extensions for your editor

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ruchy-syntax-tools.git
   cd ruchy-syntax-tools
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up git hooks:
   ```bash
   make install-hooks
   ```

5. Verify setup:
   ```bash
   npm run validate
   ./scripts/verify-deployment.sh
   ```

## Development Process

### 1. Create an Issue

Before starting work:
- Check existing issues
- Create a new issue describing your proposed change
- Wait for maintainer approval
- Reference the issue in your PR

### 2. Branch Strategy

```bash
# Create feature branch
git checkout -b feature/RSYN-XXXX-description

# For bugs
git checkout -b fix/RSYN-XXXX-description

# For documentation
git checkout -b docs/RSYN-XXXX-description
```

### 3. Development Workflow

1. **Plan**: Create a task list using RSYN-XXXX ticket format
2. **Implement**: Write code following our standards
3. **Test**: Ensure ≥80% coverage
4. **Validate**: Run quality checks
5. **Document**: Update relevant documentation
6. **Submit**: Create PR with all checks passing

## Quality Requirements

### ⚠️ MANDATORY - Zero Tolerance Policy

All contributions MUST meet these requirements:

| Requirement | Target | Command |
|------------|--------|---------|
| **Test Coverage** | ≥80% | `npm run coverage` |
| **Lint Warnings** | 0 | `npm run lint` |
| **Format Check** | Pass | `npm run format:check` |
| **Complexity** | ≤20 | Via ESLint |
| **Performance** | <25ms | `npm run benchmark` |
| **All Tests** | Pass | `npm test` |

### Pre-Commit Checklist

Before EVERY commit:

```bash
# Run full validation
npm run validate

# Check deployment readiness
./scripts/verify-deployment.sh

# Ensure quality gates pass
make check
```

## Submission Guidelines

### Pull Request Process

1. **Title Format**: `[RSYN-XXXX] Brief description`
2. **Description**: Use PR template
3. **Size**: Keep PRs small and focused
4. **Tests**: Include tests for new features
5. **Documentation**: Update docs as needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Grammar improvement
- [ ] Documentation update

## Related Issue
Fixes #RSYN-XXXX

## Testing
- [ ] All tests pass
- [ ] Coverage ≥80%
- [ ] Performance <25ms
- [ ] Zero lint warnings

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] CHANGELOG.md updated
```

## Coding Standards

### JavaScript Style

```javascript
// GOOD - Clear, simple, documented
/**
 * Process grammar patterns
 * @param {Object} grammar - Grammar object
 * @returns {Array} Processed patterns
 */
function processPatterns(grammar) {
  if (!grammar || !grammar.patterns) {
    return [];
  }
  
  return grammar.patterns.map(pattern => ({
    ...pattern,
    processed: true
  }));
}

// BAD - Complex, undocumented
function proc(g) {
  return g?.patterns?.map(p => ({...p, processed: true})) || [];
}
```

### Grammar Pattern Standards

```yaml
# GOOD - Clear, maintainable
- name: keyword.control.ruchy
  match: \b(if|else|match|for|while)\b
  
# BAD - Overly complex
- match: \b(if|else|match|for|while|loop|break|continue|return|yield|await|async)\b
```

### Commit Messages

```bash
# Format
[RSYN-XXXX] type: description

# Examples
[RSYN-0101] feat: Add pipeline operator highlighting
[RSYN-0102] fix: Correct string interpolation regex
[RSYN-0103] docs: Update installation instructions
[RSYN-0104] test: Add actor syntax test cases
[RSYN-0105] perf: Optimize pattern matching
```

## Testing Requirements

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should handle normal case', () => {
    // Arrange
    const input = prepareInput();
    
    // Act
    const result = processInput(input);
    
    // Assert
    assert.strictEqual(result, expected);
  });

  it('should handle edge case', () => {
    // Test edge cases
  });

  it('should handle error case', () => {
    // Test error handling
  });
});
```

### Coverage Requirements

Every PR must maintain or improve coverage:

```bash
# Check coverage
npm run coverage

# Required minimums
Statements: ≥80%
Branches: ≥80%
Functions: ≥80%
Lines: ≥80%
```

### Performance Testing

For grammar changes:

```bash
# Run benchmarks
npm run benchmark

# Must maintain
Average: <25ms for 50K lines
No regression from baseline
```

## Documentation

### Required Documentation

1. **Code Comments**: All non-trivial functions
2. **API Documentation**: JSDoc for public APIs
3. **README Updates**: For new features
4. **CHANGELOG**: For all changes

### Documentation Style

```javascript
/**
 * Brief description (one line)
 * 
 * Detailed description if needed (optional)
 * 
 * @param {Type} name - Description
 * @returns {Type} Description
 * @throws {Error} When and why
 * 
 * @example
 * const result = functionName(input);
 */
```

## Grammar Contributions

### Adding Language Features

1. Update specification: `docs/specifications/ruchy-highlighting-spec.md`
2. Add patterns to: `grammars/textmate/ruchy.tmLanguage.yaml`
3. Update Tree-sitter: `grammars/tree-sitter/grammar.js`
4. Update web grammars: `grammars/highlight/` and `grammars/prism/`
5. Add test fixtures: `test/fixtures/`
6. Update VS Code snippets: `upstream/vscode/snippets/`

### Pattern Guidelines

- Use non-capturing groups when possible: `(?:...)`
- Avoid backtracking: Use atomic groups `(?>...)`
- Test with large files (50K+ lines)
- Document complex patterns
- Include test cases

## Review Process

### Review Criteria

PRs are reviewed for:

1. **Correctness**: Does it work as intended?
2. **Quality**: Meets all quality gates?
3. **Performance**: No regression?
4. **Tests**: Adequate coverage?
5. **Documentation**: Clear and complete?
6. **Style**: Follows conventions?

### Review Timeline

- Initial review: Within 48 hours
- Follow-up: Within 24 hours of changes
- Merge: After 2 approvals

## Getting Help

### Resources

- [Project Documentation](docs/)
- [Language Specification](docs/specifications/ruchy-highlighting-spec.md)
- [Issue Tracker](https://github.com/ruchy-lang/ruchy-syntax-tools/issues)
- [Discord Community](https://discord.gg/ruchy)

### Contact

- **General Questions**: Create an issue
- **Security Issues**: security@ruchy-lang.org
- **Direct Help**: Discord #syntax-tools channel

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project website

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Ruchy Syntax Tools! Your efforts help make Ruchy development better for everyone.

**Remember: Quality is not negotiable. Every contribution must meet our extreme quality standards.**