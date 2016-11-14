'use strict';

import * as paths from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import * as util from './util';

type ItemTypes = 'files' | 'dirs' | 'urls';

/** 显示打开项列表 */
export function showOpenList(filters:ItemTypes[] = ['files', 'dirs', 'urls']) {
    const configFile = getConfigFilePath();

    if (!fs.existsSync(configFile)) {
        vscode.window.showInformationMessage('No open item created yet!');
        return;
    }

    const openItems = loadOpenItems(configFile, filters);
    const quickPickItems = mapItemPairsToQuickPickItems(openItems) as vscode.QuickPickItem[];

    // current operating item
    let target: string;

    vscode.window.showQuickPick(quickPickItems, {
        ignoreFocusOut: false,
        matchOnDescription: false,
        placeHolder: 'Please select an item to open',
    })
    .then(item => {
        if (item) {
            target = item.description;
            return openItem(target);
        }
    })
    .then(result => {
        if (result === false) {
            // TODO: remove item from open list
            console.log('Item to be removed:', target);
        }
    });
}

/** 管理打开项列表 */
export function manageOpenList() {
    vscode.window.showInformationMessage('manageOpenList');
}

/** 打开配置文件 */
export function openConfigFile() {
    const configFile = getConfigFilePath();

    if (fs.existsSync(configFile)) {
        vscode.workspace.openTextDocument(configFile).then(doc => {
            const activeEditor = vscode.window.activeTextEditor;
            const column = activeEditor && activeEditor.viewColumn || 1;

            vscode.window.showTextDocument(doc, column);
        });

    } else {
        const message = 'No config file created yet! Do you want to create it right now?';
        const items = { title: 'Yes' };

        vscode.window.showErrorMessage(message, items).then(option => {
            if (option && option.title === 'Yes') {
                fs.writeFileSync(configFile, JSON.stringify({}, null, '\t'));
                vscode.commands.executeCommand('hiveOpener.openConfigFile');
            }
        });
    }
}

/** 获取配置文件路径 */
function getConfigFilePath() {
    let result;

    const configFileLocation = vscode.workspace.getConfiguration('hiveOpener').get('configFileLocation');
    if (configFileLocation !== '') {
        result = paths.join(configFileLocation, getConfigFileName());
    } else {
        const appData = process.env.APPDATA;
        const channelPath = getChannelPath();
        result = paths.join(appData, channelPath, 'User', getConfigFileName());
    }

    return result;
}

/** 获取配置文件名 */
function getConfigFileName() {
    return vscode.workspace.getConfiguration('hiveOpener').get('configFileName');
}

/** 获取 VSCode 对应 Channel 配置路径 */
function getChannelPath() {
    if (vscode.env.appName.indexOf('Insiders') > 0) {
        return 'Code - Insiders';
    }

    return 'Code';
}

function mapItemPairsToQuickPickItems(itemPairs: [string, string][]) {
    return itemPairs.map(([description, label]) => {
        let detail = `[${util.getItemType(description)}] ${description}`;
        return { label, description, detail };
    });
}

function loadOpenItems(filePath: string, filters: ItemTypes[]) {
    try {
        const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return _(items).pick(filters).values().flatten().value() as [string, string][];

    } catch (err) {
        const message = `Error loading \`${getConfigFileName()}\` file. Message: ${err.toString()}`;
        const items = { title: 'Open File' };

        vscode.window.showErrorMessage(message, items).then(option => {
            if (option && option.title === 'Open File') {
                vscode.commands.executeCommand('hiveOpener.openConfigFile');
            }
        });
    }
}

function openItem(target: string) {
    switch (true) {
    case util.isUrl(target):
        util.openUrl(target);
        break;

    case util.isFile(target):
        util.openFile(target);
        break;

    case util.isDirectory(target):
        util.openDirectory(target);
        break;

    default:
        return false;
    }
}