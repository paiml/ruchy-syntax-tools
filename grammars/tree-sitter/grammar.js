/**
 * Tree-sitter grammar for Ruchy programming language
 * RSYN-0201: Tree-sitter grammar implementation
 *
 * This grammar provides precise AST generation for semantic highlighting,
 * code navigation, and structural editing in Tree-sitter enabled editors.
 */

module.exports = grammar({
  name: 'ruchy',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment
  ],

  externals: $ => [
    $._string_content,
    $.raw_string_literal
  ],

  precedences: $ => [
    [
      'member',
      'call',
      'unary',
      'cast',
      'multiplicative',
      'additive',
      'shift',
      'bitand',
      'bitxor',
      'bitor',
      'comparative',
      'and',
      'or',
      'range',
      'assign',
      'closure'
    ],
    ['member', 'range'],
    ['call', 'range']
  ],

  conflicts: $ => [
    [$.type_identifier, $.identifier],
    [$.generic_type, $.type_identifier],
    [$.closure_expression, $.block]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.function_definition,
      $.struct_definition,
      $.enum_definition,
      $.trait_definition,
      $.impl_block,
      $.type_alias,
      $.use_declaration,
      $.const_declaration,
      $.static_declaration,
      $.actor_definition,
      $.module_definition
    ),

    // Comments
    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    doc_comment: $ => token(choice(
      seq('///', /.*/),
      seq('/**', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    )),

    // Identifiers
    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    type_identifier: $ => /[A-Z][a-zA-Z0-9_]*/,

    lifetime: $ => seq("'", $.identifier),

    // Keywords
    keyword: $ => choice(
      'fn', 'let', 'mut', 'const', 'static',
      'if', 'else', 'match', 'for', 'while', 'loop',
      'break', 'continue', 'return',
      'struct', 'enum', 'trait', 'impl', 'type',
      'pub', 'mod', 'use', 'as', 'where',
      'async', 'await', 'move',
      'actor', 'spawn', 'send',
      'self', 'Self', 'super', 'crate',
      'unsafe', 'extern',
      'in', 'ref', 'box'
    ),

    // Function definitions
    function_definition: $ => seq(
      optional($.visibility_modifier),
      optional('async'),
      'fn',
      $.identifier,
      optional($.generic_parameters),
      $.parameter_list,
      optional(seq('->', $._type)),
      optional($.where_clause),
      $.block
    ),

    visibility_modifier: $ => choice(
      'pub',
      seq('pub', '(', choice('crate', 'super', 'self'), ')')
    ),

    generic_parameters: $ => seq(
      '<',
      sepBy1(',', $.generic_parameter),
      optional(','),
      '>'
    ),

    generic_parameter: $ => choice(
      $.lifetime,
      seq($.type_identifier, optional(seq(':', sepBy1('+', $.trait_bound)))),
      seq('const', $.identifier, ':', $._type)
    ),

    trait_bound: $ => choice(
      $.type_identifier,
      $.lifetime,
      seq('?', $.type_identifier),
      seq('for', $.generic_parameters, $.type_identifier)
    ),

    parameter_list: $ => seq(
      '(',
      optional(sepBy(',', $.parameter)),
      optional(','),
      ')'
    ),

    parameter: $ => choice(
      $.self_parameter,
      $.typed_parameter,
      $.pattern_parameter
    ),

    self_parameter: $ => seq(
      optional('&'),
      optional($.lifetime),
      optional('mut'),
      'self'
    ),

    typed_parameter: $ => seq(
      optional('mut'),
      $.identifier,
      ':',
      $._type
    ),

    pattern_parameter: $ => seq(
      $._pattern,
      ':',
      $._type
    ),

    where_clause: $ => seq(
      'where',
      sepBy1(',', $.where_predicate)
    ),

    where_predicate: $ => seq(
      choice($.type_identifier, $.lifetime),
      ':',
      sepBy1('+', $.trait_bound)
    ),

    // Types
    _type: $ => choice(
      $.primitive_type,
      $.type_identifier,
      $.generic_type,
      $.reference_type,
      $.array_type,
      $.tuple_type,
      $.function_type,
      $.pointer_type,
      $.impl_trait_type,
      $.dyn_trait_type
    ),

    primitive_type: $ => choice(
      'bool',
      'char', 'str',
      'i8', 'i16', 'i32', 'i64', 'i128', 'isize',
      'u8', 'u16', 'u32', 'u64', 'u128', 'usize',
      'f32', 'f64'
    ),

    generic_type: $ => prec.dynamic(-1, seq(
      $.type_identifier,
      $.generic_arguments
    )),

    generic_arguments: $ => seq(
      '<',
      sepBy1(',', choice($._type, $.lifetime, $.const_expression)),
      optional(','),
      '>'
    ),

    reference_type: $ => seq(
      '&',
      optional($.lifetime),
      optional('mut'),
      $._type
    ),

    array_type: $ => seq('[', $._type, optional(seq(';', $.const_expression)), ']'),

    tuple_type: $ => seq(
      '(',
      optional(seq(
        $._type,
        repeat(seq(',', $._type)),
        optional(',')
      )),
      ')'
    ),

    function_type: $ => seq(
      optional('unsafe'),
      optional(seq('extern', optional($.string_literal))),
      'fn',
      $.parameter_list,
      optional(seq('->', $._type))
    ),

    pointer_type: $ => seq(
      '*',
      choice('const', 'mut'),
      $._type
    ),

    impl_trait_type: $ => seq('impl', sepBy1('+', $.trait_bound)),

    dyn_trait_type: $ => seq('dyn', sepBy1('+', $.trait_bound)),

    // Struct definitions
    struct_definition: $ => seq(
      optional($.visibility_modifier),
      'struct',
      $.type_identifier,
      optional($.generic_parameters),
      choice(
        seq(optional($.where_clause), ';'),
        seq($.field_list, optional($.where_clause)),
        seq($.tuple_field_list, optional($.where_clause), ';')
      )
    ),

    field_list: $ => seq(
      '{',
      optional(sepBy(',', $.field)),
      optional(','),
      '}'
    ),

    field: $ => seq(
      optional($.visibility_modifier),
      $.identifier,
      ':',
      $._type
    ),

    tuple_field_list: $ => seq(
      '(',
      sepBy(',', seq(optional($.visibility_modifier), $._type)),
      optional(','),
      ')'
    ),

    // Enum definitions
    enum_definition: $ => seq(
      optional($.visibility_modifier),
      'enum',
      $.type_identifier,
      optional($.generic_parameters),
      optional($.where_clause),
      '{',
      optional(sepBy(',', $.enum_variant)),
      optional(','),
      '}'
    ),

    enum_variant: $ => seq(
      $.identifier,
      optional(choice(
        $.tuple_field_list,
        $.field_list,
        seq('=', $.const_expression)
      ))
    ),

    // Trait definitions
    trait_definition: $ => seq(
      optional($.visibility_modifier),
      optional('unsafe'),
      'trait',
      $.type_identifier,
      optional($.generic_parameters),
      optional(seq(':', sepBy1('+', $.trait_bound))),
      optional($.where_clause),
      '{',
      repeat($._trait_item),
      '}'
    ),

    _trait_item: $ => choice(
      $.trait_function,
      $.trait_type,
      $.trait_const
    ),

    trait_function: $ => seq(
      optional($.visibility_modifier),
      optional('async'),
      'fn',
      $.identifier,
      optional($.generic_parameters),
      $.parameter_list,
      optional(seq('->', $._type)),
      optional($.where_clause),
      choice(';', $.block)
    ),

    trait_type: $ => seq(
      'type',
      $.type_identifier,
      optional(seq(':', sepBy1('+', $.trait_bound))),
      ';'
    ),

    trait_const: $ => seq(
      'const',
      $.identifier,
      ':',
      $._type,
      optional(seq('=', $.const_expression)),
      ';'
    ),

    // Impl blocks
    impl_block: $ => seq(
      optional('unsafe'),
      'impl',
      optional($.generic_parameters),
      optional(seq(
        choice($.type_identifier, $._type),
        'for'
      )),
      $._type,
      optional($.where_clause),
      '{',
      repeat($._impl_item),
      '}'
    ),

    _impl_item: $ => choice(
      $.function_definition,
      $.type_alias,
      $.const_declaration
    ),

    // Type alias
    type_alias: $ => seq(
      optional($.visibility_modifier),
      'type',
      $.type_identifier,
      optional($.generic_parameters),
      '=',
      $._type,
      ';'
    ),

    // Use declarations
    use_declaration: $ => seq(
      optional($.visibility_modifier),
      'use',
      $.use_path,
      ';'
    ),

    use_path: $ => choice(
      seq(optional('::'), $.path_segment, repeat(seq('::', $.path_segment))),
      seq('{', sepBy(',', $.use_path), optional(','), '}'),
      seq($.use_path, 'as', $.identifier),
      '*'
    ),

    path_segment: $ => choice(
      $.identifier,
      $.type_identifier,
      'self',
      'super',
      'crate'
    ),

    // Constants and statics
    const_declaration: $ => seq(
      optional($.visibility_modifier),
      'const',
      $.identifier,
      ':',
      $._type,
      '=',
      $._expression,
      ';'
    ),

    static_declaration: $ => seq(
      optional($.visibility_modifier),
      'static',
      optional('mut'),
      $.identifier,
      ':',
      $._type,
      '=',
      $._expression,
      ';'
    ),

    // Actor definitions (Ruchy-specific)
    actor_definition: $ => seq(
      optional($.visibility_modifier),
      'actor',
      $.type_identifier,
      optional($.generic_parameters),
      '{',
      repeat($._actor_item),
      '}'
    ),

    _actor_item: $ => choice(
      $.actor_state,
      $.actor_handler
    ),

    actor_state: $ => seq(
      optional($.visibility_modifier),
      optional('mut'),
      $.identifier,
      ':',
      $._type,
      optional(seq('=', $._expression)),
      ';'
    ),

    actor_handler: $ => seq(
      'fn',
      'handle',
      '(',
      $.pattern_parameter,
      ')',
      $.block
    ),

    // Module definitions
    module_definition: $ => seq(
      optional($.visibility_modifier),
      'mod',
      $.identifier,
      choice(
        ';',
        seq('{', repeat($._definition), '}')
      )
    ),

    // Expressions
    _expression: $ => choice(
      $.identifier,
      $.literal,
      $.block,
      $.if_expression,
      $.match_expression,
      $.loop_expression,
      $.for_expression,
      $.while_expression,
      $.break_expression,
      $.continue_expression,
      $.return_expression,
      $.closure_expression,
      $.call_expression,
      $.index_expression,
      $.field_expression,
      $.method_call_expression,
      $.await_expression,
      $.binary_expression,
      $.unary_expression,
      $.cast_expression,
      $.reference_expression,
      $.dereference_expression,
      $.struct_expression,
      $.tuple_expression,
      $.array_expression,
      $.range_expression,
      $.pipeline_expression,
      $.actor_send_expression,
      $.actor_ask_expression,
      $.spawn_expression
    ),

    // Literals
    literal: $ => choice(
      $.boolean_literal,
      $.integer_literal,
      $.float_literal,
      $.char_literal,
      $.string_literal,
      $.raw_string_literal
    ),

    boolean_literal: $ => choice('true', 'false'),

    integer_literal: $ => token(seq(
      choice(
        /[0-9][0-9_]*/,
        /0x[0-9a-fA-F_]+/,
        /0o[0-7_]+/,
        /0b[01_]+/
      ),
      optional(choice('i8', 'i16', 'i32', 'i64', 'i128', 'isize',
        'u8', 'u16', 'u32', 'u64', 'u128', 'usize'))
    )),

    float_literal: $ => token(seq(
      /[0-9][0-9_]*\.[0-9][0-9_]*/,
      optional(/[eE][+-]?[0-9_]+/),
      optional(choice('f32', 'f64'))
    )),

    char_literal: $ => seq(
      "'",
      choice(
        /[^'\\]/,
        /\\[\\'"nrt0]/,
        /\\x[0-9a-fA-F]{2}/,
        /\\u\{[0-9a-fA-F]{1,6}\}/
      ),
      "'"
    ),

    string_literal: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]+/,
        /\\[\\'"nrt0]/,
        /\\x[0-9a-fA-F]{2}/,
        /\\u\{[0-9a-fA-F]{1,6}\}/,
        seq('${', $._expression, '}')
      )),
      '"'
    ),

    // Control flow
    block: $ => seq(
      '{',
      repeat($._statement),
      optional($._expression),
      '}'
    ),

    _statement: $ => seq(
      choice(
        $.let_statement,
        $.expression_statement,
        $._expression
      ),
      optional(';')
    ),

    let_statement: $ => seq(
      'let',
      optional('mut'),
      $._pattern,
      optional(seq(':', $._type)),
      optional(seq('=', $._expression))
    ),

    expression_statement: $ => seq($._expression, ';'),

    if_expression: $ => prec.right(seq(
      'if',
      choice(
        $._expression,
        seq('let', $._pattern, '=', $._expression)
      ),
      $.block,
      optional(seq('else', choice($.block, $.if_expression)))
    )),

    match_expression: $ => seq(
      'match',
      $._expression,
      '{',
      optional(sepBy(',', $.match_arm)),
      optional(','),
      '}'
    ),

    match_arm: $ => seq(
      $._pattern,
      optional(seq('if', $._expression)),
      '=>',
      choice($._expression, seq($.block, optional(',')))
    ),

    loop_expression: $ => seq(
      optional(seq($.lifetime, ':')),
      'loop',
      $.block
    ),

    for_expression: $ => seq(
      optional(seq($.lifetime, ':')),
      'for',
      $._pattern,
      'in',
      $._expression,
      $.block
    ),

    while_expression: $ => seq(
      optional(seq($.lifetime, ':')),
      'while',
      choice(
        $._expression,
        seq('let', $._pattern, '=', $._expression)
      ),
      $.block
    ),

    break_expression: $ => prec.left(seq(
      'break',
      optional($.lifetime),
      optional($._expression)
    )),

    continue_expression: $ => seq(
      'continue',
      optional($.lifetime)
    ),

    return_expression: $ => prec.left(seq(
      'return',
      optional($._expression)
    )),

    // Closure expressions
    closure_expression: $ => prec('closure', seq(
      optional('move'),
      choice(
        seq('||', optional(seq('->', $._type))),
        seq('|', sepBy(',', $.closure_parameter), '|', optional(seq('->', $._type)))
      ),
      choice($._expression, $.block)
    )),

    closure_parameter: $ => choice(
      $.identifier,
      seq($._pattern, optional(seq(':', $._type)))
    ),

    // Function calls and method calls
    call_expression: $ => prec('call', seq(
      $._expression,
      $.argument_list
    )),

    argument_list: $ => seq(
      '(',
      optional(sepBy(',', $._expression)),
      optional(','),
      ')'
    ),

    method_call_expression: $ => prec('member', seq(
      $._expression,
      '.',
      $.identifier,
      optional($.generic_arguments),
      $.argument_list
    )),

    // Field and index access
    field_expression: $ => prec('member', seq(
      $._expression,
      '.',
      choice($.identifier, $.integer_literal)
    )),

    index_expression: $ => prec('call', seq(
      $._expression,
      '[',
      $._expression,
      ']'
    )),

    // Await expression
    await_expression: $ => seq(
      $._expression,
      '.await'
    ),

    // Binary expressions
    binary_expression: $ => {
      const table = [
        ['or', '||'],
        ['and', '&&'],
        ['bitor', '|'],
        ['bitxor', '^'],
        ['bitand', '&'],
        ['comparative', choice('==', '!=', '<', '<=', '>', '>=')],
        ['shift', choice('<<', '>>')],
        ['additive', choice('+', '-')],
        ['multiplicative', choice('*', '/', '%')]
      ];

      return choice(...table.map(([precedence, operator]) =>
        prec.left(precedence, seq(
          $._expression,
          operator,
          $._expression
        ))
      ));
    },

    // Unary expressions
    unary_expression: $ => prec('unary', choice(
      seq('-', $._expression),
      seq('!', $._expression),
      seq('*', $._expression),
      seq('&', optional('mut'), $._expression)
    )),

    cast_expression: $ => prec('cast', seq(
      $._expression,
      'as',
      $._type
    )),

    reference_expression: $ => prec('unary', seq(
      '&',
      optional('mut'),
      $._expression
    )),

    dereference_expression: $ => prec('unary', seq(
      '*',
      $._expression
    )),

    // Struct and tuple expressions
    struct_expression: $ => seq(
      choice($.type_identifier, $.scoped_identifier),
      '{',
      optional(sepBy(',', $.field_initializer)),
      optional(choice(',', seq('..', $._expression))),
      '}'
    ),

    field_initializer: $ => choice(
      seq($.identifier, ':', $._expression),
      $.identifier
    ),

    tuple_expression: $ => seq(
      '(',
      optional(seq(
        $._expression,
        repeat1(seq(',', $._expression)),
        optional(',')
      )),
      ')'
    ),

    array_expression: $ => seq(
      '[',
      choice(
        seq(optional(sepBy(',', $._expression)), optional(',')),
        seq($._expression, ';', $._expression)
      ),
      ']'
    ),

    range_expression: $ => prec('range', choice(
      seq($._expression, '..', $._expression),
      seq($._expression, '..=', $._expression),
      seq($._expression, '..'),
      seq('..', $._expression),
      '..'
    )),

    // Pipeline expression (Ruchy-specific)
    pipeline_expression: $ => prec.left('assign', seq(
      $._expression,
      '>>',
      $._expression
    )),

    // Actor expressions (Ruchy-specific)
    actor_send_expression: $ => prec('assign', seq(
      $._expression,
      '<-',
      $._expression
    )),

    actor_ask_expression: $ => prec('assign', seq(
      $._expression,
      '<?',
      $._expression
    )),

    spawn_expression: $ => seq(
      'spawn',
      choice(
        seq($.type_identifier, $.argument_list),
        $.closure_expression
      )
    ),

    // Patterns
    _pattern: $ => choice(
      $.identifier_pattern,
      $.wildcard_pattern,
      $.literal_pattern,
      $.tuple_pattern,
      $.struct_pattern,
      $.enum_pattern,
      $.slice_pattern,
      $.reference_pattern,
      $.or_pattern,
      $.range_pattern
    ),

    identifier_pattern: $ => choice(
      $.identifier,
      seq('ref', optional('mut'), $.identifier),
      seq('mut', $.identifier)
    ),

    wildcard_pattern: $ => '_',

    literal_pattern: $ => $.literal,

    tuple_pattern: $ => seq(
      '(',
      optional(sepBy(',', $._pattern)),
      optional(','),
      ')'
    ),

    struct_pattern: $ => seq(
      choice($.type_identifier, $.scoped_identifier),
      '{',
      optional(sepBy(',', $.field_pattern)),
      optional(choice(',', '..')),
      '}'
    ),

    field_pattern: $ => choice(
      seq($.identifier, ':', $._pattern),
      $.identifier,
      seq('ref', optional('mut'), $.identifier),
      seq('mut', $.identifier)
    ),

    enum_pattern: $ => seq(
      choice($.type_identifier, $.scoped_identifier),
      optional(choice(
        $.tuple_pattern,
        $.struct_pattern
      ))
    ),

    slice_pattern: $ => seq(
      '[',
      optional(sepBy(',', $._pattern)),
      optional(','),
      ']'
    ),

    reference_pattern: $ => seq(
      '&',
      optional('mut'),
      $._pattern
    ),

    or_pattern: $ => prec.left(seq(
      $._pattern,
      '|',
      $._pattern
    )),

    range_pattern: $ => choice(
      seq($._pattern, '..=', $._pattern),
      seq($._pattern, '..', $._pattern)
    ),

    // Helper for scoped identifiers
    scoped_identifier: $ => seq(
      optional('::'),
      $.path_segment,
      repeat(seq('::', $.path_segment)),
      '::',
      choice($.identifier, $.type_identifier)
    ),

    // Const expressions (subset of expressions valid in const context)
    const_expression: $ => choice(
      $.literal,
      $.identifier,
      $.scoped_identifier,
      seq('-', $.const_expression),
      seq('!', $.const_expression)
      // Additional const expressions can be added here
    )
  }
});

// Helper function for separated lists
function sepBy(separator, rule) {
  return optional(sepBy1(separator, rule));
}

function sepBy1(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)));
}