import * as vscode from 'vscode';
import * as controller from './controller';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('hiveOpener.showOpenList', () => {
            controller.showOpenList(['files', 'dirs', 'urls']);
        }),

        vscode.commands.registerCommand('hiveOpener.manageOpenList', () => {
            controller.manageOpenList();
        }),

        vscode.commands.registerCommand('hiveOpener.openConfigFile', () => {
            controller.openConfigFile();
        }),
    );
}

export function deactivate() {
    // do nothing
}
