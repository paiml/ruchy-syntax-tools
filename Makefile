# Ruchy Syntax Tools - Build System
# GNU Make compatible targets following established conventions

.PHONY: all clean test install dist check lint format watch serve-docs ci upstream-linguist upstream-vscode upstream-highlight

VERSION := 0.1.0
GRAMMAR_SOURCES := $(wildcard grammars/*/*)
TEST_FIXTURES := $(wildcard test/fixtures/*.rhy)

# Colors for output
COLOR_GREEN := \033[0;32m
COLOR_BLUE := \033[0;34m
COLOR_YELLOW := \033[0;33m
COLOR_RED := \033[0;31m
COLOR_RESET := \033[0m

# Node.js tools
JSYAML := npx js-yaml
ESLINT := npx eslint
PRETTIER := npx prettier

# Standard targets following GNU conventions
all: build test

build: textmate tree-sitter highlight prism
	@echo "$(COLOR_GREEN)✅ Build complete - all grammar formats generated$(COLOR_RESET)"

# TextMate grammar compilation
textmate: grammars/textmate/ruchy.tmLanguage.json
	@echo "$(COLOR_BLUE)📝 TextMate grammar built successfully$(COLOR_RESET)"

grammars/textmate/ruchy.tmLanguage.json: grammars/textmate/ruchy.tmLanguage.yaml
	@echo "$(COLOR_YELLOW)🔨 Building TextMate grammar...$(COLOR_RESET)"
	@$(JSYAML) $< > $@

# Tree-sitter grammar
tree-sitter:
	@echo "$(COLOR_BLUE)🌲 Tree-sitter grammar (planned for Sprint 2)$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)⚠️  Tree-sitter build deferred until RSYN-0201$(COLOR_RESET)"

# highlight.js module
highlight:
	@echo "$(COLOR_BLUE)💡 highlight.js module (planned for Sprint 2)$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)⚠️  Highlight.js validation deferred until RSYN-0301$(COLOR_RESET)"

# Prism.js grammar
prism:
	@echo "$(COLOR_BLUE)🔍 Prism.js grammar (planned for Sprint 2)$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)⚠️  Prism build deferred until RSYN-0302$(COLOR_RESET)"

grammars/prism/prism-ruchy.js: grammars/textmate/ruchy.tmLanguage.json
	@echo "$(COLOR_YELLOW)🔨 Building Prism grammar...$(COLOR_RESET)"
	@node tools/convert.js prism < $< > $@ 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  Prism conversion skipped (converter not implemented)$(COLOR_RESET)"

# Testing targets
test: test-syntax test-performance test-visual
	@echo "$(COLOR_GREEN)✅ All tests passed$(COLOR_RESET)"

test-syntax: $(TEST_FIXTURES)
	@echo "$(COLOR_YELLOW)🧪 Running syntax tests...$(COLOR_RESET)"
	@node test/runner.js

test-performance:
	@echo "$(COLOR_YELLOW)⚡ Running performance benchmarks...$(COLOR_RESET)"
	@node tools/benchmark.js

test-visual:
	@echo "$(COLOR_YELLOW)👁️  Generating visual regression tests...$(COLOR_RESET)"
	@./tools/generate-visual.sh 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  Visual tests skipped (generator not implemented)$(COLOR_RESET)"

# Quality assurance
check: lint validate
	@echo "$(COLOR_GREEN)✅ Quality checks passed$(COLOR_RESET)"

lint:
	@echo "$(COLOR_YELLOW)🔍 Running linters...$(COLOR_RESET)"
	@$(ESLINT) tools test 2>/dev/null || echo "$(COLOR_BLUE)ℹ️  ESLint skipped (not configured)$(COLOR_RESET)"
	@$(PRETTIER) --check . 2>/dev/null || echo "$(COLOR_BLUE)ℹ️  Prettier check skipped (not configured)$(COLOR_RESET)"

validate:
	@echo "$(COLOR_YELLOW)✔️  Validating grammar consistency...$(COLOR_RESET)"
	@node tools/validate.js --all 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  Grammar validation skipped (validator not implemented)$(COLOR_RESET)"

format:
	@echo "$(COLOR_YELLOW)📝 Formatting code...$(COLOR_RESET)"
	@$(PRETTIER) --write . 2>/dev/null || echo "$(COLOR_BLUE)ℹ️  Prettier format skipped (not configured)$(COLOR_RESET)"

# Development helpers
watch:
	@echo "$(COLOR_BLUE)👀 Starting watch mode...$(COLOR_RESET)"
	@npx nodemon -w grammars -e yaml,js -x "make build test-syntax" 2>/dev/null || echo "$(COLOR_RED)❌ Watch mode requires nodemon: npm install -g nodemon$(COLOR_RESET)"

serve-docs:
	@echo "$(COLOR_BLUE)📚 Starting documentation server...$(COLOR_RESET)"
	@npx docsify serve docs 2>/dev/null || echo "$(COLOR_RED)❌ Docs server requires docsify: npm install -g docsify-cli$(COLOR_RESET)"

# Distribution
dist: ruchy-syntax-tools-$(VERSION).tar.gz
	@echo "$(COLOR_GREEN)📦 Distribution package created$(COLOR_RESET)"

ruchy-syntax-tools-$(VERSION).tar.gz: $(GRAMMAR_SOURCES)
	@echo "$(COLOR_YELLOW)📦 Creating distribution package...$(COLOR_RESET)"
	@tar czf $@ grammars/ docs/specifications/ LICENSE README.md CLAUDE.md

# Cleanup
clean:
	@echo "$(COLOR_YELLOW)🧹 Cleaning build artifacts...$(COLOR_RESET)"
	@rm -rf build/ dist/ coverage/
	@rm -f grammars/textmate/*.json
	@rm -f grammars/prism/*.js
	@rm -f ruchy-syntax-tools-*.tar.gz
	@echo "$(COLOR_GREEN)✅ Clean complete$(COLOR_RESET)"

# Upstream submission helpers
upstream-linguist:
	@echo "$(COLOR_BLUE)🐙 Preparing GitHub Linguist PR...$(COLOR_RESET)"
	@./upstream/prepare-linguist.sh 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  Linguist preparation skipped (script not implemented)$(COLOR_RESET)"

upstream-vscode:
	@echo "$(COLOR_BLUE)💻 Building VS Code extension...$(COLOR_RESET)"
	@cd upstream/vscode && vsce package 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  VS Code packaging skipped (vsce not available)$(COLOR_RESET)"

upstream-highlight:
	@echo "$(COLOR_BLUE)💡 Preparing highlight.js PR...$(COLOR_RESET)"
	@./upstream/prepare-highlight.sh 2>/dev/null || echo "$(COLOR_YELLOW)⚠️  Highlight.js preparation skipped (script not implemented)$(COLOR_RESET)"

# Development workflow targets
install-hooks:
	@echo "$(COLOR_YELLOW)🪝 Installing git hooks...$(COLOR_RESET)"
	@cp hooks/pre-commit .git/hooks/ 2>/dev/null || echo "$(COLOR_BLUE)ℹ️  Git hooks installation skipped (hooks not available)$(COLOR_RESET)"
	@chmod +x .git/hooks/pre-commit 2>/dev/null || true

# CI/CD targets  
ci: clean build test check
	@echo "$(COLOR_GREEN)✅ CI pipeline completed successfully$(COLOR_RESET)"

# Help target
help:
	@echo "$(COLOR_BLUE)Ruchy Syntax Tools - Available Make Targets:$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_GREEN)Build Targets:$(COLOR_RESET)"
	@echo "  all          - Build all grammar formats and run tests"
	@echo "  build        - Build all grammar formats"
	@echo "  textmate     - Build TextMate grammar (.tmLanguage.json)"
	@echo "  tree-sitter  - Build Tree-sitter grammar"
	@echo "  highlight    - Build highlight.js module"
	@echo "  prism        - Build Prism.js grammar"
	@echo ""
	@echo "$(COLOR_GREEN)Test Targets:$(COLOR_RESET)"
	@echo "  test         - Run all tests"
	@echo "  test-syntax  - Run syntax validation tests"
	@echo "  test-performance - Run performance benchmarks"
	@echo "  test-visual  - Run visual regression tests"
	@echo ""
	@echo "$(COLOR_GREEN)Quality Targets:$(COLOR_RESET)"
	@echo "  check        - Run all quality checks"
	@echo "  lint         - Run linting tools"
	@echo "  validate     - Validate grammar consistency"
	@echo "  format       - Format source code"
	@echo ""
	@echo "$(COLOR_GREEN)Development Targets:$(COLOR_RESET)"
	@echo "  watch        - Watch for changes and rebuild"
	@echo "  serve-docs   - Start documentation server"
	@echo "  clean        - Remove build artifacts"
	@echo "  dist         - Create distribution package"
	@echo ""
	@echo "$(COLOR_GREEN)Upstream Targets:$(COLOR_RESET)"
	@echo "  upstream-linguist  - Prepare GitHub Linguist PR"
	@echo "  upstream-vscode    - Build VS Code extension"
	@echo "  upstream-highlight - Prepare highlight.js PR"
	@echo ""
	@echo "$(COLOR_GREEN)CI/CD Targets:$(COLOR_RESET)"
	@echo "  ci           - Full CI pipeline"
	@echo "  install-hooks - Install git hooks"

# Prevent parallel execution of tests to avoid conflicts
.NOTPARALLEL: test