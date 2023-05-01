const vscode = require('vscode');

const { v4: uuidv4 } = require('uuid');
const path = require('path');

let panelId = null

let globalPanel = null

let workspaceDir = null

let dataJson = null

let currentRelativePath = null


async function showFileDialog() {
    const options = vscode.OpenDialogOptions = {
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      
      openLabel: 'Select',
      filters: {
        'Json Files': ['json']
      },
      title: 'Select a datasource file'
    };
  
    const result = await vscode.window.showOpenDialog(options);
  
    if (result && result.length > 0) {
      const fileUri = result[0];
      vscode.window.showInformationMessage(`Selected file: ${fileUri.fsPath}`);

      return fileUri.fsPath
    } else {
      vscode.window.showInformationMessage('No file selected.');
      return null
    }
}


function saveFile(uri, data) {
    vscode.workspace.fs.writeFile(uri, data).then(() => {
        console.log('Save file successfully')
    }, (error) => {
       console.error(error)
    });
}
  

function postCurrentFilenameAndData(fname, data) {
    globalPanel.webview.postMessage({
        command: 'activeFileChange',
        data: {
            'filename': fname,
            'data': data? data : ''
        }
    });
}


function initPanel(context) {
    const panel = vscode.window.createWebviewPanel(
        panelId, 
        'Code Meta Note', 
        vscode.ViewColumn.One, 
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            enableFindWidget: true
        }
    );

    panel.webview.html = `
    <html>
    <body>
        <h4>File: <span id="editor-name"></span></h4>
        <textarea id="editor" style="width:600px;height:600px"></textarea>

        <script>
            const vscode = acquireVsCodeApi();

            const name = document.getElementById('editor-name');

            const editor = document.getElementById('editor');

            editor.addEventListener('input', event => {
                vscode.postMessage({
                    command: 'updateText',
                    text: event.target.value
                });
            });

            window.addEventListener('message', event => {
                const msg = event.data;

                if(msg.command == 'activeFileChange') {
                    name.textContent = msg.data.filename
                    editor.value = msg.data.data
                }
            });
        </script>
    </body>
    </html>
    `;

    globalPanel = panel

    globalPanel.onDidDispose(() => {
        globalPanel = null
    });

    const activeEditor = vscode.window.activeTextEditor

    currentRelativePath = path.relative(workspaceDir.fsPath, activeEditor.document.fileName);
    postCurrentFilenameAndData(`./${currentRelativePath}`, dataJson[`./${currentRelativePath}`])

    globalPanel.webview.onDidReceiveMessage(
        msg => {
            // Cache the change
            dataJson[`./${currentRelativePath}`] = msg.text

            // Save the change
            saveFile(
                vscode.Uri.file(context.workspaceState.get('config_fpath')), 
                new TextEncoder().encode(JSON.stringify(dataJson, null, 2))
            )
        },
        undefined,
        context.subscriptions
    );
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if(editor && editor.document && globalPanel) {
            currentRelativePath = path.relative(workspaceDir.fsPath, editor.document.fileName)
            postCurrentFilenameAndData(`./${currentRelativePath}`, dataJson[`./${currentRelativePath}`])
        }
    });
    
    const workspaceState = context.workspaceState;

    let configFpath = null

	let openNote = vscode.commands.registerCommand('quick-write.openNote', async function () {
        if(!workspaceState.get('config_fpath')) {
            configFpath = await showFileDialog()

            if(configFpath) {
                workspaceState.update('config_fpath', configFpath, vscode.ConfigurationTarget.Workspace);
            }else {
                return
            }
        }else {
            configFpath = workspaceState.get('config_fpath')
        }

        let workspaceDirs = vscode.workspace.workspaceFolders

        if(workspaceDirs.length >  0) {
            workspaceDir = workspaceDirs[0].uri;

            let fpath = configFpath

            if (!globalPanel) {
                panelId = `code-meta-${uuidv4}`
    
                vscode.workspace.fs.readFile(vscode.Uri.file(fpath))
                .then(content => {
                    dataJson = JSON.parse(content.toString()); 

                    initPanel(context)
                })
                .catch(error => {
                    vscode.window.showErrorMessage('Failed to read datasoruce file')
                    console.error(error);
                });
            }else {
                globalPanel.reveal(vscode.ViewColumn.One, true);
            }
        }else {
            vscode.window.showErrorMessage('No folder opened')
        }
	});

    
    let clearCache = vscode.commands.registerCommand(
            'quick-write.clearCache', 
            function () {
                workspaceState.update('config_fpath', null, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage('Clear config file path cache.');
            });

	context.subscriptions.push(
        openNote, 
        clearCache
        );
}


function deactivate() {}


module.exports = {
	activate,
	deactivate
}

