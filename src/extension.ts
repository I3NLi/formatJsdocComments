import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "formatJsdocComments" is now active!');

	let disposable = vscode.commands.registerCommand('formatJsdocComments.format', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active document found.');
			return;
		}

		const document = editor.document;
		const text = document.getText();
		const regex = /[\t]*[ ]*\/\*\*([\s\S]*?)\*\//g;

		const edits: vscode.TextEdit[] = [];

		while (true) {
			const match = regex.exec(text);
			if (!match) {
				break;
			}

			const jsdocComment = match[0];

			const lines = jsdocComment.split('\n');

			if (lines.length < 3) {
				continue;
			}


			const matchIndent = lines[0].indexOf("/");

			const formattedComment = lines
				.map((line, index) => {
					if (index === 0) {
						return line;
					} else if (index === lines.length - 1) {
						const trimmedLine = line.trim();
						return `${" ".repeat(matchIndent)} ${trimmedLine}`;
					}
					else {
						const trimmedLine = line.trim();
						let strippedLine = trimmedLine;
						if (trimmedLine.startsWith('* ')) {
							strippedLine = trimmedLine.substring(2)
						} else if (trimmedLine.startsWith('*') || trimmedLine.startsWith(' ')) {
							strippedLine = trimmedLine.substring(1)
						}
						return `${" ".repeat(matchIndent)} * ${strippedLine}`;
					}
				})
				.join('\n');

			const startIndex = document.positionAt(match.index);
			const endIndex = document.positionAt(match.index + jsdocComment.length);
			const range = new vscode.Range(startIndex, endIndex);
			edits.push(new vscode.TextEdit(range, formattedComment));
		}

		const editBuilder = new vscode.WorkspaceEdit();
		editBuilder.set(document.uri, edits);
		vscode.workspace.applyEdit(editBuilder);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
