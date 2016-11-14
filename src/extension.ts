'use strict';

import * as vscode from 'vscode';
import * as hiveOpener from './hive-opener';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('hiveOpener.showOpenList', () => {
            hiveOpener.showOpenList();

        }),

        vscode.commands.registerCommand('hiveOpener.manageOpenList', () => {
            hiveOpener.manageOpenList();
        }),

        vscode.commands.registerCommand('hiveOpener.openConfigFile', () => {
            hiveOpener.openConfigFile();
        }),
    );
}

export function deactivate() {
}