'use strict';

import * as childProcess from 'child_process';
import * as validator from './validator';
import * as vscode from 'vscode';

const isBinaryFile = require('isbinaryfile');

export function open(target: string) {
	switch (true) {
    case validator.isUrl(target):
        openUrl(target);
        break;

    case validator.isFile(target):
        openFile(target);
        break;

    case validator.isDirectory(target):
        openDirectory(target);
        break;

    default:
        return false;
    }
}

export function openFile(target: string) {
    if (isBinaryFile.sync(target)) {
        childProcess.exec(`explorer "${target}"`);

    } else {
        vscode.workspace.openTextDocument(target).then(doc => {
            const activeEditor = vscode.window.activeTextEditor;
            const column = activeEditor && activeEditor.viewColumn || 1;
            vscode.window.showTextDocument(doc, column);
        });
    }
}

export function openDirectory(target: string) {
    childProcess.exec(`start "" "${target}"`);
}

export function openUrl(target: string) {
    require('open')(target);
}
