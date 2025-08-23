/**
 * highlight.js Language Module for Ruchy
 * RSYN-0301: Web-based syntax highlighting
 *
 * @fileoverview Ruchy language support for highlight.js
 * @version 1.0.0
 * @license MIT
 *
 * Quality Requirements:
 * - Test Coverage: ≥80%
 * - Cyclomatic Complexity: ≤20
 * - Performance: <25ms for 50K lines
 */

(function(hljs) {
  'use strict';

  /**
   * Ruchy language definition for highlight.js
   * @param {Object} hljs - The highlight.js library object
   * @returns {Object} Language definition object
   */
  function ruchy(hljs) {
    // Keywords organized by category for maintainability
    const KEYWORDS = {
      keyword: [
        'fn', 'let', 'mut', 'const', 'static',
        'if', 'else', 'match', 'case', 'for', 'while', 'loop',
        'break', 'continue', 'return',
        'struct', 'enum', 'trait', 'impl', 'type',
        'pub', 'mod', 'use', 'as', 'where',
        'async', 'await', 'move',
        'actor', 'spawn', 'send',
        'self', 'Self', 'super', 'crate',
        'unsafe', 'extern',
        'in', 'ref', 'box'
      ].join(' '),
      literal: [
        'true', 'false', 'null', 'None', 'Some', 'Ok', 'Err'
      ].join(' '),
      built_in: [
        'bool', 'char', 'str',
        'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
        'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
        'f32', 'f64',
        'String', 'Vec', 'HashMap', 'HashSet',
        'Result', 'Option', 'Box', 'Rc', 'Arc'
      ].join(' ')
    };

    // Ruchy-specific operators
    const PIPELINE_OPERATOR = {
      className: 'operator',
      begin: />>/, // Pipeline operator
      relevance: 10
    };

    const ACTOR_OPERATORS = {
      className: 'operator',
      begin: /<-|<\?/, // Actor send and ask operators
      relevance: 10
    };

    // String definitions with interpolation support
    const STRING_INTERPOLATION = {
      className: 'subst',
      begin: /\$\{/,
      end: /\}/,
      contains: [] // Will be filled with RUCHY_CONTAINS
    };

    const STRINGS = {
      className: 'string',
      variants: [
        {
          begin: /r#*"/,
          end: /"#*/
        },
        {
          begin: /"/,
          end: /"/,
          illegal: /\n/,
          contains: [
            hljs.BACKSLASH_ESCAPE,
            STRING_INTERPOLATION
          ]
        },
        {
          begin: /'/,
          end: /'/,
          illegal: /\n/,
          contains: [hljs.BACKSLASH_ESCAPE]
        }
      ]
    };

    // Number literals with type suffixes
    const NUMBERS = {
      className: 'number',
      variants: [
        { begin: /\b0b[01_]+[iu]?(?:8|16|32|64|128|size)?\b/ }, // Binary
        { begin: /\b0o[0-7_]+[iu]?(?:8|16|32|64|128|size)?\b/ }, // Octal
        { begin: /\b0x[0-9a-fA-F_]+[iu]?(?:8|16|32|64|128|size)?\b/ }, // Hex
        { begin: /\b\d[\d_]*\.[\d_]*(?:[eE][+-]?[\d_]+)?(?:f32|f64)?\b/ }, // Float
        { begin: /\b\d[\d_]*(?:[eE][+-]?[\d_]+)(?:f32|f64)?\b/ }, // Float with exponent
        { begin: /\b\d[\d_]*[iu]?(?:8|16|32|64|128|size)?\b/ } // Decimal integer
      ],
      relevance: 0
    };

    // Comments with SATD detection
    const LINE_COMMENT = hljs.COMMENT('//', '$', {
      contains: [
        {
          className: 'doctag',
          begin: /(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND):/,
          relevance: 0
        }
      ]
    });

    const BLOCK_COMMENT = hljs.COMMENT('/\\*', '\\*/', {
      contains: [
        {
          className: 'doctag',
          begin: /(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND):/,
          relevance: 0
        },
        'self'
      ]
    });

    const DOC_COMMENT = hljs.COMMENT('//[/!]', '$', {
      contains: [
        {
          className: 'doctag',
          begin: /@[a-z]+/,
          relevance: 0
        }
      ]
    });

    // Type annotations
    const TYPE_ANNOTATION = {
      className: 'type',
      begin: /:\s*/,
      end: /[=;,)>\s]/,
      excludeEnd: true,
      contains: [
        {
          className: 'type',
          begin: /\b[A-Z][a-zA-Z0-9_]*\b/
        },
        {
          begin: /</,
          end: />/,
          contains: ['self']
        }
      ]
    };

    // Function definitions
    const FUNCTION = {
      className: 'function',
      begin: /\bfn\s+/,
      end: /[({;]/,
      excludeEnd: true,
      keywords: KEYWORDS,
      contains: [
        {
          className: 'title.function',
          begin: /[a-z_][a-zA-Z0-9_]*/,
          relevance: 0
        },
        {
          className: 'params',
          begin: /\(/,
          end: /\)/,
          excludeBegin: true,
          excludeEnd: true,
          contains: [
            TYPE_ANNOTATION,
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
          ]
        },
        {
          begin: /->/,
          end: /[{;]/,
          excludeEnd: true,
          contains: [TYPE_ANNOTATION]
        }
      ]
    };

    // Struct/Enum/Trait definitions
    const TYPE_DEFINITION = {
      className: 'class',
      beginKeywords: 'struct enum trait',
      end: /[{;]/,
      excludeEnd: true,
      contains: [
        {
          className: 'title.class',
          begin: /\b[A-Z][a-zA-Z0-9_]*\b/
        },
        {
          begin: /</,
          end: />/,
          contains: ['self']
        }
      ]
    };

    // Actor definitions (Ruchy-specific)
    const ACTOR_DEFINITION = {
      className: 'class',
      beginKeywords: 'actor',
      end: /\{/,
      excludeEnd: true,
      contains: [
        {
          className: 'title.class',
          begin: /\b[A-Z][a-zA-Z0-9_]*\b/
        }
      ],
      relevance: 10
    };

    // Lifetime annotations
    const LIFETIME = {
      className: 'symbol',
      begin: /'[a-z_][a-zA-Z0-9_]*/
    };

    // Attributes/Annotations
    const ATTRIBUTE = {
      className: 'meta',
      begin: /#!?\[/,
      end: /\]/,
      contains: [
        {
          className: 'string',
          begin: /"/,
          end: /"/
        }
      ]
    };

    // Macro invocations
    const MACRO = {
      className: 'built_in',
      begin: /\b[a-z_][a-zA-Z0-9_]*!/,
      relevance: 0
    };

    // Pattern matching
    const MATCH_EXPRESSION = {
      begin: /\bmatch\b/,
      end: /\}/,
      keywords: KEYWORDS,
      contains: [
        {
          className: 'operator',
          begin: /=>/
        }
      ]
    };

    // Lambda/Closure expressions
    const CLOSURE = {
      className: 'function',
      begin: /\|/,
      end: /\|/,
      excludeBegin: true,
      excludeEnd: true,
      contains: [
        {
          className: 'params',
          begin: /[a-z_][a-zA-Z0-9_]*/
        }
      ]
    };

    // Main language definition
    const RUCHY_CONTAINS = [
      LINE_COMMENT,
      BLOCK_COMMENT,
      DOC_COMMENT,
      ATTRIBUTE,
      STRINGS,
      NUMBERS,
      LIFETIME,
      PIPELINE_OPERATOR,
      ACTOR_OPERATORS,
      FUNCTION,
      TYPE_DEFINITION,
      ACTOR_DEFINITION,
      MACRO,
      MATCH_EXPRESSION,
      CLOSURE,
      {
        className: 'keyword',
        begin: /\b(?:self|Self|super|crate)\b/
      },
      {
        className: 'variable',
        begin: /\b[a-z_][a-zA-Z0-9_]*\b/,
        relevance: 0
      },
      {
        className: 'type',
        begin: /\b[A-Z][a-zA-Z0-9_]*\b/,
        relevance: 0
      }
    ];

    // Fill in recursive contains
    STRING_INTERPOLATION.contains = RUCHY_CONTAINS;

    return {
      name: 'Ruchy',
      aliases: ['rhy', 'ruchy'],
      keywords: KEYWORDS,
      illegal: '</',
      contains: RUCHY_CONTAINS
    };
  }

  // Register the language with highlight.js
  hljs.registerLanguage('ruchy', ruchy);

  // Export for Node.js/CommonJS
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = ruchy;
  }

}(typeof hljs !== 'undefined' ? hljs : require('highlight.js')));