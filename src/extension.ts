import * as vscode from 'vscode';
import { TiptapEditorProvider } from './TiptapEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(TiptapEditorProvider.register(context));
}
