# Quick Write

Quick write is a VSCode extension that provides a shortcut to open/create note associated with active file.

## Requirements

- VSCode version 1.0 or higher.

## Installation

1. Open VSCode.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of VSCode.
3. Search for `Quick Write` in the Extensions view search bar.
4. Click the Install button to install the extension.
5. Reload VSCode after installation is complete.

## Usage

1. Press `Ctrl + F1` to prompt the user to select a datasource file. The datasource file should be a JSON file with an empty object `{}` as the initial content.
2. Select the desired datasource file.
3. The extension will cache the file path for future use.
4. Press `Ctrl + F1` again to open a note associated with the focused file in VSCode.
5. Type in notes in the note editor, and they will be automatically saved into the datasource file.
6. To clear the cached datasource file path, run the "clear cache" command from the VSCode command palette.

## License

This extension is released under the [MIT License](LICENSE).

## Contact Information

For any questions or inquiries, please contact [Yuet Chan](yuetcheukchan@gmail.com).