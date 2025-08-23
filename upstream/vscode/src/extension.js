/**
 * VS Code Extension for Ruchy Language Support
 * RSYN-0501: VS Code extension implementation
 * 
 * Quality Requirements:
 * - Test Coverage: ≥80%
 * - Cyclomatic Complexity: ≤20
 * - Zero lint warnings
 */

const vscode = require('vscode');
const path = require('path');
const fs = require('fs').promises;

/**
 * Extension activation
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Ruchy Language Support is now active!');

  // Register commands
  const runFileCommand = vscode.commands.registerCommand('ruchy.runFile', runCurrentFile);
  const runTestsCommand = vscode.commands.registerCommand('ruchy.runTests', runTests);
  const formatDocumentCommand = vscode.commands.registerCommand('ruchy.formatDocument', formatDocument);

  context.subscriptions.push(runFileCommand, runTestsCommand, formatDocumentCommand);

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider('ruchy', {
    provideHover: provideHoverInfo
  });

  context.subscriptions.push(hoverProvider);

  // Register completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider('ruchy', {
    provideCompletionItems: provideCompletions
  }, '.', ':', '<', '>');

  context.subscriptions.push(completionProvider);

  // Register code lens provider
  const codeLensProvider = vscode.languages.registerCodeLensProvider('ruchy', {
    provideCodeLenses: provideCodeLenses
  });

  context.subscriptions.push(codeLensProvider);

  // Register diagnostic provider
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('ruchy');
  context.subscriptions.push(diagnosticCollection);

  // Watch for file changes
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.{rhy,ruchy}');
  
  watcher.onDidChange(uri => updateDiagnostics(uri, diagnosticCollection));
  watcher.onDidCreate(uri => updateDiagnostics(uri, diagnosticCollection));
  watcher.onDidDelete(uri => diagnosticCollection.delete(uri));

  context.subscriptions.push(watcher);

  // Initial diagnostics
  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document.uri, diagnosticCollection);
  }

  // Status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(symbol-misc) Ruchy';
  statusBarItem.tooltip = 'Ruchy Language Support Active';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

/**
 * Extension deactivation
 */
function deactivate() {
  console.log('Ruchy Language Support deactivated');
}

/**
 * Run current Ruchy file
 */
async function runCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('No active file to run');
    return;
  }

  const document = editor.document;
  if (document.languageId !== 'ruchy') {
    vscode.window.showWarningMessage('Current file is not a Ruchy file');
    return;
  }

  const filePath = document.fileName;
  const terminal = vscode.window.createTerminal('Ruchy');
  terminal.show();
  terminal.sendText(`ruchy run ${filePath}`);
}

/**
 * Run Ruchy tests
 */
async function runTests() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('No workspace folder open');
    return;
  }

  const terminal = vscode.window.createTerminal('Ruchy Tests');
  terminal.show();
  terminal.sendText('ruchy test');
}

/**
 * Format Ruchy document
 */
async function formatDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const document = editor.document;
  if (document.languageId !== 'ruchy') {
    return;
  }

  // Save document first
  await document.save();
  
  // Run formatter
  const terminal = vscode.window.createTerminal('Ruchy Format');
  terminal.sendText(`ruchy fmt ${document.fileName}`);
  terminal.dispose();
  
  // Reload document
  setTimeout(() => {
    vscode.commands.executeCommand('workbench.action.files.revert');
  }, 500);
}

/**
 * Provide hover information
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 */
function provideHoverInfo(document, position) {
  const range = document.getWordRangeAtPosition(position);
  const word = document.getText(range);

  // Ruchy-specific hover information
  const hoverInfo = {
    'actor': 'An actor is a concurrent unit of computation that processes messages',
    'spawn': 'Creates a new actor instance',
    '>>': 'Pipeline operator - chains function calls left to right',
    '<-': 'Actor send operator - sends a message to an actor',
    '<?': 'Actor ask operator - sends a message and waits for response',
    'Result': 'Type for operations that may fail: Result<T, E>',
    'Option': 'Type for optional values: Option<T>',
    'match': 'Pattern matching expression',
    'impl': 'Implementation block for types and traits'
  };

  if (hoverInfo[word]) {
    return new vscode.Hover(hoverInfo[word]);
  }

  return null;
}

/**
 * Provide code completions
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 */
function provideCompletions(document, position) {
  const completions = [];

  // Keywords
  const keywords = ['fn', 'let', 'mut', 'const', 'struct', 'enum', 'trait', 'impl', 'actor', 'spawn'];
  keywords.forEach(keyword => {
    const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
    item.detail = `Ruchy keyword: ${keyword}`;
    completions.push(item);
  });

  // Built-in types
  const types = ['String', 'Vec', 'HashMap', 'Result', 'Option', 'Box', 'Arc', 'Rc'];
  types.forEach(type => {
    const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Class);
    item.detail = `Built-in type: ${type}`;
    completions.push(item);
  });

  // Operators
  const operators = [
    { label: '>>', detail: 'Pipeline operator', insertText: ' >> ' },
    { label: '<-', detail: 'Actor send operator', insertText: ' <- ' },
    { label: '<?', detail: 'Actor ask operator', insertText: ' <? ' }
  ];
  
  operators.forEach(op => {
    const item = new vscode.CompletionItem(op.label, vscode.CompletionItemKind.Operator);
    item.detail = op.detail;
    item.insertText = op.insertText;
    completions.push(item);
  });

  return completions;
}

/**
 * Provide code lenses
 * @param {vscode.TextDocument} document
 */
function provideCodeLenses(document) {
  const codeLenses = [];
  const text = document.getText();
  const lines = text.split('\n');

  lines.forEach((line, index) => {
    // Find test functions
    if (line.includes('#[test]') || line.includes('fn test_')) {
      const range = new vscode.Range(index, 0, index, line.length);
      const command = {
        title: '▶ Run Test',
        command: 'ruchy.runTest',
        arguments: [document.uri, index]
      };
      codeLenses.push(new vscode.CodeLens(range, command));
    }

    // Find main function
    if (line.includes('fn main()')) {
      const range = new vscode.Range(index, 0, index, line.length);
      const command = {
        title: '▶ Run',
        command: 'ruchy.runFile'
      };
      codeLenses.push(new vscode.CodeLens(range, command));
    }

    // Find actor definitions
    if (line.includes('actor ')) {
      const range = new vscode.Range(index, 0, index, line.length);
      const command = {
        title: '📡 Debug Actor',
        command: 'ruchy.debugActor',
        arguments: [document.uri, index]
      };
      codeLenses.push(new vscode.CodeLens(range, command));
    }
  });

  return codeLenses;
}

/**
 * Update diagnostics for a document
 * @param {vscode.Uri} uri
 * @param {vscode.DiagnosticCollection} diagnosticCollection
 */
async function updateDiagnostics(uri, diagnosticCollection) {
  if (path.extname(uri.fsPath) !== '.rhy' && path.extname(uri.fsPath) !== '.ruchy') {
    return;
  }

  const diagnostics = [];
  
  try {
    const content = await fs.readFile(uri.fsPath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for common issues
      
      // Missing semicolons (simplified check)
      if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') && !line.includes('//')) {
        const lastChar = line.length - 1;
        const range = new vscode.Range(index, lastChar, index, lastChar + 1);
        const diagnostic = new vscode.Diagnostic(
          range,
          'Missing semicolon',
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.code = 'missing-semicolon';
        diagnostics.push(diagnostic);
      }

      // TODO comments
      if (line.includes('TODO:') || line.includes('FIXME:')) {
        const todoIndex = line.indexOf('TODO:') !== -1 ? line.indexOf('TODO:') : line.indexOf('FIXME:');
        const range = new vscode.Range(index, todoIndex, index, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          'TODO comment found',
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.code = 'todo-comment';
        diagnostics.push(diagnostic);
      }

      // Unused variables (simplified check)
      const letMatch = line.match(/let\s+(_?\w+)\s*=/);
      if (letMatch && letMatch[1].startsWith('_')) {
        const range = new vscode.Range(index, 0, index, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          `Variable '${letMatch[1]}' is prefixed with underscore (possibly unused)`,
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.code = 'unused-variable';
        diagnostics.push(diagnostic);
      }
    });

  } catch (error) {
    console.error('Error reading file:', error);
  }

  diagnosticCollection.set(uri, diagnostics);
}

module.exports = {
  activate,
  deactivate
};