# -*- coding: utf-8 -*-
"""
Pygments Lexer for Ruchy Programming Language
RSYN-0405: Pygments grammar for Python-based documentation tools

@fileoverview Ruchy language support for Pygments (Python syntax highlighter)
@version 1.0.0
@license MIT

Quality Requirements:
- Test Coverage: ≥80%
- Cyclomatic Complexity: ≤20
- Performance: <25ms for 50K lines
"""

import re

from pygments.lexer import RegexLexer, include, bygroups, using, \
    this, combined, words
from pygments.token import Text, Comment, Operator, Keyword, Name, String, \
    Number, Punctuation, Generic, Whitespace, Error

__all__ = ['RuchyLexer']


class RuchyLexer(RegexLexer):
    """
    Lexer for the Ruchy programming language.
    
    Ruchy is a systems programming language with built-in actor model support
    and pipeline operators for functional programming.
    
    .. versionadded:: 2.14
    """

    name = 'Ruchy'
    aliases = ['ruchy', 'rhy']
    filenames = ['*.rhy', '*.ruchy']
    mimetypes = ['text/x-ruchy', 'application/x-ruchy']

    # URL for language documentation
    url = 'https://ruchy-lang.org'

    # Keyword categories for better organization and maintenance
    KEYWORDS_CONTROL = [
        'if', 'else', 'match', 'case', 'for', 'while', 'loop', 
        'break', 'continue', 'return'
    ]

    KEYWORDS_DECLARATION = [
        'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 
        'trait', 'impl', 'type', 'mod', 'use'
    ]

    KEYWORDS_MODIFIER = [
        'pub', 'async', 'await', 'unsafe', 'extern', 'move', 'ref', 'box'
    ]

    KEYWORDS_ACTOR = [
        'actor', 'spawn', 'send'  # Ruchy-specific actor keywords
    ]

    KEYWORDS_SPECIAL = [
        'self', 'Self', 'super', 'crate', 'as', 'in', 'where'
    ]

    BUILTIN_TYPES = [
        # Primitive types
        'bool', 'char', 'str',
        # Integer types
        'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
        'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
        # Float types
        'f32', 'f64',
        # Standard library types
        'String', 'Vec', 'HashMap', 'HashSet', 'Result', 'Option',
        'Box', 'Rc', 'Arc', 'Some', 'None', 'Ok', 'Err'
    ]

    # Combine all keywords for validation
    ALL_KEYWORDS = (KEYWORDS_CONTROL + KEYWORDS_DECLARATION + 
                   KEYWORDS_MODIFIER + KEYWORDS_ACTOR + KEYWORDS_SPECIAL)

    def analyse_text(text):
        """
        Analyze text to determine if it's Ruchy code.
        Returns a score between 0.0 and 1.0.
        """
        score = 0.0
        
        # Look for Ruchy-specific constructs
        if re.search(r'\bactor\s+[A-Z]\w*', text):
            score += 0.4
        if re.search(r'\bspawn\s+', text):
            score += 0.3
        if re.search(r'\s>>\s', text):  # Pipeline operator
            score += 0.3
        if re.search(r'\s<-\s', text):  # Actor send operator
            score += 0.2
        if re.search(r'\bfn\s+\w+', text):
            score += 0.2
        if re.search(r'#\[.*\]', text):  # Attributes
            score += 0.1
        if re.search(r'//.*', text):  # Line comments
            score += 0.05
            
        return min(score, 1.0)

    tokens = {
        'root': [
            # Whitespace
            (r'\s+', Whitespace),

            # Shebang
            (r'^#!.*$', Comment.Hashbang),

            # Documentation comments
            (r'///.*$', Comment.Doc),
            (r'/\*\*.*?\*/', Comment.Doc),

            # Comments with SATD (Self-Admitted Technical Debt) detection
            (r'//.*?$', Comment.Single),
            (r'/\*', Comment.Multiline, 'comment'),

            # Attributes
            (r'#!?\[[^\]]*\]', Comment.Preproc),

            # Lifetimes
            (r"'[a-z_]\w*", Name.Label),

            # Raw strings
            (r'r#*"', String.Other, 'raw_string'),

            # Regular strings
            (r'"', String.Double, 'string'),

            # Character literals
            (r"'(?:[^'\\]|\\.)'", String.Char),

            # Numeric literals
            # Binary
            (r'0b[01_]+(?:[iu](?:8|16|32|64|128|size))?', Number.Bin),
            # Octal
            (r'0o[0-7_]+(?:[iu](?:8|16|32|64|128|size))?', Number.Oct),
            # Hexadecimal
            (r'0x[0-9a-fA-F_]+(?:[iu](?:8|16|32|64|128|size))?', Number.Hex),
            # Float
            (r'\d[\d_]*\.[\d_]*(?:[eE][+-]?[\d_]+)?(?:f32|f64)?', Number.Float),
            (r'\d[\d_]*(?:[eE][+-]?[\d_]+)(?:f32|f64)?', Number.Float),
            (r'\d[\d_]*(?:f32|f64)', Number.Float),
            # Integer with type suffix
            (r'\d[\d_]*(?:[iu](?:8|16|32|64|128|size))?', Number.Integer),

            # Pipeline operator (Ruchy-specific)
            (r'>>', Operator),

            # Actor operators (Ruchy-specific)
            (r'<-|<\?', Operator),

            # Other operators
            (r'[=!<>+\-*/%&|^~:?]+', Operator),
            (r'\.\.=?', Operator),
            (r'=>', Operator),
            (r'->', Operator),
            (r'::', Operator),

            # Macro invocations
            (r'[a-zA-Z_]\w*!', Name.Builtin),

            # Function definitions
            (r'(fn)\s+([a-zA-Z_]\w*)',
             bygroups(Keyword.Declaration, Name.Function)),

            # Actor definitions (Ruchy-specific)
            (r'(actor)\s+([A-Z]\w*)',
             bygroups(Keyword.Declaration, Name.Class)),

            # Type definitions
            (r'(struct|enum|trait|type)\s+([A-Z]\w*)',
             bygroups(Keyword.Declaration, Name.Class)),

            # Implementation blocks
            (r'(impl)(\s*)(<[^>]*>)?(\s+)([a-zA-Z_]\w*)',
             bygroups(Keyword.Declaration, Whitespace, Generic,
                     Whitespace, Name.Class)),

            # Keywords
            (words(KEYWORDS_CONTROL, suffix=r'\b'), Keyword),
            (words(KEYWORDS_DECLARATION, suffix=r'\b'), Keyword.Declaration),
            (words(KEYWORDS_MODIFIER, suffix=r'\b'), Keyword.Pseudo),
            (words(KEYWORDS_ACTOR, suffix=r'\b'), Keyword),
            (words(KEYWORDS_SPECIAL, suffix=r'\b'), Keyword.Pseudo),

            # Built-in types
            (words(BUILTIN_TYPES, suffix=r'\b'), Keyword.Type),

            # Boolean literals
            (r'\b(true|false)\b', Keyword.Constant),

            # Type names (PascalCase)
            (r'[A-Z]\w*', Name.Class),

            # Regular identifiers
            (r'[a-z_]\w*', Name),

            # Punctuation
            (r'[{}()\[\];,.]', Punctuation),

            # Generic type brackets
            (r'<', Punctuation, 'generic'),
            (r'>', Error),  # Unmatched closing bracket
        ],

        'comment': [
            # Nested comments support
            (r'/\*', Comment.Multiline, '#push'),
            (r'\*/', Comment.Multiline, '#pop'),
            
            # SATD keyword highlighting
            (r'\b(?:TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)\b',
             Comment.Special),
            
            (r'[^/*]+', Comment.Multiline),
            (r'[/*]', Comment.Multiline),
        ],

        'raw_string': [
            # Raw string end detection
            (r'"#{0,16}', String.Other, 'raw_string_end'),
            (r'[^"]+', String.Other),
            (r'"', String.Other),
        ],

        'raw_string_end': [
            # Check if we have the right number of hashes
            (r'(?<=")#{0,16}(?=")', String.Other, '#pop:2'),
            (r'[^"]*', String.Other, '#pop'),
        ],

        'string': [
            (r'"', String.Double, '#pop'),
            
            # Escape sequences
            (r'\\[\\'"nrt0]', String.Escape),
            (r'\\x[0-9a-fA-F]{2}', String.Escape),
            (r'\\u\{[0-9a-fA-F]{1,6}\}', String.Escape),
            (r'\\.', String.Escape),  # Invalid escape sequences
            
            # String interpolation
            (r'\$\{', String.Interpol, 'interpolation'),
            
            (r'[^"\\$]+', String.Double),
            (r'\$', String.Double),
        ],

        'interpolation': [
            (r'\}', String.Interpol, '#pop'),
            (r'\{', Punctuation, 'interpolation'),  # Nested braces
            
            # Include basic tokens for expressions inside interpolation
            (r'[a-zA-Z_]\w*', Name),
            (r'\d+', Number.Integer),
            (r'[+\-*/]', Operator),
            (r'[()]', Punctuation),
            (r'\s+', Whitespace),
            (r'[^}]+', Text),
        ],

        'generic': [
            (r'>', Punctuation, '#pop'),
            (r'<', Punctuation, '#push'),
            
            # Types inside generics
            (r'[A-Z]\w*', Name.Class),
            (r'[a-z_]\w*', Name),
            (r"'[a-z_]\w*", Name.Label),  # Lifetimes
            
            # Generic syntax
            (r'::', Operator),
            (r',\s*', Punctuation),
            (r'\s+', Whitespace),
            (r'where\b', Keyword),
            (r'\+', Operator),
            (r'[^<>,+\s]+', Name),
        ],
    }

    def get_tokens_unprocessed(self, text):
        """
        Override to add custom post-processing if needed.
        For now, just use the default implementation.
        """
        for index, token, value in RegexLexer.get_tokens_unprocessed(self, text):
            yield index, token, value