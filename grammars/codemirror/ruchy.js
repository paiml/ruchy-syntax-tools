/**
 * CodeMirror 6 Language Definition for Ruchy
 * RSYN-0403: CodeMirror grammar for web applications
 *
 * @fileoverview Ruchy language support for CodeMirror 6
 * @version 1.0.0
 * @license MIT
 *
 * Quality Requirements:
 * - Test Coverage: ≥80%
 * - Cyclomatic Complexity: ≤20
 * - Performance: <25ms for 50K lines
 */

import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";

/**
 * CodeMirror 6 Ruchy language support
 * Provides comprehensive syntax highlighting and language features
 * for the Ruchy programming language in CodeMirror 6 editors
 */

// Simple parser for Ruchy - CodeMirror 6 uses Lezer for full parsing
// This is a lightweight tokenizer-based approach
const ruchyHighlighting = styleTags({
  // Keywords
  "fn let mut const static struct enum trait impl type mod use": t.keyword,
  "if else match case for while loop break continue return": t.controlKeyword,
  "pub async await unsafe extern move ref box": t.modifier,
  "actor spawn send": t.keyword, // Ruchy-specific
  "self Self super crate as in where": t.self,
  
  // Types
  "bool char str i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64": t.typeName,
  "String Vec HashMap HashSet Result Option Box Rc Arc Some None Ok Err": t.typeName,
  
  // Literals
  String: t.string,
  RawString: t.string,
  CharLiteral: t.character,
  Number: t.number,
  Float: t.float,
  "true false": t.bool,
  
  // Comments
  LineComment: t.lineComment,
  BlockComment: t.blockComment,
  DocComment: t.docComment,
  
  // Operators
  ">> <- <?": t.operator, // Ruchy-specific operators
  "= == != < > <= >= + - * / % && || ! & | ^ ~ << >>> += -= *= /= %= &= |= ^= <<= >>= -> => .. ..= :: ?": t.operator,
  
  // Punctuation
  "( )": t.paren,
  "[ ]": t.squareBracket,
  "{ }": t.brace,
  "; , .": t.separator,
  
  // Attributes
  Attribute: t.annotation,
  
  // Lifetime
  Lifetime: t.labelName,
  
  // Macros
  MacroCall: t.macroName,
  
  // Type definitions
  TypeName: t.typeName,
  FunctionName: t.function(t.variableName),
  VariableName: t.variableName
});

// Simple tokenizer for Ruchy syntax
const ruchyTokenizer = {
  token(stream) {
    // Skip whitespace
    if (stream.eatSpace()) return null;
    
    // Line comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "LineComment";
    }
    
    // Block comments
    if (stream.match("/*")) {
      let depth = 1;
      let next;
      while ((next = stream.next()) != null) {
        if (next === "/" && stream.eat("*")) {
          depth++;
        } else if (next === "*" && stream.eat("/")) {
          depth--;
          if (depth === 0) break;
        }
      }
      return "BlockComment";
    }
    
    // Doc comments
    if (stream.match("///") || stream.match("/**")) {
      stream.skipToEnd();
      return "DocComment";
    }
    
    // Raw strings
    if (stream.match(/^r#*"/)) {
      const hashes = stream.current().match(/#/g);
      const hashCount = hashes ? hashes.length : 0;
      const endPattern = new RegExp(`"#{${hashCount}}`);
      
      while (stream.next() != null) {
        if (stream.current().match(endPattern)) {
          break;
        }
      }
      return "RawString";
    }
    
    // Regular strings
    if (stream.eat('"')) {
      let escaped = false;
      let ch;
      while ((ch = stream.next()) != null) {
        if (!escaped && ch === '"') break;
        escaped = !escaped && ch === '\\';
      }
      return "String";
    }
    
    // Character literals
    if (stream.eat("'")) {
      let escaped = false;
      let ch;
      while ((ch = stream.next()) != null) {
        if (!escaped && ch === "'") break;
        escaped = !escaped && ch === '\\';
      }
      return "CharLiteral";
    }
    
    // Attributes
    if (stream.match(/^#!?\[/)) {
      let depth = 1;
      let ch;
      while ((ch = stream.next()) != null) {
        if (ch === '[') depth++;
        else if (ch === ']') {
          depth--;
          if (depth === 0) break;
        }
      }
      return "Attribute";
    }
    
    // Lifetimes
    if (stream.match(/^'[a-z_]\w*/)) {
      return "Lifetime";
    }
    
    // Numbers
    if (stream.match(/^0[xX][0-9a-fA-F_]+/)) return "Number";
    if (stream.match(/^0[oO][0-7_]+/)) return "Number";
    if (stream.match(/^0[bB][01_]+/)) return "Number";
    if (stream.match(/^[\d_]*\.[\d_]*([eE][+-]?[\d_]+)?[fFdD]?/)) return "Float";
    if (stream.match(/^[\d_]+([eE][+-]?[\d_]+)?[fFdDlL]?/)) return "Number";
    
    // Pipeline operator
    if (stream.match(">>")) return "operator";
    
    // Actor operators
    if (stream.match("<-") || stream.match("<?")) return "operator";
    
    // Other operators
    if (stream.match(/^[=!<>+\-*/%&|^~:?]+/)) return "operator";
    
    // Macro calls
    if (stream.match(/^[a-zA-Z_]\w*!/)) {
      return "MacroCall";
    }
    
    // Keywords and identifiers
    if (stream.match(/^[a-zA-Z_]\w*/)) {
      const word = stream.current();
      
      // Keywords
      if (/^(fn|let|mut|const|static|struct|enum|trait|impl|type|mod|use|if|else|match|case|for|while|loop|break|continue|return|pub|async|await|unsafe|extern|move|ref|box|actor|spawn|send|self|Self|super|crate|as|in|where|true|false)$/.test(word)) {
        return "keyword";
      }
      
      // Built-in types
      if (/^(bool|char|str|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|String|Vec|HashMap|HashSet|Result|Option|Box|Rc|Arc|Some|None|Ok|Err)$/.test(word)) {
        return "TypeName";
      }
      
      // Type names (PascalCase)
      if (/^[A-Z]/.test(word)) {
        return "TypeName";
      }
      
      return "VariableName";
    }
    
    // Punctuation
    if (stream.match(/^[{}()\[\];,.:]/)) {
      return stream.current();
    }
    
    // Unknown character
    stream.next();
    return null;
  },
  
  startState() {
    return {};
  }
};

// Create the language definition
export const ruchyLanguage = LRLanguage.define({
  name: "ruchy",
  alias: ["rhy"],
  extensions: ["rhy", "ruchy"],
  
  // Use a simple tokenizer approach since we don't have a full Lezer grammar
  tokenizer: ruchyTokenizer,
  
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:\{|\}|case\s)$/,
    closeBrackets: { brackets: ["(", "[", "{", "'", '"'] },
    autocomplete: {
      // Basic keyword completion
      from: /[a-zA-Z_]\w*/,
      validFor: /^[a-zA-Z_]\w*$/,
      options: [
        // Keywords
        { label: "fn", type: "keyword", info: "Function definition" },
        { label: "let", type: "keyword", info: "Variable binding" },
        { label: "mut", type: "keyword", info: "Mutable binding" },
        { label: "const", type: "keyword", info: "Constant definition" },
        { label: "struct", type: "keyword", info: "Structure definition" },
        { label: "enum", type: "keyword", info: "Enumeration definition" },
        { label: "trait", type: "keyword", info: "Trait definition" },
        { label: "impl", type: "keyword", info: "Implementation block" },
        { label: "actor", type: "keyword", info: "Actor definition (Ruchy-specific)" },
        { label: "spawn", type: "keyword", info: "Spawn actor instance" },
        { label: "send", type: "keyword", info: "Send message to actor" },
        { label: "if", type: "keyword", info: "Conditional expression" },
        { label: "else", type: "keyword", info: "Alternative branch" },
        { label: "match", type: "keyword", info: "Pattern matching" },
        { label: "for", type: "keyword", info: "Loop iteration" },
        { label: "while", type: "keyword", info: "Conditional loop" },
        { label: "loop", type: "keyword", info: "Infinite loop" },
        
        // Types
        { label: "String", type: "type", info: "Growable string type" },
        { label: "Vec", type: "type", info: "Dynamic array" },
        { label: "HashMap", type: "type", info: "Hash map collection" },
        { label: "Result", type: "type", info: "Error handling type" },
        { label: "Option", type: "type", info: "Optional value type" },
        { label: "i32", type: "type", info: "32-bit signed integer" },
        { label: "f64", type: "type", info: "64-bit floating point" },
        { label: "bool", type: "type", info: "Boolean type" }
      ]
    }
  }
});

// Apply syntax highlighting
const ruchyHighlightStyle = ruchyHighlighting;

/**
 * Create a complete Ruchy language support package
 * @returns {LanguageSupport} CodeMirror 6 language support
 */
export function ruchy() {
  return new LanguageSupport(ruchyLanguage, [ruchyHighlightStyle]);
}

// Default export for convenience
export default ruchy;

// Named exports for flexibility
export { ruchyLanguage, ruchyHighlightStyle };

// Legacy CodeMirror 5 compatibility mode (if needed)
export const ruchyMode = {
  name: "ruchy",
  mime: "text/x-ruchy",
  mode: ruchyTokenizer,
  
  // Language configuration for CodeMirror 5
  lineComment: "//",
  blockCommentStart: "/*",
  blockCommentEnd: "*/",
  
  fold: "brace",
  closeBrackets: "()[]{}''\"\"",
  
  keywords: {
    keyword: "fn let mut const static struct enum trait impl type mod use if else match case for while loop break continue return pub async await unsafe extern move ref box actor spawn send self Self super crate as in where",
    builtin: "bool char str i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 String Vec HashMap HashSet Result Option Box Rc Arc Some None Ok Err",
    literal: "true false"
  }
};

// Export for Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ruchy,
    ruchyLanguage,
    ruchyHighlightStyle,
    ruchyMode
  };
}