import * as childProcess from 'child_process';
import * as validator from './validator';
import * as util from './util';
import * as vscode from 'vscode';

const isBinaryFile = require('isbinaryfile');

export function open(target: string) {
    target = util.replaceTidleWithHomeDir(target);

    switch (true) {
    case validator.isApp(target):
        openApp(target);
        break;

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
        vscode.window.showErrorMessage(`Oops! item \`${target}\` can not be opened`);
        break;
    }
}

export function openApp(target: string) {
    childProcess.exec(`open "${target}"`);
}

export function openFile(target: string) {
    if (isBinaryFile.sync(target)) {
        if (validator.win()) {
            childProcess.exec(`explorer "${target}"`);
        }

        if (validator.mac()) {
            childProcess.exec(`open "${target}"`);
        }

    } else {
        vscode.workspace.openTextDocument(target).then(doc => {
            const activeEditor = vscode.window.activeTextEditor;
            const column = activeEditor && activeEditor.viewColumn || 1;
            vscode.window.showTextDocument(doc, column);
        });
    }
}

export function openDirectory(target: string) {
    if (validator.win()) {
        childProcess.exec(`start "" "${target}"`);
    }

    if (validator.mac()) {
        childProcess.exec(`open "${target}"`);
    }
}

export function openUrl(target: string) {
    require('open')(target);
}
