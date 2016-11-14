'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('hiveOpener.showOpenList', () => {
            vscode.window.showInformationMessage('showOpenList');
        }),

        vscode.commands.registerCommand('hiveOpener.manageOpenList', () => {
            vscode.window.showInformationMessage('manageOpenList');
        }),

        vscode.commands.registerCommand('hiveOpener.openConfigFile', () => {
            vscode.window.showInformationMessage('openConfigFile');
        }),
    );
}

export function deactivate() {
}