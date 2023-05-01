const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');

// const assert = require('chai').assert;
const extension = require('../../extension');


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('activate function should update workspaceState with config file path', () => {
		// Create a fake extension context
		const context = {
		  workspaceState: {
			update: (key, value, target) => {
			  	// Assert that the correct key, value, and target are passed to workspaceState.update
			  	assert.equal(key, 'config_fpath');
			  	assert.equal(value, 'test/config.json');
			  	assert.equal(target, vscode.ConfigurationTarget.Workspace);
			}
		  }
		};
	
		// // Stub showFileDialog to return a file path
		// const showFileDialogStub = sinon.stub(extension, 'showFileDialog').resolves('test/config.json');
	
		// // Call the activate function
		// extension.activate(context);
	
		// // Restore the stubbed function
		// showFileDialogStub.restore();
	  });


});
