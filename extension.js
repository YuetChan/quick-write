const vscode = require('vscode');
const { v4: uuidv4 } = require('uuid');

let configCache = null

let globalPanel = null

function init_panel(context) {
    const panel = vscode.window.createWebviewPanel(
        panelId, 
        'Code Meta Note', 
        vscode.ViewColumn.Two, 
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = `
    <html>
    <body>
        <textarea id="editor" style="width:600px;height:600px"></textarea>
        <script>
            const vscode = acquireVsCodeApi();

            const editor = document.getElementById('editor');

            editor.addEventListener('input', event => {
                vscode.postMessage({
                    command: 'updateText',
                    text: event.target.value
                });
            });
            
        </script>
    </body>
    </html>
    `;

    globalPanel = panel

    globalPanel.webview.onDidReceiveMessage(
        message => {
            console.log(message)
        },
        undefined,
        context.subscriptions
    );

    globalPanel.onDidDispose(() => {
        console.log('WebviewPanel disposed.');
        globalPanel = null
    });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let openFile = vscode.commands.registerCommand('code-meta-ext.openFile', function () {
        let workspaceDir = vscode.workspace.workspaceFolders[0];
        let fpath = vscode.Uri.joinPath(workspaceDir.uri, 's_config.json');

        if (!globalPanel) {
            panelId  = `code-meta-${uuidv4}`

            vscode.workspace.fs.readFile(fpath)
            .then(content => {
                configCache = content

                init_panel(context)
            })
            .catch(error => {
                console.error(error);
            });
        }else {
            globalPanel.reveal(vscode.ViewColumn.Two, true);
        }
	});

	let closeFile = vscode.commands.registerCommand('code-meta-ext.closeFile', function () {
        globalPanel.dispose()
	});

	context.subscriptions.push(openFile, closeFile);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
