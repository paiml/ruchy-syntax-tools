; Tree-sitter highlighting queries for Ruchy
; RSYN-0202: Tree-sitter queries implementation

; Comments
(line_comment) @comment.line
(block_comment) @comment.block
(doc_comment) @comment.documentation

; Keywords
[
  "fn"
  "let"
  "mut"
  "const"
  "static"
  "if"
  "else"
  "match"
  "for"
  "while"
  "loop"
  "break"
  "continue"
  "return"
  "struct"
  "enum"
  "trait"
  "impl"
  "type"
  "pub"
  "mod"
  "use"
  "as"
  "where"
  "async"
  "await"
  "move"
  "actor"
  "spawn"
  "send"
  "self"
  "Self"
  "super"
  "crate"
  "unsafe"
  "extern"
  "in"
  "ref"
  "box"
] @keyword

; Special keywords
"fn" @keyword.function
"return" @keyword.return
"if" @keyword.conditional
"else" @keyword.conditional
"match" @keyword.conditional
"for" @keyword.repeat
"while" @keyword.repeat
"loop" @keyword.repeat
"break" @keyword.control
"continue" @keyword.control
"use" @keyword.import
"mod" @keyword.import
"pub" @keyword.modifier
"mut" @keyword.modifier
"const" @keyword.modifier
"static" @keyword.modifier
"async" @keyword.modifier
"unsafe" @keyword.modifier
"actor" @keyword.special
"spawn" @keyword.special

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
  "!"
  "&"
  "|"
  "^"
  "<<"
  ">>"
  "."
  ".."
  "..="
  "=>"
  "->"
  "::"
  ":"
  ";"
  ","
  "?"
] @operator

; Special operators (Ruchy-specific)
">>" @operator.pipeline
"<-" @operator.actor.send
"<?" @operator.actor.ask

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  ";"
  ":"
] @punctuation.delimiter

"::" @punctuation.special

; Literals
(boolean_literal) @constant.builtin.boolean
(integer_literal) @constant.numeric.integer
(float_literal) @constant.numeric.float
(char_literal) @string.special.char
(string_literal) @string
(raw_string_literal) @string.special

; String interpolation
(string_literal
  "${" @punctuation.special
  "}" @punctuation.special)

; Identifiers
(identifier) @variable
(type_identifier) @type
(lifetime) @label

; Special identifiers
((identifier) @constant
  (#match? @constant "^[A-Z_][A-Z0-9_]*$"))

((identifier) @variable.builtin
  (#eq? @variable.builtin "self"))

((type_identifier) @type.builtin
  (#eq? @type.builtin "Self"))

; Function definitions
(function_definition
  name: (identifier) @function)

(trait_function
  name: (identifier) @function.method)

; Function calls
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (scoped_identifier
    name: (identifier) @function.call))

(method_call_expression
  name: (identifier) @function.method.call)

; Macro invocations
((identifier) @function.macro
  (#match? @function.macro ".*!$"))

; Type definitions
(struct_definition
  name: (type_identifier) @type.definition)

(enum_definition
  name: (type_identifier) @type.definition)

(trait_definition
  name: (type_identifier) @type.definition)

(type_alias
  name: (type_identifier) @type.definition)

; Actor definitions (Ruchy-specific)
(actor_definition
  name: (type_identifier) @type.definition.actor)

(actor_handler
  "handle" @function.special)

; Field access
(field_expression
  field: (identifier) @property)

(field_initializer
  field: (identifier) @property)

; Parameters
(parameter
  pattern: (identifier) @parameter)

(closure_parameter
  (identifier) @parameter)

; Patterns
(identifier_pattern
  (identifier) @variable)

(wildcard_pattern) @variable.special

; Attributes (TODO: Add when attribute support is added)
; (attribute
;   name: (identifier) @attribute)

; Modules
(module_definition
  name: (identifier) @namespace)

(use_declaration
  (use_path
    (identifier) @namespace))

(scoped_identifier
  path: (identifier) @namespace)

; Generic parameters
(generic_parameter
  (type_identifier) @type.parameter)

(generic_arguments
  (type_identifier) @type.argument)

; Primitive types
(primitive_type) @type.builtin

; Special constructs
"self" @variable.builtin
"Self" @type.builtin
"super" @keyword.special
"crate" @keyword.special

; Error handling (when added)
; "Result" @type.builtin
; "Option" @type.builtin
; "Some" @constructor
; "None" @constructor
; "Ok" @constructor
; "Err" @constructor

; Async/await
"async" @keyword.coroutine
"await" @keyword.coroutine
".await" @keyword.coroutine

; Unsafe blocks
"unsafe" @keyword.danger

; Visibility modifiers
"pub" @keyword.modifier

; Mutable references
"mut" @keyword.modifier

; Reference and dereference
"&" @operator.reference
"*" @operator.dereference

; Type casting
"as" @keyword.operator

; Labels
(lifetime
  "'" @punctuation.special
  (identifier) @label)

; Match arms
(match_arm
  pattern: (_) @pattern
  "=>" @operator.match)

; Range patterns
(range_pattern
  ".." @operator.range
  "..=" @operator.range)

; Destructuring
(tuple_pattern) @pattern
(struct_pattern) @pattern
(slice_pattern) @pattern

; TODO/FIXME/NOTE comments
((line_comment) @comment.todo
  (#match? @comment.todo "^//[[:space:]]*(TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)"))

((block_comment) @comment.todo
  (#match? @comment.todo "(TODO|FIXME|NOTE|HACK|XXX|BUG|DEBT|WORKAROUND)"))