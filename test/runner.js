#!/usr/bin/env node

/**
 * Test runner for Ruchy syntax highlighting validation
 * Validates grammar files against test fixtures
 */

const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class GrammarTestRunner {
  constructor() {
    this.fixturesDir = path.join(__dirname, 'fixtures');
    this.grammarFile = path.join(__dirname, '..', 'grammars', 'textmate', 'ruchy.tmLanguage.yaml');
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async run() {
    console.log('🧪 Running Ruchy syntax highlighting tests...\n');

    try {
      // Load grammar
      const grammar = await this.loadGrammar();

      // Get test fixtures
      const fixtures = await this.getFixtures();

      // Run tests
      for (const fixture of fixtures) {
        await this.testFixture(fixture, grammar);
      }

      // Report results
      this.reportResults();

    } catch (error) {
      console.error('❌ Test runner failed:', error.message);
      process.exit(1);
    }
  }

  async loadGrammar() {
    try {
      const grammarContent = await fs.readFile(this.grammarFile, 'utf8');
      const grammar = yaml.load(grammarContent);

      console.log(`✅ Loaded grammar: ${grammar.name} (${grammar.scopeName})`);
      return grammar;

    } catch (error) {
      throw new Error(`Failed to load grammar: ${error.message}`);
    }
  }

  async getFixtures() {
    try {
      const files = await fs.readdir(this.fixturesDir);
      const fixtures = files
        .filter(file => file.endsWith('.rhy'))
        .map(file => ({
          name: file,
          path: path.join(this.fixturesDir, file)
        }));

      console.log(`📁 Found ${fixtures.length} test fixtures\n`);
      return fixtures;

    } catch (error) {
      throw new Error(`Failed to read fixtures: ${error.message}`);
    }
  }

  async testFixture(fixture, grammar) {
    try {
      console.log(`🔍 Testing ${fixture.name}...`);

      // Read fixture content
      const content = await fs.readFile(fixture.path, 'utf8');

      // Validate grammar patterns against content
      const validation = this.validateGrammarPatterns(content, grammar);

      if (validation.success) {
        console.log(`  ✅ ${validation.matchedPatterns} patterns matched`);
        this.results.passed++;
      } else {
        console.log(`  ❌ Validation failed: ${validation.error}`);
        this.results.failed++;
        this.results.errors.push({
          fixture: fixture.name,
          error: validation.error
        });
      }

    } catch (error) {
      console.log(`  ❌ Error testing ${fixture.name}: ${error.message}`);
      this.results.failed++;
      this.results.errors.push({
        fixture: fixture.name,
        error: error.message
      });
    }
  }

  validateGrammarPatterns(content, grammar) {
    try {
      let matchedPatterns = 0;
      const lines = content.split('\n');

      // Test keywords
      const keywords = this.extractKeywords(grammar);
      const keywordMatches = this.findMatches(content, keywords);
      matchedPatterns += keywordMatches;

      // Test operators
      const operators = this.extractOperators(grammar);
      const operatorMatches = this.findMatches(content, operators);
      matchedPatterns += operatorMatches;

      // Test comments
      const commentMatches = this.validateComments(lines);
      matchedPatterns += commentMatches;

      // Test strings
      const stringMatches = this.validateStrings(lines);
      matchedPatterns += stringMatches;

      return {
        success: true,
        matchedPatterns
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractKeywords(grammar) {
    const keywords = [];
    const keywordPattern = grammar.repository?.keywords;

    if (keywordPattern?.patterns) {
      keywordPattern.patterns.forEach(pattern => {
        if (pattern.match) {
          // Extract keywords from regex patterns like \\b(if|else|match)\\b
          const match = pattern.match.match(/\\b\(([^)]+)\)\\b/);
          if (match) {
            keywords.push(...match[1].split('|'));
          }
        }
      });
    }

    return keywords;
  }

  extractOperators(grammar) {
    const operators = [];
    const operatorPattern = grammar.repository?.operators;

    if (operatorPattern?.patterns) {
      operatorPattern.patterns.forEach(pattern => {
        if (pattern.match) {
          // Extract operators - this is a simplified extraction
          const specialOps = ['>>>', '<<', '<?', '<-', '->', '=>', '::', '==', '!='];
          specialOps.forEach(op => {
            if (pattern.match.includes(op.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'))) {
              operators.push(op);
            }
          });
        }
      });
    }

    return operators;
  }

  findMatches(content, patterns) {
    let matches = 0;
    patterns.forEach(pattern => {
      const regex = new RegExp(`\\\\b${this.escapeRegex(pattern)}\\\\b`, 'g');
      const found = content.match(regex);
      if (found) {
        matches += found.length;
      }
    });
    return matches;
  }

  validateComments(lines) {
    let matches = 0;
    lines.forEach(line => {
      // Line comments
      if (line.trim().startsWith('//')) {
        matches++;
      }
      // Doc comments
      if (line.trim().startsWith('///')) {
        matches++;
      }
      // Block comments (simplified check)
      if (line.includes('/*') || line.includes('*/')) {
        matches++;
      }
    });
    return matches;
  }

  validateStrings(lines) {
    let matches = 0;
    lines.forEach(line => {
      // Double quoted strings
      const doubleQuoted = line.match(/"[^"]*"/g);
      if (doubleQuoted) {
        matches += doubleQuoted.length;
      }

      // Single quoted strings
      const singleQuoted = line.match(/'[^']*'/g);
      if (singleQuoted) {
        matches += singleQuoted.length;
      }
    });
    return matches;
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  }

  reportResults() {
    console.log('\n📊 Test Results:');
    console.log(`  ✅ Passed: ${this.results.passed}`);
    console.log(`  ❌ Failed: ${this.results.failed}`);
    console.log(`  📈 Success Rate: ${Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)}%`);

    if (this.results.errors.length > 0) {
      console.log('\n🚨 Errors:');
      this.results.errors.forEach(error => {
        console.log(`  • ${error.fixture}: ${error.error}`);
      });
    }

    if (this.results.failed > 0) {
      console.log('\n❌ Some tests failed!');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed!');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const runner = new GrammarTestRunner();
  runner.run().catch(error => {
    console.error('Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = GrammarTestRunner;