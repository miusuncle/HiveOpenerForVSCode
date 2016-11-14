'use strict';

import * as paths from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

const CONFIG_FILE = 'hive-opener.json';

/** 显示打开项列表 */
export function showOpenList() {
    vscode.window.showInformationMessage('showOpenList');
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
            vscode.window.showTextDocument(doc);
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
    let configFile;

    const configFileLocation = vscode.workspace.getConfiguration('hiveOpener').get('configFileLocation');
    if (configFileLocation !== '') {
        configFile = paths.join(configFileLocation, CONFIG_FILE);
    } else {
        const appData = process.env.APPDATA;
        const channelPath = getChannelPath();
        configFile = paths.join(appData, channelPath, 'User', CONFIG_FILE);
    }

    return configFile;
}

function getChannelPath() {
    if (!!~vscode.env.appName.indexOf('Insiders')) {
        return 'Code - Insiders';
    }

    return 'Code';
}