# -*- coding: utf-8 -*-
# frozen_string_literal: true

require 'spec_helper'

describe Rouge::Lexers::Ruchy do
  let(:subject) { Rouge::Lexers::Ruchy.new }

  describe 'guessing' do
    include Support::Guessing

    it 'guesses by filename' do
      assert_guess :filename => 'main.rhy'
      assert_guess :filename => 'actor.ruchy'
    end

    it 'guesses by mimetype' do
      assert_guess :mimetype => 'text/x-ruchy'
      assert_guess :mimetype => 'application/x-ruchy'
    end

    it 'guesses by source content' do
      assert_guess :source => 'actor MessageProcessor {'
      assert_guess :source => 'fn main() { spawn(Actor::new()); }'
      assert_guess :source => 'let result = data >> process;'
    end
  end

  describe 'lexing' do
    include Support::Lexing

    it 'lexes keywords correctly' do
      tokens = subject.lex('fn actor spawn send')
      assert_equal [
        ['Keyword', 'fn'],
        ['Text.Whitespace', ' '],
        ['Keyword', 'actor'],
        ['Text.Whitespace', ' '], 
        ['Keyword', 'spawn'],
        ['Text.Whitespace', ' '],
        ['Keyword', 'send']
      ], tokens.to_a
    end

    it 'lexes actor operators correctly' do
      tokens = subject.lex('processor <- message; response = actor <? query;')
      
      # Should highlight <- and <? as operators
      assert_includes tokens.map(&:first), 'Operator'
    end

    it 'lexes pipeline operators correctly' do
      tokens = subject.lex('data >> transform >> format')
      
      # Should highlight >> as operators
      assert_includes tokens.map(&:first), 'Operator'
    end

    it 'lexes function definitions correctly' do
      tokens = subject.lex('fn process_data(input: String) -> Result<String, Error> {')
      
      # Should identify function name
      assert_includes tokens.map(&:first), 'Name.Function'
    end

    it 'lexes actor definitions correctly' do
      tokens = subject.lex('actor MessageHandler {')
      
      # Should identify actor name as class
      assert_includes tokens.map(&:first), 'Name.Class'
    end

    it 'lexes string interpolation correctly' do
      tokens = subject.lex('"Result: ${value}, Status: ${status}"')
      
      # Should handle interpolation
      assert_includes tokens.map(&:first), 'String.Interpol'
    end

    it 'lexes numeric literals correctly' do
      code = '0b1010 0o755 0xFF 123u32 3.14f64'
      tokens = subject.lex(code)
      
      # Should identify different number formats
      assert_includes tokens.map(&:first), 'Number.Bin'
      assert_includes tokens.map(&:first), 'Number.Oct'
      assert_includes tokens.map(&:first), 'Number.Hex'
      assert_includes tokens.map(&:first), 'Number.Integer'
      assert_includes tokens.map(&:first), 'Number.Float'
    end

    it 'lexes comments with SATD detection' do
      tokens = subject.lex('// TODO: implement this feature')
      
      # Should highlight SATD keywords
      assert_includes tokens.map(&:first), 'Comment.Special'
    end

    it 'lexes lifetimes correctly' do
      tokens = subject.lex("'static 'lifetime")
      
      # Should identify lifetimes
      assert_includes tokens.map(&:first), 'Name.Label'
    end

    it 'lexes attributes correctly' do
      tokens = subject.lex('#[derive(Debug)] #![allow(dead_code)]')
      
      # Should identify attributes
      assert_includes tokens.map(&:first), 'Comment.Preproc'
    end

    it 'lexes raw strings correctly' do
      tokens = subject.lex('r#"This is a raw string with "quotes""#')
      
      # Should handle raw strings
      assert_includes tokens.map(&:first), 'String.Other'
    end

    it 'lexes macro invocations correctly' do
      tokens = subject.lex('println! vec! format!')
      
      # Should identify macros
      assert_includes tokens.map(&:first), 'Name.Builtin'
    end
  end

  describe 'analysis' do
    it 'returns score for Ruchy-specific constructs' do
      assert Rouge::Lexers::Ruchy.analyze_text('actor MessageProcessor {') > 0
      assert Rouge::Lexers::Ruchy.analyze_text('spawn(Actor::new())') > 0
      assert Rouge::Lexers::Ruchy.analyze_text('data >> transform') > 0
      assert Rouge::Lexers::Ruchy.analyze_text('actor <- message') > 0
    end

    it 'returns zero score for non-Ruchy code' do
      assert_equal 0.0, Rouge::Lexers::Ruchy.analyze_text('console.log("hello")')
      assert_equal 0.0, Rouge::Lexers::Ruchy.analyze_text('print("hello world")')
    end
  end
end