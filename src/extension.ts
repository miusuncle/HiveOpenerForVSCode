import * as vscode from 'vscode';
import * as controller from './controller';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('hiveOpener.showOpenerList', () => {
            controller.showOpenerList(['files', 'dirs', 'urls']);
        }),

        vscode.commands.registerCommand('hiveOpener.manageOpenerList', () => {
            controller.manageOpenerList();
        }),

        vscode.commands.registerCommand('hiveOpener.openConfigFile', () => {
            controller.openConfigFile();
        }),

        vscode.commands.registerCommand('hiveOpener.addItemToOpenerList', () => {
            controller.addItemToOpenerList();
        }),

        vscode.commands.registerCommand('hiveOpener.editItemFromOpenerList', () => {
            controller.editItemFromOpenerList();
        }),

        vscode.commands.registerCommand('hiveOpener.removeItemFromOpenerList', () => {
            controller.removeItemFromOpenerList();
        }),
    );
}

export function deactivate() {
    // do nothing
}
