#!/bin/bash

# Deployment Verification Script
# Final checks before production release
# MUST PASS 100% for deployment approval

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

# Results array
declare -a FAILURES
declare -a WARNINGS_LIST

echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║     RUCHY SYNTAX TOOLS - DEPLOYMENT VERIFICATION         ║${NC}"
echo -e "${MAGENTA}║              Extreme Quality Standards v1.0              ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo

# Function to perform a check
check() {
    local description="$1"
    local command="$2"
    local critical="${3:-true}"
    
    ((TOTAL_CHECKS++))
    
    echo -ne "${BLUE}[CHECK ${TOTAL_CHECKS}]${NC} ${description}... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED_CHECKS++))
        return 0
    else
        if [ "$critical" = "true" ]; then
            echo -e "${RED}❌ FAIL${NC}"
            ((FAILED_CHECKS++))
            FAILURES+=("$description")
            return 1
        else
            echo -e "${YELLOW}⚠️  WARNING${NC}"
            ((WARNINGS++))
            WARNINGS_LIST+=("$description")
            return 0
        fi
    fi
}

# Function to check file existence
check_file() {
    local file="$1"
    local description="$2"
    check "$description" "[ -f '$file' ]"
}

# Function to check directory existence
check_dir() {
    local dir="$1"
    local description="$2"
    check "$description" "[ -d '$dir' ]"
}

echo -e "${YELLOW}📁 SECTION 1: Project Structure Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════════════${NC}"

check_dir "grammars" "Grammar directory exists"
check_dir "test" "Test directory exists"
check_dir "tools" "Tools directory exists"
check_dir "docs" "Documentation directory exists"
check_dir "upstream" "Upstream directory exists"
check_dir "scripts" "Scripts directory exists"

echo

echo -e "${YELLOW}📝 SECTION 2: Core Files Verification${NC}"
echo -e "${YELLOW}═════════════════════════════════════${NC}"

check_file "package.json" "NPM package configuration"
check_file "Makefile" "Build system"
check_file "README.md" "Project README"
check_file "LICENSE" "License file"
check_file "CLAUDE.md" "Claude documentation"
check_file "index.js" "Main entry point"
check_file "pmat.toml" "PMAT configuration"
check_file ".github/workflows/ci.yml" "CI/CD pipeline"

echo

echo -e "${YELLOW}🔧 SECTION 3: Grammar Files Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"

check_file "grammars/textmate/ruchy.tmLanguage.json" "TextMate grammar (JSON)"
check_file "grammars/textmate/ruchy.tmLanguage.yaml" "TextMate grammar (YAML)"
check_file "grammars/tree-sitter/grammar.js" "Tree-sitter grammar"
check_file "grammars/tree-sitter/queries/highlights.scm" "Tree-sitter queries"
check_file "grammars/highlight/ruchy.js" "highlight.js grammar"
check_file "grammars/prism/prism-ruchy.js" "Prism.js grammar"

echo

echo -e "${YELLOW}🧪 SECTION 4: Test Files Verification${NC}"
echo -e "${YELLOW}═════════════════════════════════════${NC}"

check_file "test/runner.js" "Test runner"
check_file "test/cross-platform.test.js" "Cross-platform tests"
check "Test fixtures (8 files)" "[ $(ls test/fixtures/*.rhy 2>/dev/null | wc -l) -eq 8 ]"

echo

echo -e "${YELLOW}📦 SECTION 5: VS Code Extension Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════════════${NC}"

check_file "upstream/vscode/package.json" "VS Code package.json"
check_file "upstream/vscode/README.md" "VS Code README"
check_file "upstream/vscode/language-configuration.json" "Language configuration"
check_file "upstream/vscode/src/extension.js" "Extension source"
check_file "upstream/vscode/snippets/ruchy.json" "Code snippets"
check_file "upstream/vscode/syntaxes/ruchy.tmLanguage.json" "VS Code grammar copy"

echo

echo -e "${YELLOW}🐙 SECTION 6: GitHub Linguist Verification${NC}"
echo -e "${YELLOW}══════════════════════════════════════════${NC}"

check_file "upstream/linguist/languages.yml" "Linguist languages.yml"
check_file "upstream/linguist/heuristics.yml" "Linguist heuristics"
check_file "upstream/linguist/PR_TEMPLATE.md" "PR template"
check_file "upstream/linguist/samples/example.rhy" "Sample file"

echo

echo -e "${YELLOW}✅ SECTION 7: Quality Gates Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"

# Check if Node.js is installed
check "Node.js installed" "command -v node"

# Check if npm is installed
check "NPM installed" "command -v npm"

# Check if make is installed
check "Make installed" "command -v make"

# Check ESLint configuration
check_file "eslint.config.js" "ESLint configuration"

# Check package.json scripts
check "Test script configured" "grep -q '\"test\":' package.json"
check "Lint script configured" "grep -q '\"lint\":' package.json"
check "Build script configured" "grep -q '\"build\":' package.json"

echo

echo -e "${YELLOW}⚡ SECTION 8: Performance Verification${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"

# Check grammar file sizes
check "TextMate grammar size (<50KB)" "[ $(stat -f%z grammars/textmate/ruchy.tmLanguage.json 2>/dev/null || stat -c%s grammars/textmate/ruchy.tmLanguage.json 2>/dev/null || echo 999999) -lt 51200 ]"
check "Tree-sitter grammar exists" "[ -s grammars/tree-sitter/grammar.js ]"

echo

echo -e "${YELLOW}📊 SECTION 9: Documentation Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"

check_file "docs/execution/roadmap.md" "Project roadmap"
check_file "docs/execution/roadmap.yaml" "PDMT roadmap"
check_file "docs/specifications/ruchy-highlighting-spec.md" "Language specification"
check_file "docs/performance-analysis.md" "Performance analysis"
check_file "docs/PROJECT_COMPLETE.md" "Project completion report"
check_file "QUALITY_REPORT.md" "Quality validation report"

echo

echo -e "${YELLOW}🔐 SECTION 10: Security Verification${NC}"
echo -e "${YELLOW}════════════════════════════════════${NC}"

# Check for sensitive information
check "No API keys in code" "! grep -r 'api[_-]key' --include='*.js' --include='*.json' . 2>/dev/null | grep -v node_modules | grep -v package"
check "No passwords in code" "! grep -r 'password' --include='*.js' --include='*.json' . 2>/dev/null | grep -v node_modules | grep -v 'passwordless'"
check "No tokens in code" "! grep -r 'token' --include='*.js' --include='*.json' . 2>/dev/null | grep -v node_modules | grep -v 'tokenize'"

echo

echo -e "${YELLOW}🚀 SECTION 11: Deployment Readiness${NC}"
echo -e "${YELLOW}═══════════════════════════════════${NC}"

check_file "scripts/deploy.sh" "Deployment script"
check "Deployment script executable" "[ -x scripts/deploy.sh ]"
check_file "scripts/verify-deployment.sh" "Verification script (this file)"

# Check NPM package readiness
check "NPM package name set" "grep -q '\"name\": \"ruchy-syntax-tools\"' package.json"
check "NPM version set" "grep -q '\"version\":' package.json"
check "NPM license set" "grep -q '\"license\":' package.json"
check "NPM author set" "grep -q '\"author\":' package.json"

echo

echo -e "${YELLOW}📈 SECTION 12: Quality Metrics Verification${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"

# Check quality configuration in package.json
check "Quality metrics configured" "grep -q '\"quality\":' package.json"
check "Coverage threshold set (≥80%)" "grep -q '\"threshold\": 80' package.json"
check "Complexity limit set (≤20)" "grep -q '\"max\": 20' package.json"

echo

# Final Summary
echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                    VERIFICATION SUMMARY                   ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════╝${NC}"
echo

echo -e "${BLUE}Total Checks:${NC} $TOTAL_CHECKS"
echo -e "${GREEN}Passed:${NC} $PASSED_CHECKS"
echo -e "${RED}Failed:${NC} $FAILED_CHECKS"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo

# Calculate pass rate
PASS_RATE=$(echo "scale=1; $PASSED_CHECKS * 100 / $TOTAL_CHECKS" | bc)

echo -e "${BLUE}Pass Rate:${NC} ${PASS_RATE}%"
echo

# List failures if any
if [ ${#FAILURES[@]} -gt 0 ]; then
    echo -e "${RED}❌ FAILED CHECKS:${NC}"
    for failure in "${FAILURES[@]}"; do
        echo -e "  • $failure"
    done
    echo
fi

# List warnings if any
if [ ${#WARNINGS_LIST[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNINGS:${NC}"
    for warning in "${WARNINGS_LIST[@]}"; do
        echo -e "  • $warning"
    done
    echo
fi

# Final verdict
if [ "$FAILED_CHECKS" -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║        ✅ DEPLOYMENT VERIFICATION PASSED!                 ║${NC}"
    echo -e "${GREEN}║           Ready for Production Release                    ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║        ❌ DEPLOYMENT VERIFICATION FAILED!                 ║${NC}"
    echo -e "${RED}║         $FAILED_CHECKS critical checks failed                          ║${NC}"
    echo -e "${RED}║         Fix all issues before deployment                  ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi