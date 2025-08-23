/**
 * Prism.js Language Definition for Ruchy
 * RSYN-0302: Prism grammar for documentation sites
 * 
 * @fileoverview Ruchy language support for Prism.js
 * @version 1.0.0
 * @license MIT
 * 
 * Quality Requirements:
 * - Test Coverage: ≥80%
 * - Cyclomatic Complexity: ≤20
 * - Performance: <25ms for 50K lines
 */

(function (Prism) {
  'use strict';

  // Guard against missing Prism
  if (typeof Prism === 'undefined') {
    return;
  }

  /**
   * Ruchy language definition for Prism.js
   * Provides comprehensive syntax highlighting for the Ruchy programming language
   */
  Prism.languages.ruchy = {
    // Doc comments must come before regular comments
    'doc-comment': [
      {
        pattern: /(^|[^\\])\/\*\*[^*][\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
        alias: 'comment',
        inside: {
          'tag': {
            pattern: /@\w+/,
            alias: 'keyword'
          },
          'bold': {
            pattern: /\*\*[^*]+\*\*/,
            inside: {
              'punctuation': /\*\*/
            }
          },
          'italic': {
            pattern: /\*[^*]+\*/,
            inside: {
              'punctuation': /\*/
            }
          },
          'code': {
            pattern: /`[^`]+`/,
            alias: 'string'
          }
        }
      },
      {
        pattern: /(^|[^\\:])\/\/\/.*/,
        lookbehind: true,
        greedy: true,
        alias: 'comment',
        inside: {
          'tag': {
            pattern: /@\w+/,
            alias: 'keyword'
          }
        }
      }
    ],

    // Regular comments with SATD detection
    'comment': [
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
        inside: {
          'important': {
            pattern: /\b(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)\b/,
            alias: 'keyword'
          }
        }
      },
      {
        pattern: /(^|[^\\])\/\*(?!\*)[^*][\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
        inside: {
          'important': {
            pattern: /\b(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)\b/,
            alias: 'keyword'
          }
        }
      }
    ],

    // String literals with interpolation
    'string': [
      {
        // Raw strings
        pattern: /r#*"(?:\\.|(?!")[^\\])*"#*/,
        greedy: true,
        alias: 'string-raw'
      },
      {
        // Regular strings with interpolation
        pattern: /"(?:\\.|[^\\"])*"/,
        greedy: true,
        inside: {
          'interpolation': {
            pattern: /\$\{[^}]+\}/,
            inside: {
              'delimiter': {
                pattern: /^\$\{|\}$/,
                alias: 'punctuation'
              },
              'expression': {
                pattern: /[\s\S]+/,
                inside: null // Will be set to Prism.languages.ruchy
              }
            }
          },
          'escape': /\\(?:[\\'"nrt0]|x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]{1,6}\})/
        }
      },
      {
        // Character literals
        pattern: /'(?:\\.|[^\\'])*'/,
        greedy: true,
        alias: 'char'
      }
    ],

    // Attributes/Annotations
    'attribute': {
      pattern: /#!?\[[^\]]*\]/,
      greedy: true,
      alias: 'annotation',
      inside: {
        'punctuation': /^#!?\[|\]$/,
        'attribute-name': {
          pattern: /^\w+/,
          alias: 'function'
        },
        'string': /"(?:\\.|[^\\"])*"/
      }
    },

    // Lifetime annotations
    'lifetime': {
      pattern: /'[a-z_]\w*/,
      alias: 'symbol'
    },

    // Function definitions
    'function-definition': {
      pattern: /\b(?:fn)\s+(?!\d)\w+/,
      inside: {
        'keyword': /^fn/,
        'function': /\w+$/
      }
    },

    // Actor definitions (Ruchy-specific)
    'actor-definition': {
      pattern: /\b(?:actor)\s+[A-Z]\w*/,
      inside: {
        'keyword': /^actor/,
        'class-name': /\w+$/
      }
    },

    // Type definitions
    'type-definition': {
      pattern: /\b(?:struct|enum|trait|type)\s+[A-Z]\w*/,
      inside: {
        'keyword': /^(?:struct|enum|trait|type)/,
        'class-name': /\w+$/
      }
    },

    // Macro invocations
    'macro': {
      pattern: /\b\w+!/,
      alias: 'function'
    },

    // Numbers with type suffixes
    'number': [
      // Binary
      /\b0b[01_]+(?:[iu](?:8|16|32|64|128|size))?\b/,
      // Octal
      /\b0o[0-7_]+(?:[iu](?:8|16|32|64|128|size))?\b/,
      // Hexadecimal
      /\b0x[0-9a-fA-F_]+(?:[iu](?:8|16|32|64|128|size))?\b/,
      // Float
      /\b\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?[\d_]+)?(?:f32|f64)?\b/,
      // Integer
      /\b\d[\d_]*(?:[iu](?:8|16|32|64|128|size))?\b/
    ],

    // Keywords organized by category
    'keyword': [
      // Control flow
      /\b(?:if|else|match|case|for|while|loop|break|continue|return)\b/,
      // Declarations
      /\b(?:fn|let|mut|const|static|struct|enum|trait|impl|type|mod|use)\b/,
      // Modifiers
      /\b(?:pub|async|await|unsafe|extern|move|ref|box)\b/,
      // Actor keywords (Ruchy-specific)
      /\b(?:actor|spawn|send)\b/,
      // Special identifiers
      /\b(?:self|Self|super|crate|as|in|where)\b/
    ],

    // Boolean literals
    'boolean': /\b(?:true|false)\b/,

    // Built-in types
    'builtin': /\b(?:bool|char|str|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|String|Vec|HashMap|HashSet|Result|Option|Box|Rc|Arc|Some|None|Ok|Err)\b/,

    // Pipeline operator (Ruchy-specific)
    'pipeline-operator': {
      pattern: />>/,
      alias: 'operator'
    },

    // Actor operators (Ruchy-specific)
    'actor-operator': {
      pattern: /<-|<\?/,
      alias: 'operator'
    },

    // Other operators
    'operator': /[+\-*\/%]=?|=[=>]?|&[&=]?|\|[|=]?|\^=?|<<?=?|>>?=?|[@!~?]/,

    // Punctuation
    'punctuation': /[{}[\];(),:]/,

    // Generic type parameters
    'generic': {
      pattern: /<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>/,
      greedy: true,
      inside: {
        'punctuation': /[<>]/,
        'class-name': /\b[A-Z]\w*\b/,
        'keyword': /\b(?:where|impl|for)\b/,
        'lifetime': /'[a-z_]\w*/
      }
    },

    // Type annotations
    'type-annotation': {
      pattern: /:\s*(?:[A-Z]\w*(?:<[^>]+>)?|\w+)/,
      inside: {
        'punctuation': /:/,
        'class-name': /\b[A-Z]\w*\b/,
        'keyword': /\b(?:impl|dyn|for)\b/,
        'generic': {
          pattern: /<[^>]+>/,
          inside: null // Will be set to generic.inside
        }
      }
    },

    // Match arms
    'match-arm': {
      pattern: /=>/,
      alias: 'operator'
    },

    // Range operators
    'range': {
      pattern: /\.\.=?/,
      alias: 'operator'
    },

    // Closure parameters
    'closure': {
      pattern: /\|[^|]*\|/,
      greedy: true,
      inside: {
        'punctuation': /\|/,
        'parameter': {
          pattern: /[^|]+/,
          inside: null // Will be set to Prism.languages.ruchy
        }
      }
    },

    // Type names (PascalCase)
    'class-name': /\b[A-Z]\w*\b/,

    // Variable names
    'variable': /\b[a-z_]\w*\b/
  };

  // Set recursive references
  Prism.languages.ruchy['string'][1].inside.interpolation.inside.expression.inside = Prism.languages.ruchy;
  Prism.languages.ruchy['type-annotation'].inside.generic.inside = Prism.languages.ruchy.generic.inside;
  Prism.languages.ruchy['closure'].inside.parameter.inside = Prism.languages.ruchy;

  // Alias for file extension
  Prism.languages.rhy = Prism.languages.ruchy;

  // Hook for additional processing if needed
  if (Prism.hooks) {
    Prism.hooks.add('wrap', function(env) {
      if (env.language === 'ruchy') {
        // Mark Ruchy-specific constructs for special styling
        if (env.type === 'pipeline-operator' || 
            env.type === 'actor-operator' ||
            env.type === 'actor-definition') {
          env.classes.push('ruchy-specific');
        }
      }
    });
  }

  // Export for Node.js/CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism.languages.ruchy;
  }

}(typeof Prism !== 'undefined' ? Prism : (typeof global !== 'undefined' ? global.Prism : window.Prism)));