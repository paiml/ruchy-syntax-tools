/**
 * Monaco Editor Language Definition for Ruchy
 * RSYN-0401: Monaco grammar for web-based IDEs
 *
 * @fileoverview Ruchy language support for Monaco Editor (VS Code web)
 * @version 1.0.0
 * @license MIT
 *
 * Quality Requirements:
 * - Test Coverage: ≥80%
 * - Cyclomatic Complexity: ≤20
 * - Performance: <25ms for 50K lines
 */

(function(monaco) {
  'use strict';

  // Guard against missing Monaco
  if (typeof monaco === 'undefined') {
    return;
  }

  /**
   * Ruchy language configuration for Monaco Editor
   * Provides comprehensive language support including syntax highlighting,
   * bracket matching, auto-closing, and intelligent features
   */

  // Language ID registration
  const LANGUAGE_ID = 'ruchy';

  // Register the language
  monaco.languages.register({ id: LANGUAGE_ID });

  // Language configuration
  monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
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
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string', 'comment'] },
      { open: '`', close: '`', notIn: ['string', 'comment'] },
      { open: '/**', close: ' */', notIn: ['string'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' }
    ],
    folding: {
      markers: {
        start: /^\s*\/\/#region/,
        end: /^\s*\/\/#endregion/
      }
    },
    wordPattern: /[a-zA-Z_]\w*[!?]?/,
    indentationRules: {
      increaseIndentPattern: /^.*(\{[^}]*|\([^)]*|\[[^\]]*)$/,
      decreaseIndentPattern: /^.*(\}|\)|\])\s*$/
    }
  });

  // Tokenization provider
  monaco.languages.setMonarchTokenizer(LANGUAGE_ID, {
    defaultToken: 'invalid',
    tokenPostfix: '.ruchy',

    // Keywords organized by category
    keywords: [
      // Control flow
      'if', 'else', 'match', 'case', 'for', 'while', 'loop', 'break', 'continue', 'return',
      // Declarations
      'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'trait', 'impl', 'type', 'mod', 'use',
      // Modifiers
      'pub', 'async', 'await', 'unsafe', 'extern', 'move', 'ref', 'box',
      // Actor keywords (Ruchy-specific)
      'actor', 'spawn', 'send',
      // Special identifiers
      'self', 'Self', 'super', 'crate', 'as', 'in', 'where'
    ],

    // Built-in types
    builtins: [
      'bool', 'char', 'str', 'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
      'u8', 'u16', 'u32', 'u64', 'u128', 'usize', 'f32', 'f64',
      'String', 'Vec', 'HashMap', 'HashSet', 'Result', 'Option',
      'Box', 'Rc', 'Arc', 'Some', 'None', 'Ok', 'Err'
    ],

    // Operators
    operators: [
      '=', '==', '!=', '<', '>', '<=', '>=',
      '+', '-', '*', '/', '%', '**',
      '&&', '||', '!', '&', '|', '^', '~',
      '<<', '>>', '>>>', // Pipeline operator
      '<-', '<?', // Actor operators
      '+=', '-=', '*=', '/=', '%=',
      '&=', '|=', '^=', '<<=', '>>=',
      '->', '=>', '..', '..=', '::', '?'
    ],

    // Symbols
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    tokenizer: {
      root: [
        // Whitespace
        [/\s+/, 'white'],

        // Doc comments
        [/\/\*\*(?!\/)/, 'comment.doc', '@doccomment'],
        [/\/\/\/.*$/, 'comment.doc'],

        // Comments with SATD detection
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],

        // Attributes
        [/#!?\[[^\]]*\]/, 'annotation'],

        // Lifetimes
        [/'[a-z_]\w*/, 'type.lifetime'],

        // Strings
        [/r#*"/, 'string.raw', '@rawstring'],
        [/"/, 'string', '@string'],
        [/'[^']*'/, 'string.char'],

        // Numbers
        [/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
        [/0[oO](@octaldigits)[Ll]?/, 'number.octal'],
        [/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
        [/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
        [/(@digits)[fFdD]/, 'number.float'],
        [/(@digits)[lL]?/, 'number'],

        // Identifiers and keywords
        [/[a-zA-Z_]\w*!/, 'identifier.macro'],
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'type.builtin',
            '@default': 'identifier'
          }
        }],

        // Type names (PascalCase)
        [/[A-Z]\w*/, 'type.identifier'],

        // Pipeline and actor operators
        [/>>/, 'operator.pipeline'],
        [/<[-?]/, 'operator.actor'],

        // Operators
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Delimiters
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/[;,.]/, 'delimiter']
      ],

      comment: [
        [/\b(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)\b/, 'comment.keyword'],
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ['\\*/', 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      doccomment: [
        [/@\w+/, 'comment.keyword.doc'],
        [/\*\*[^*]+\*\*/, 'comment.strong'],
        [/\*[^*]+\*/, 'comment.emphasis'],
        [/`[^`]+`/, 'comment.code'],
        [/[^*]+/, 'comment.doc'],
        ['\\*/', 'comment.doc', '@pop'],
        [/[\/*]/, 'comment.doc']
      ],

      string: [
        [/\$\{/, 'string.interpolation', '@interpolation'],
        [/[^\\"$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ],

      interpolation: [
        [/\}/, 'string.interpolation', '@pop'],
        { include: 'root' }
      ],

      rawstring: [
        [/[^"]+/, 'string.raw'],
        [/"#*/, {
          cases: {
            '$S2==$&': { token: 'string.raw', next: '@pop' },
            '@default': 'string.raw'
          }
        }]
      ]
    }
  });

  // Completion provider
  monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [];

      // Keyword completions
      const keywords = [
        'fn', 'let', 'mut', 'const', 'if', 'else', 'match', 'for', 'while', 'loop',
        'struct', 'enum', 'trait', 'impl', 'actor', 'spawn', 'send'
      ];

      keywords.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range
        });
      });

      // Type completions
      const types = [
        'String', 'Vec', 'HashMap', 'Result', 'Option', 'i32', 'f64', 'bool'
      ];

      types.forEach(type => {
        suggestions.push({
          label: type,
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: type,
          range: range
        });
      });

      // Snippet completions
      suggestions.push({
        label: 'fn',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'fn ${1:name}(${2:params}) -> ${3:ReturnType} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Function definition',
        range: range
      });

      suggestions.push({
        label: 'actor',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: 'actor ${1:ActorName} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Actor definition',
        range: range
      });

      return { suggestions: suggestions };
    }
  });

  // Hover provider
  monaco.languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return;

      const hoverInfo = {
        'fn': 'Function declaration keyword',
        'actor': 'Actor definition keyword (Ruchy-specific)',
        'spawn': 'Create new actor instance',
        '>>': 'Pipeline operator - passes result to next function',
        '<-': 'Send message to actor',
        '<?': 'Ask message to actor (expects response)'
      };

      const info = hoverInfo[word.word];
      if (info) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [
            { value: `**${word.word}**` },
            { value: info }
          ]
        };
      }
    }
  });

  // Folding provider
  monaco.languages.registerFoldingRangeProvider(LANGUAGE_ID, {
    provideFoldingRanges: (model) => {
      const ranges = [];
      const lines = model.getLinesContent();
      const stack = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Block folding
        if (line.includes('{')) {
          stack.push(i);
        }
        if (line.includes('}') && stack.length > 0) {
          const start = stack.pop();
          if (i > start + 1) {
            ranges.push({
              start: start + 1,
              end: i + 1,
              kind: monaco.languages.FoldingRangeKind.Region
            });
          }
        }

        // Comment folding
        if (line.trim().startsWith('/*')) {
          stack.push(i);
        }
        if (line.includes('*/') && stack.length > 0) {
          const start = stack.pop();
          if (i > start) {
            ranges.push({
              start: start + 1,
              end: i + 1,
              kind: monaco.languages.FoldingRangeKind.Comment
            });
          }
        }
      }

      return ranges;
    }
  });

  // Export for Node.js/CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LANGUAGE_ID };
  }

  // Return language ID for programmatic use
  return LANGUAGE_ID;

}(typeof monaco !== 'undefined' ? monaco : (typeof global !== 'undefined' ? global.monaco : null)));