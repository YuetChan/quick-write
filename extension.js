// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let openFile = vscode.commands.registerCommand('code-meta-ext.openFile', function () {
		// The code you place here will be executed every time the command is executed

		// Get the currently opened workspace folder
		let workspaceFolder = vscode.workspace.workspaceFolders[0];

		// Define the file path to read within the workspace folder
		let fpath = vscode.Uri.joinPath(workspaceFolder.uri, 's_config.json');
		console.log(fpath)

        // Read the file using the `readFile` method of the `vscode.workspace.fs` API
        vscode.workspace.fs.readFile(fpath)
            .then(content => {
                // Convert the content to a string
                let fContent = new TextDecoder().decode(content);

                // Display the file content in a new editor
                vscode.workspace.openTextDocument({ content: fContent })
                    .then(document => {
                        vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Two });
                    });
            })
            .catch(error => {
                console.error(error);
            });

	});


	let closeFile = vscode.commands.registerCommand('code-meta-ext.closeFile', function () {
		// The code you place here will be executed every time the command is executed

		// Get the currently opened workspace folder
		let workspaceFolder = vscode.workspace.workspaceFolders[0];

		// Define the file path to read within the workspace folder
		let fpath = vscode.Uri.joinPath(workspaceFolder.uri, 's_config.json');
		console.log(fpath)

        // Read the file using the `readFile` method of the `vscode.workspace.fs` API
        vscode.workspace.fs.readFile(fpath)
            .then(content => {
                // Convert the content to a string
                let fContent = new TextDecoder().decode(content);

                // Display the file content in a new editor
                vscode.workspace.openTextDocument({ content: fContent })
                    .then(document => {
                        vscode.window.showTextDocument(document, { viewColumn: vscode.ViewColumn.Two });
                    });
            })
            .catch(error => {
                console.error(error);
            });

	});

	context.subscriptions.push(openFile, closeFile);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
