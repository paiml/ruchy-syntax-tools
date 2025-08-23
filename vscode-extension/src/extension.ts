import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import * as path from 'path';

let client: LanguageClient | undefined;
let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    // Create output channel
    outputChannel = vscode.window.createOutputChannel('Ruchy Language Server');
    context.subscriptions.push(outputChannel);

    // Register commands
    registerCommands(context);

    // Start language server if enabled
    const config = vscode.workspace.getConfiguration('ruchy');
    if (config.get<boolean>('lsp.enable', true)) {
        startLanguageServer(context);
    }

    outputChannel.appendLine('Ruchy extension activated');
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

function registerCommands(context: vscode.ExtensionContext) {
    // Restart Language Server
    const restartCmd = vscode.commands.registerCommand('ruchy.restartLanguageServer', async () => {
        if (client) {
            await client.stop();
        }
        startLanguageServer(context);
        vscode.window.showInformationMessage('Ruchy Language Server restarted');
    });

    // Show Output Channel
    const showOutputCmd = vscode.commands.registerCommand('ruchy.showOutputChannel', () => {
        outputChannel.show();
    });

    // Check Syntax
    const checkSyntaxCmd = vscode.commands.registerCommand('ruchy.checkSyntax', async () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId !== 'ruchy') {
            vscode.window.showWarningMessage('Please open a Ruchy file to check syntax');
            return;
        }

        const document = activeEditor.document;
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        
        if (diagnostics.length === 0) {
            vscode.window.showInformationMessage('✅ No syntax errors found');
        } else {
            const errorCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
            const warningCount = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
            
            let message = '❌ Syntax issues found: ';
            if (errorCount > 0) message += `${errorCount} error(s) `;
            if (warningCount > 0) message += `${warningCount} warning(s)`;
            
            vscode.window.showWarningMessage(message, 'Show Problems').then(action => {
                if (action === 'Show Problems') {
                    vscode.commands.executeCommand('workbench.panel.markers.view.focus');
                }
            });
        }
    });

    context.subscriptions.push(restartCmd, showOutputCmd, checkSyntaxCmd);
}

function startLanguageServer(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('ruchy');
    let serverPath = config.get<string>('lsp.serverPath', '');

    if (!serverPath) {
        // Try to find the LSP server
        const possiblePaths = [
            path.join(context.extensionPath, '..', '..', 'lsp', 'ruchy-lsp-server.js'),
            path.join(context.extensionPath, 'server', 'ruchy-lsp-server.js'),
            'ruchy-lsp-server.js', // Global installation
            'ruchy' // Rust binary
        ];

        for (const testPath of possiblePaths) {
            try {
                require.resolve(testPath);
                serverPath = testPath;
                break;
            } catch {
                // Continue to next path
            }
        }
    }

    if (!serverPath) {
        outputChannel.appendLine('Warning: Ruchy LSP server not found. Language features will be limited.');
        outputChannel.appendLine('Please install the Ruchy language server or configure ruchy.lsp.serverPath');
        return;
    }

    // Server options
    const serverOptions: ServerOptions = {
        run: {
            command: 'node',
            args: [serverPath],
            transport: TransportKind.stdio
        },
        debug: {
            command: 'node',
            args: [serverPath, '--debug'],
            transport: TransportKind.stdio
        }
    };

    // Client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'ruchy' }
        ],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.rhy')
        },
        outputChannel: outputChannel
    };

    // Create and start the client
    client = new LanguageClient(
        'ruchyLanguageServer',
        'Ruchy Language Server',
        serverOptions,
        clientOptions
    );

    // Start the client (also starts the server)
    client.start().then(() => {
        outputChannel.appendLine('Ruchy Language Server started successfully');
    }).catch(error => {
        outputChannel.appendLine(`Failed to start Ruchy Language Server: ${error}`);
    });
}

// Provide basic language features if LSP is not available
class RuchyDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        // Basic implementation - could be enhanced
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) return;

        const word = document.getText(wordRange);
        
        // Simple heuristic: look for function definitions
        const text = document.getText();
        const fnRegex = new RegExp(`fn\\s+${word}\\s*\\(`, 'g');
        const match = fnRegex.exec(text);
        
        if (match) {
            const pos = document.positionAt(match.index);
            return new vscode.Location(document.uri, pos);
        }

        return null;
    }
}

class RuchyHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) return;

        const word = document.getText(wordRange);
        
        // Provide hover information for Ruchy-specific keywords
        const ruchyKeywords: { [key: string]: string } = {
            'actor': 'Defines an actor - a concurrent entity that processes messages',
            'spawn': 'Creates a new actor instance',
            'send': 'Sends a message to an actor using the `<-` operator',
            '>>': 'Pipeline operator - passes the result of left expression to right function',
            '<-': 'Actor send operator - sends a message to an actor',
            '<?': 'Actor ask operator - sends a message and waits for a response',
        };

        if (ruchyKeywords[word]) {
            const markdown = new vscode.MarkdownString(`**${word}**\n\n${ruchyKeywords[word]}`);
            return new vscode.Hover(markdown, wordRange);
        }

        return null;
    }
}

// Register fallback providers if LSP is not available
vscode.languages.registerDefinitionProvider('ruchy', new RuchyDefinitionProvider());
vscode.languages.registerHoverProvider('ruchy', new RuchyHoverProvider());