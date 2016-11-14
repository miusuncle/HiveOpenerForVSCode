import * as fs from 'fs';
import * as paths from 'path';
import * as validUrl from 'valid-url';
import * as childProcess from 'child_process';
import * as vscode from 'vscode';

const isBinaryFile = require('isbinaryfile');
const open = require('open');

export function isFile(target: string) {
    try {
        return fs.lstatSync(target).isFile();
    } catch (e) {
        return false;
    }
}

export function isDirectory(target: string) {
    try {
        return fs.lstatSync(target).isDirectory();
    } catch (e) {
        return false;
    }
}

export function isUrl(target: string) {
    return !!validUrl.isWebUri(target);
}

export function getItemType(target: string) {
    if (isUrl(target)) {
        return 'URL';
    }

    if (isDirectory(target)) {
        return 'DIR';
    }

    if (isFile(target)) {
        return paths.extname(target).slice(1).toUpperCase() || 'FILE';
    }

    return 'UNKNOWN';
}

export function openFile(target: string) {
    if (isBinaryFile.sync(target)) {
        open(target);

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
    open(target);
}