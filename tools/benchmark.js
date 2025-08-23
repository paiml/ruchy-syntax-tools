#!/usr/bin/env node

/**
 * Performance benchmark tool for Ruchy syntax highlighting
 * Measures grammar performance against various file sizes and complexity levels
 */

const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');
const yaml = require('js-yaml');

class GrammarBenchmark {
  constructor() {
    this.grammarFile = path.join(__dirname, '..', 'grammars', 'textmate', 'ruchy.tmLanguage.json');
    this.fixturesDir = path.join(__dirname, '..', 'test', 'fixtures');
    this.results = {
      fixtures: [],
      summary: {}
    };
  }

  async run() {
    console.log('⚡ Running Ruchy Grammar Performance Benchmarks\n');
    console.log('═'.repeat(60));

    try {
      // Load grammar
      const grammar = await this.loadGrammar();

      // Run benchmarks on test fixtures
      await this.benchmarkFixtures(grammar);

      // Generate synthetic benchmarks
      await this.benchmarkSynthetic(grammar);

      // Report results
      this.reportResults();

      // Check performance targets
      await this.checkPerformanceTargets();

    } catch (error) {
      console.error('❌ Benchmark failed:', error.message);
      process.exit(1);
    }
  }

  async loadGrammar() {
    const content = await fs.readFile(this.grammarFile, 'utf8');
    return JSON.parse(content);
  }

  async benchmarkFixtures(grammar) {
    console.log('📊 Benchmarking Test Fixtures:\n');

    const files = await fs.readdir(this.fixturesDir);
    const fixtures = files.filter(f => f.endsWith('.rhy'));

    for (const fixture of fixtures) {
      const filePath = path.join(this.fixturesDir, fixture);
      const content = await fs.readFile(filePath, 'utf8');
      const lines = content.split('\n');

      // Warm up
      for (let i = 0; i < 3; i++) {
        this.simulateHighlighting(content, grammar);
      }

      // Benchmark
      const runs = 100;
      const startTime = performance.now();

      for (let i = 0; i < runs; i++) {
        this.simulateHighlighting(content, grammar);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / runs;
      const fileSize = content.length;
      const lineCount = lines.length;

      this.results.fixtures.push({
        name: fixture,
        avgTime: avgTime.toFixed(3),
        fileSize,
        lineCount,
        throughput: (fileSize / avgTime * 1000).toFixed(0) // bytes/sec
      });

      console.log(`  ${fixture.padEnd(30)} ${avgTime.toFixed(3)}ms (${lineCount} lines, ${fileSize} bytes)`);
    }
    console.log();
  }

  async benchmarkSynthetic(grammar) {
    console.log('🔬 Synthetic Benchmarks:\n');

    const testCases = [
      { name: 'Small file (100 lines)', lines: 100 },
      { name: 'Medium file (1,000 lines)', lines: 1000 },
      { name: 'Large file (10,000 lines)', lines: 10000 },
      { name: 'Very large file (50,000 lines)', lines: 50000 }
    ];

    for (const testCase of testCases) {
      const content = this.generateSyntheticCode(testCase.lines);

      // Warm up
      for (let i = 0; i < 3; i++) {
        this.simulateHighlighting(content, grammar);
      }

      // Benchmark
      const runs = testCase.lines > 10000 ? 10 : 50;
      const startTime = performance.now();

      for (let i = 0; i < runs; i++) {
        this.simulateHighlighting(content, grammar);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / runs;

      console.log(`  ${testCase.name.padEnd(30)} ${avgTime.toFixed(3)}ms`);

      // Store for summary
      if (!this.results.summary[testCase.lines]) {
        this.results.summary[testCase.lines] = avgTime;
      }
    }
    console.log();
  }

  generateSyntheticCode(lines) {
    const patterns = [
      '// Comment line',
      'let variable = 42',
      'fn function_name(param: Type) -> Result<T> {',
      '    match value {',
      '        Some(x) => process(x),',
      '        None => default_value',
      '    }',
      '}',
      'struct DataStructure<T> where T: Trait {',
      '    field: T,',
      '}',
      'impl<T> DataStructure<T> {',
      '    fn method(&self) -> &T {',
      '        &self.field',
      '    }',
      '}',
      'actor MessageHandler {',
      '    fn handle(msg) {',
      '        sender <- response',
      '    }',
      '}',
      'let lambda = |x| x * 2',
      'let result = data >> process >> validate >> finalize',
      '/// Documentation comment',
      '/** Block documentation */',
      'let string = "Hello, World!"',
      'let number = 0xFF_00_FF',
      'let float = 3.14159e-10',
      'use std::collections::HashMap',
      'type Alias = HashMap<String, Vec<u32>>',
      'enum Option<T> { Some(T), None }',
      'trait Iterator { fn next(&mut self) -> Option<Self::Item>; }'
    ];

    const code = [];
    for (let i = 0; i < lines; i++) {
      code.push(patterns[i % patterns.length]);
    }
    return code.join('\n');
  }

  simulateHighlighting(content, grammar) {
    // Simulate the work of applying grammar patterns
    const lines = content.split('\n');
    let matches = 0;

    for (const line of lines) {
      // Check each pattern category
      if (grammar.repository) {
        for (const category in grammar.repository) {
          const patterns = grammar.repository[category].patterns || [];
          for (const pattern of patterns) {
            if (pattern.match) {
              const regex = new RegExp(pattern.match, 'g');
              const lineMatches = line.match(regex);
              if (lineMatches) {
                matches += lineMatches.length;
              }
            }
          }
        }
      }
    }

    return matches;
  }

  reportResults() {
    console.log('📈 Performance Summary:\n');
    console.log('═'.repeat(60));

    // Calculate statistics
    const times = this.results.fixtures.map(f => parseFloat(f.avgTime));
    const min = Math.min(...times);
    const max = Math.max(...times);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    console.log(`  Minimum time: ${min.toFixed(3)}ms`);
    console.log(`  Maximum time: ${max.toFixed(3)}ms`);
    console.log(`  Average time: ${avg.toFixed(3)}ms`);
    console.log();

    // Throughput analysis
    const throughputs = this.results.fixtures.map(f => parseInt(f.throughput));
    const avgThroughput = throughputs.reduce((a, b) => a + b, 0) / throughputs.length;

    console.log(`  Average throughput: ${(avgThroughput / 1024 / 1024).toFixed(2)} MB/s`);
    console.log();
  }

  async checkPerformanceTargets() {
    console.log('🎯 Performance Target Validation:\n');
    console.log('═'.repeat(60));

    const targets = {
      'Small files (<1000 lines)': { max: 25, actual: null },
      'Large files (50K lines)': { max: 25, actual: this.results.summary[50000] }
    };

    // Check small file performance
    const smallFileAvg = this.results.fixtures
      .filter(f => f.lineCount < 1000)
      .map(f => parseFloat(f.avgTime))
      .reduce((a, b, i, arr) => a + b / arr.length, 0);

    targets['Small files (<1000 lines)'].actual = smallFileAvg;

    let allTargetsMet = true;

    for (const [category, target] of Object.entries(targets)) {
      if (target.actual !== null) {
        const status = target.actual <= target.max ? '✅' : '❌';
        const color = target.actual <= target.max ? '\x1b[32m' : '\x1b[31m';
        const reset = '\x1b[0m';

        console.log(`  ${category}:`);
        console.log(`    Target: ≤${target.max}ms`);
        console.log(`    Actual: ${color}${target.actual?.toFixed(3)}ms${reset} ${status}`);
        console.log();

        if (target.actual > target.max) {
          allTargetsMet = false;
        }
      }
    }

    if (allTargetsMet) {
      console.log('✅ All performance targets met!');
    } else {
      console.log('⚠️  Some performance targets not met. Consider optimization.');
    }

    // Grammar complexity analysis
    console.log('\n📊 Grammar Complexity Analysis:\n');
    console.log('═'.repeat(60));

    const grammarSize = JSON.stringify(this.results.grammar || {}).length;
    console.log(`  Grammar file size: ${(grammarSize / 1024).toFixed(2)} KB`);

    const patternCount = this.countPatterns(await this.loadGrammar());
    console.log(`  Total patterns: ${patternCount}`);
    console.log(`  Average complexity: ${(grammarSize / patternCount).toFixed(0)} bytes/pattern`);
  }

  countPatterns(grammar) {
    let count = 0;

    function traverse(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(traverse);
      } else if (obj && typeof obj === 'object') {
        if (obj.patterns) {
          count += obj.patterns.length;
        }
        Object.values(obj).forEach(traverse);
      }
    }

    traverse(grammar);
    return count;
  }
}

// Run benchmark if called directly
if (require.main === module) {
  const benchmark = new GrammarBenchmark();
  benchmark.run().catch(error => {
    console.error('Benchmark crashed:', error);
    process.exit(1);
  });
}

module.exports = GrammarBenchmark;