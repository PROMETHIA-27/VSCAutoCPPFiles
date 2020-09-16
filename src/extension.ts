// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function getWorkingPathDir(context: any, activeTextEditor: vscode.TextEditor | undefined, activeWorkspace: typeof vscode.workspace) {
	if (context instanceof vscode.Uri) {
		const fsPath = context.fsPath;
		const stats = fs.statSync(fsPath);
		return stats.isDirectory() ? fsPath : path.dirname(fsPath);
	} if (activeTextEditor) {
	  	return path.dirname(activeTextEditor.document.fileName);
	} else {
		return activeWorkspace.rootPath;
	}
}

async function createNew(context: any) {
	const pathdir = getWorkingPathDir(context, vscode.window.activeTextEditor, vscode.workspace);

	let fileNames: string | undefined = await vscode.window.showInputBox({prompt: "Input file name"});
	
	if (fileNames == undefined) { fileNames = ""; }

	fs.writeFileSync(pathdir + "/" + fileNames + ".h", "#pragma once");
	fs.writeFileSync(pathdir + "/" + fileNames + ".cpp", "");
}

export function activate(context: any) {
	context.subscriptions.push(
		vscode.commands.registerCommand("autocppfiles.createCppFiles", (context) =>
			createNew(context)
		)
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
