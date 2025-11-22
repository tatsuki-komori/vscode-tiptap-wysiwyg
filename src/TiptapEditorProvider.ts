import * as vscode from 'vscode';

export class TiptapEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new TiptapEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(TiptapEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'tiptap-wysiwyg.markdownEditor';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.joinPath(this.context.extensionUri, 'dist')
			]
		};

		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		// Update webview when the document changes
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
			if (e.document.uri.toString() === document.uri.toString()) {
				webviewPanel.webview.postMessage({
					type: 'update',
					text: document.getText(),
				});
			}
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage((e: any) => {
			switch (e.type) {
				case 'ready':
					webviewPanel.webview.postMessage({
						type: 'update',
						text: document.getText(),
					});
					return;
				case 'update':
					this.updateTextDocument(document, e.text);
					return;
			}
		});

		// Initial update is handled by the 'ready' message from the webview
		// webviewPanel.webview.postMessage({
		// 	type: 'update',
		// 	text: document.getText(),
		// });

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});
	}

	private getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview.js'));

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Tiptap Editor</title>
				<style>
					body {
						background-color: var(--vscode-editor-background);
						color: var(--vscode-editor-foreground);
						font-family: var(--vscode-font-family);
						padding: 0;
						margin: 0;
					}
					#root {
						height: 100vh;
						display: flex;
						flex-direction: column;
					}
				</style>
			</head>
			<body>
				<div id="root">Loading Tiptap Editor...</div>
				<script>
					window.addEventListener('error', function (e) {
						const root = document.getElementById('root');
						if (root) {
							root.innerHTML = '<div style="color: red; padding: 20px;">' + 
								'<h3>Runtime Error</h3>' +
								'<pre>' + e.message + '\\n' + e.filename + ':' + e.lineno + '</pre>' +
								'</div>';
						}
					});
				</script>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	private updateTextDocument(document: vscode.TextDocument, text: string) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document. 
		// In a real implementation, we would compute a diff to be more efficient and preserve cursor position if possible.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			text
		);

		return vscode.workspace.applyEdit(edit);
	}
}
