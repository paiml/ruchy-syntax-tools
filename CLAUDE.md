# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository implements syntax highlighting support for the Ruchy programming language across multiple editors and platforms. Following a lean MVP approach, we focus on correctness, performance, and broad platform compatibility.

## Repository Structure

```
ruchy-syntax-tools/
├── docs/
│   ├── execution/
│   │   ├── roadmap.md            # Human-readable roadmap
│   │   └── roadmap.yaml          # Machine-readable PDMT config
│   └── specifications/
│       └── ruchy-highlighting-spec.md
├── grammars/
│   ├── textmate/                 # VS Code, Sublime, etc.
│   ├── tree-sitter/              # GitHub, Neovim, etc.
│   ├── highlight.js/             # Web highlighting
│   └── prism/                    # Documentation sites
├── test/
│   ├── fixtures/                 # Sample .rhy files
│   └── snapshots/                # Expected highlighting output
├── tools/                        # Validation and conversion
├── upstream/                     # PR staging areas
├── Makefile                      # Build automation
├── pmat.toml                     # Quality gates config
└── CLAUDE.md                     # This file
```

## Task Management System

### Ticket ID Format
- **Pattern**: `RSYN-XXXX` (4-digit zero-padded)
- **Example**: `RSYN-0001`, `RSYN-0150`
- **Semantic Ranges**:
  - `0001-0099`: Foundation & Infrastructure  
  - `0100-0199`: TextMate Grammar
  - `0200-0299`: Tree-sitter Grammar
  - `0300-0399`: Web Grammars (highlight.js, Prism)
  - `0400-0499`: Quality & Testing
  - `0500-0599`: Upstream Integration

### Priority Levels
- **P0**: Critical - blocks release/milestone
- **P1**: High - core functionality  
- **P2**: Medium - nice-to-have features

### Task Status Icons
- 📋 **PLANNED** - Not started
- 🚧 **IN PROGRESS** - Currently working
- ✅ **COMPLETED** - Done and validated
- 🚫 **BLOCKED** - Cannot proceed  
- ⏸️ **DEFERRED** - Postponed

## Development Commands

### Core Build Targets
```bash
make build          # Build all grammar formats
make test           # Run syntax and performance tests  
make check          # Validate grammar consistency
make lint           # Run linters (ESLint, Prettier)
make format         # Auto-format code
make clean          # Remove build artifacts
```

### Development Workflow
```bash
make watch          # Watch for changes and rebuild
make serve-docs     # Start documentation server
make install-hooks  # Install git hooks
make ci             # Full CI pipeline
```

### Upstream Targets  
```bash
make upstream-linguist   # Prepare GitHub Linguist PR
make upstream-vscode     # Build VS Code extension
make upstream-highlight  # Prepare highlight.js PR
```

## Quality Gates (EXTREME QUALITY ENFORCEMENT)

### MANDATORY Quality Requirements
- **Test Coverage**: ≥80% (STRICT REQUIREMENT)
- **Lint Compliance**: 100% pass rate (ZERO WARNINGS)
- **PMAT Tool**: MUST PASS all quality gates
- **Cyclomatic Complexity**: ≤20 per function (Toyota Way)
- **Build Warnings**: 0 tolerance
- **SATD Comments**: 0 tolerance

### Performance Requirements
- **Highlight Latency**: ≤25ms for 50K line files
- **Memory Usage**: ≤5MB peak consumption
- **Grammar Compliance**: 100% with specification
- **Documentation**: Synchronized with code changes

### Quality Validation Commands
```bash
# REQUIRED: Run before ANY commit
make lint           # MUST PASS with 0 warnings
make test           # MUST achieve ≥80% coverage
make check validate # MUST PASS all quality gates

# PMAT quality enforcement
pmat complexity-analysis      # MUST show ≤20 complexity
pmat quality-gate --task-id RSYN-XXXX  # MUST PASS
pmat coverage-report          # MUST show ≥80% coverage
```

### Quality Gate Workflow
1. **Before Starting Work**: Run `make clean && make build`
2. **During Development**: Run `make watch` for continuous validation
3. **Before Committing**: 
   - `make lint` - MUST have 0 warnings/errors
   - `make test` - MUST have ≥80% coverage
   - `make check` - MUST pass all validations
   - `pmat quality-gate` - MUST pass PMAT analysis
4. **After Changes**: Update tests to maintain ≥80% coverage

## Language Features (Highlighting Support)

### Core Syntax Elements
- **Keywords**: `fn`, `let`, `struct`, `enum`, `impl`, `trait`, `mod`, `use`, `if`, `else`, `match`, `case`, `for`, `while`, `loop`, `break`, `continue`, `return`
- **Modifiers**: `pub`, `mut`, `async`, `unsafe`
- **Special**: `self`, `Self`, `super`, `as`, `in`, `where`
- **File Extensions**: `.rhy`, `.ruchy`

### Comment Types
- Line comments: `//`
- Block comments: `/* */`
- Doc comments: `///` (line), `/** */` (block)

### Operators (Ruchy-specific)
- **Pipeline**: `>>` (replaces traditional `|>`)
- **Actor Send**: `<-` (message passing)
- **Actor Ask**: `<?` (request-response)
- **Standard**: `+`, `-`, `*`, `/`, `%`, `**`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`, `!`

### Type System
- **Primitives**: `int`, `float`, `bool`, `str`, `char`
- **Result Types**: `Result<T,E>`, `Ok`, `Err`
- **Option Types**: `Option<T>`, `Some`, `None`
- **User Types**: PascalCase naming (`Point`, `Counter`)

## Architecture Principles

### Lean MVP Approach
1. **Grammar Simplicity**: Two-page grammar goal to avoid complexity
2. **Performance First**: 25ms highlight time constraint
3. **Cross-Platform**: Multiple editor/platform support
4. **Quality Driven**: Toyota Way complexity limits (≤20)

### Development Methodology
- **Sprint-based**: 1-week iterations with clear deliverables
- **Quality Gates**: Automated validation on every task
- **Documentation Sync**: Code changes must update docs
- **Community Focus**: Upstream integration as success metric

## Current Sprint Status

Check `docs/execution/roadmap.md` for current sprint details and task progress. All tickets follow the `RSYN-XXXX` format with clear acceptance criteria and quality gate requirements.

## Getting Started

1. **Setup**: `make install-hooks` to configure git hooks
2. **Build**: `make build` to compile all grammars  
3. **Test**: `make test` to validate functionality
4. **Quality**: `make check` to run quality gates
5. **Watch**: `make watch` for development mode

For task-specific work, always update the roadmap status when starting/completing tickets.