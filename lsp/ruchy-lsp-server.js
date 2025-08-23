#!/usr/bin/env node
/**
 * Ruchy Language Server Protocol Implementation
 * Standalone LSP server for Ruchy syntax highlighting and basic language features
 * 
 * @fileoverview LSP server providing syntax highlighting, basic completion, and error detection
 * @version 1.0.0
 * @license MIT
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Ruchy Language Server - Node.js wrapper for Rust LSP implementation
 * 
 * This server bridges between editors and the Ruchy LSP implementation,
 * providing syntax highlighting, diagnostics, and basic language features.
 */
class RuchyLanguageServer {
  constructor() {
    this.serverPath = this.findRuchyLspServer();
    this.serverProcess = null;
  }

  /**
   * Find the Ruchy LSP server binary
   * @returns {string} Path to the LSP server binary
   * @throws {Error} If the server binary is not found
   */
  findRuchyLspServer() {
    // Try multiple locations for the LSP server
    const possiblePaths = [
      // Local development
      path.join(__dirname, '..', '..', 'ruchy', 'target', 'release', 'ruchy'),
      path.join(__dirname, '..', '..', 'ruchy', 'target', 'debug', 'ruchy'),
      
      // System installation
      '/usr/local/bin/ruchy',
      '/usr/bin/ruchy',
      
      // npm global installation
      path.join(process.env.HOME || process.env.USERPROFILE || '', '.npm', 'bin', 'ruchy'),
      
      // Fallback to PATH
      'ruchy'
    ];

    for (const serverPath of possiblePaths) {
      if (serverPath === 'ruchy' || fs.existsSync(serverPath)) {
        return serverPath;
      }
    }

    throw new Error('Ruchy LSP server not found. Please install the Ruchy language or build from source.');
  }

  /**
   * Start the LSP server
   * @param {Object} options - Server options
   * @param {boolean} options.stdio - Use stdio communication (default: true)
   * @param {number} options.port - TCP port for debugging (optional)
   */
  start(options = {}) {
    const { stdio = true, port } = options;

    const args = ['lsp'];
    if (port) {
      args.push('--port', port.toString());
    }

    try {
      this.serverProcess = spawn(this.serverPath, args, {
        stdio: stdio ? 'inherit' : 'pipe',
        env: {
          ...process.env,
          RUST_LOG: process.env.RUST_LOG || 'info'
        }
      });

      this.serverProcess.on('error', (error) => {
        console.error('Failed to start Ruchy LSP server:', error.message);
        process.exit(1);
      });

      this.serverProcess.on('exit', (code, signal) => {
        if (code !== 0) {
          console.error(`Ruchy LSP server exited with code ${code} (signal: ${signal})`);
          process.exit(code || 1);
        }
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => this.shutdown());
      process.on('SIGTERM', () => this.shutdown());

    } catch (error) {
      console.error('Error starting Ruchy LSP server:', error.message);
      console.error('\nTroubleshooting:');
      console.error('1. Install Ruchy: cargo install ruchy');
      console.error('2. Build from source: cd ../ruchy && cargo build --release');
      console.error('3. Check PATH includes Ruchy binary');
      process.exit(1);
    }
  }

  /**
   * Shutdown the LSP server gracefully
   */
  shutdown() {
    if (this.serverProcess && !this.serverProcess.killed) {
      this.serverProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds
      setTimeout(() => {
        if (!this.serverProcess.killed) {
          this.serverProcess.kill('SIGKILL');
        }
      }, 5000);
    }
    process.exit(0);
  }
}

/**
 * CLI interface for the Ruchy LSP server
 */
function main() {
  const args = process.argv.slice(2);
  const server = new RuchyLanguageServer();

  // Parse command line arguments
  const options = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--port':
        options.port = parseInt(args[++i], 10);
        options.stdio = false;
        break;
      case '--tcp':
        options.stdio = false;
        break;
      case '--help':
      case '-h':
        console.log(`
Ruchy Language Server

Usage: ruchy-lsp-server [options]

Options:
  --port <port>    Start server on TCP port (for debugging)
  --tcp           Use TCP communication instead of stdio
  --help, -h      Show this help message

Examples:
  ruchy-lsp-server                # Start with stdio (for editors)
  ruchy-lsp-server --port 8080    # Start on TCP port 8080 (debugging)

Environment Variables:
  RUST_LOG        Set log level (error, warn, info, debug, trace)

Editor Configuration:
  VS Code: Install the Ruchy extension
  Vim/Neovim: Use with coc.nvim or nvim-lspconfig
  Emacs: Use with lsp-mode
        `);
        process.exit(0);
        break;
    }
  }

  console.log('Starting Ruchy Language Server...');
  if (options.port) {
    console.log(`TCP mode on port ${options.port}`);
  } else {
    console.log('Stdio mode (for editor integration)');
  }

  server.start(options);
}

// Export for programmatic use
module.exports = { RuchyLanguageServer };

// Run CLI if called directly
if (require.main === module) {
  main();
}