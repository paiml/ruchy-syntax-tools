/**
 * Ruchy Syntax Tools
 * Main entry point for the NPM package
 *
 * Provides access to all grammar implementations and utilities
 */

const fs = require('fs');
const path = require('path');

/**
 * Load a grammar file
 * @param {string} grammarPath - Path to the grammar file
 * @returns {Object|string} The grammar content
 */
function loadGrammar(grammarPath) {
  const fullPath = path.join(__dirname, grammarPath);
  const content = fs.readFileSync(fullPath, 'utf8');

  if (grammarPath.endsWith('.json')) {
    return JSON.parse(content);
  }

  return content;
}

/**
 * Ruchy Syntax Tools API
 */
const RuchySyntaxTools = {
  /**
   * Get the TextMate grammar
   * @returns {Object} TextMate grammar object
   */
  getTextMateGrammar() {
    return loadGrammar('grammars/textmate/ruchy.tmLanguage.json');
  },

  /**
   * Get the Tree-sitter grammar
   * @returns {string} Tree-sitter grammar.js content
   */
  getTreeSitterGrammar() {
    return loadGrammar('grammars/tree-sitter/grammar.js');
  },

  /**
   * Get the highlight.js language module
   * @returns {string} highlight.js module content
   */
  getHighlightJsGrammar() {
    return loadGrammar('grammars/highlight/ruchy.js');
  },

  /**
   * Get the Prism.js language definition
   * @returns {string} Prism.js grammar content
   */
  getPrismGrammar() {
    return loadGrammar('grammars/prism/prism-ruchy.js');
  },

  /**
   * Get the Monaco Editor language definition
   * @returns {string} Monaco Editor grammar content
   */
  getMonacoGrammar() {
    return loadGrammar('grammars/monaco/ruchy.js');
  },

  /**
   * Get the LSP server path
   * @returns {string} Path to LSP server script
   */
  getLspServer() {
    return path.join(__dirname, 'lsp', 'ruchy-lsp-server.js');
  },

  /**
   * Get the CodeMirror 6 language definition
   * @returns {string} CodeMirror 6 language module content
   */
  getCodeMirrorGrammar() {
    return loadGrammar('grammars/codemirror/ruchy.js');
  },

  /**
   * Get the Rouge lexer for GitHub/GitLab
   * @returns {string} Rouge lexer Ruby file content
   */
  getRougeGrammar() {
    return loadGrammar('grammars/rouge/ruchy.rb');
  },

  /**
   * Get the Pygments lexer for Python tools
   * @returns {string} Pygments lexer Python file content
   */
  getPygmentsGrammar() {
    return loadGrammar('grammars/pygments/ruchy.py');
  },

  /**
   * Get the VS Code extension path
   * @returns {string} Path to VS Code extension VSIX file
   */
  getVsCodeExtension() {
    return path.join(__dirname, 'vscode-extension', 'ruchy-1.2.0.vsix');
  },

  /**
   * Get language metadata
   * @returns {Object} Language metadata
   */
  getLanguageInfo() {
    return {
      name: 'Ruchy',
      aliases: ['rhy', 'ruchy'],
      extensions: ['.rhy', '.ruchy'],
      mimeTypes: ['text/x-ruchy', 'application/x-ruchy'],
      firstLine: '^#!/.*\\bruchy\\b',
      scopeName: 'source.ruchy',
      color: '#CE422B',
      aceMode: 'rust',
      codemirrorMode: 'rust',
      features: {
        comments: {
          lineComment: '//',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')'],
          ['<', '>']
        ],
        operators: {
          pipeline: '>>',
          actorSend: '<-',
          actorAsk: '<?'
        }
      }
    };
  },

  /**
   * Get test fixtures
   * @returns {Array} Array of test fixture objects
   */
  getTestFixtures() {
    const fixturesDir = path.join(__dirname, 'test', 'fixtures');
    const files = fs.readdirSync(fixturesDir);

    return files
      .filter(f => f.endsWith('.rhy'))
      .map(file => ({
        name: file,
        content: fs.readFileSync(path.join(fixturesDir, file), 'utf8')
      }));
  },

  /**
   * Validate a grammar against test fixtures
   * @param {string} grammarType - Type of grammar to validate
   * @returns {Object} Validation results
   */
  async validateGrammar(grammarType = 'textmate') {
    const fixtures = this.getTestFixtures();
    const results = {
      passed: 0,
      failed: 0,
      errors: []
    };

    for (const fixture of fixtures) {
      try {
        // Simple validation - check that grammar can be loaded
        switch (grammarType) {
          case 'textmate':
            const tmGrammar = this.getTextMateGrammar();
            if (tmGrammar && tmGrammar.patterns) {
              results.passed++;
            } else {
              results.failed++;
              results.errors.push(`Invalid TextMate grammar for ${fixture.name}`);
            }
            break;

          case 'treesitter':
            const tsGrammar = this.getTreeSitterGrammar();
            if (tsGrammar && tsGrammar.includes('module.exports')) {
              results.passed++;
            } else {
              results.failed++;
              results.errors.push(`Invalid Tree-sitter grammar for ${fixture.name}`);
            }
            break;

          default:
            results.failed++;
            results.errors.push(`Unknown grammar type: ${grammarType}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error validating ${fixture.name}: ${error.message}`);
      }
    }

    return results;
  },

  /**
   * Get quality metrics
   * @returns {Object} Quality metrics from package.json
   */
  getQualityMetrics() {
    const pkg = require('./package.json');
    return pkg.quality || {
      coverage: { threshold: 80 },
      complexity: { max: 20 },
      performance: { target: 25 }
    };
  },

  /**
   * Export all grammars to a directory
   * @param {string} outputDir - Directory to export grammars to
   */
  exportGrammars(outputDir) {
    const grammars = {
      'ruchy.tmLanguage.json': this.getTextMateGrammar(),
      'grammar.js': this.getTreeSitterGrammar(),
      'ruchy.hljs.js': this.getHighlightJsGrammar(),
      'prism-ruchy.js': this.getPrismGrammar(),
      'monaco-ruchy.js': this.getMonacoGrammar(),
      'codemirror-ruchy.js': this.getCodeMirrorGrammar(),
      'rouge-ruchy.rb': this.getRougeGrammar(),
      'pygments-ruchy.py': this.getPygmentsGrammar()
    };

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [filename, content] of Object.entries(grammars)) {
      const outputPath = path.join(outputDir, filename);
      const data = typeof content === 'object'
        ? JSON.stringify(content, null, 2)
        : content;

      fs.writeFileSync(outputPath, data, 'utf8');
      console.log(`Exported: ${outputPath}`);
    }
  }
};

// Export for CommonJS
module.exports = RuchySyntaxTools;

// Also export individual functions for convenience
module.exports.getTextMateGrammar = RuchySyntaxTools.getTextMateGrammar;
module.exports.getTreeSitterGrammar = RuchySyntaxTools.getTreeSitterGrammar;
module.exports.getHighlightJsGrammar = RuchySyntaxTools.getHighlightJsGrammar;
module.exports.getPrismGrammar = RuchySyntaxTools.getPrismGrammar;
module.exports.getMonacoGrammar = RuchySyntaxTools.getMonacoGrammar;
module.exports.getCodeMirrorGrammar = RuchySyntaxTools.getCodeMirrorGrammar;
module.exports.getRougeGrammar = RuchySyntaxTools.getRougeGrammar;
module.exports.getPygmentsGrammar = RuchySyntaxTools.getPygmentsGrammar;
module.exports.getVsCodeExtension = RuchySyntaxTools.getVsCodeExtension;
module.exports.getLspServer = RuchySyntaxTools.getLspServer;
module.exports.getLanguageInfo = RuchySyntaxTools.getLanguageInfo;
module.exports.getTestFixtures = RuchySyntaxTools.getTestFixtures;
module.exports.validateGrammar = RuchySyntaxTools.validateGrammar;
module.exports.getQualityMetrics = RuchySyntaxTools.getQualityMetrics;
module.exports.exportGrammars = RuchySyntaxTools.exportGrammars;