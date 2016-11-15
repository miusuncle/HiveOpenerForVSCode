import * as paths from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import * as util from './util';
import * as opener from './opener';
import configManager from './config-manager';
import getSupportActions from './support-actions';
import { ItemTypes } from './types';

/** 显示打开项列表 */
export function showOpenList(filters:ItemTypes[]) {
    configManager.ensureConfigFileCreated();

    const configFilePath = configManager.configFilePath;
    const openItems = configManager.loadConfigItems(filters);

    if (typeof openItems === 'string') {
        showLoadingFileErrorMessage(openItems);
        return;
    }

    const quickPickItems = util.mapItemPairsToQuickPickItems(openItems) as vscode.QuickPickItem[];

    // current operating item
    let target: string;

    vscode.window.showQuickPick(quickPickItems, {
        ignoreFocusOut: false,
        matchOnDescription: true,
        matchOnDetail: false,
        placeHolder: 'Please select an item to open',
    })
    .then(item => {
        if (item) {
            target = item.detail;
            return opener.open(target);
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
    configManager.ensureConfigFileCreated();

    const actions = getSupportActions();
    const result = configManager.hasConfigItems();

    if (typeof result === 'string') {
        showLoadingFileErrorMessage(result);
        return;
    }

    if (result) {
        _.each(actions, item => {
            if (_.includes(['edit', 'remove'], item.type)) {
                item.active = true;
            }
        });
    }

    const quickPickItems = _(actions).filter('active').map('label').value() as string[];

    vscode.window.showQuickPick(quickPickItems).then(label => {
        const action = _.find(actions, { label });

        switch (action.type) {
        case 'add':
            addItemToOpenList();
            break;

        case 'edit':
            editItemFromOpenList();
            break;

        case 'remove':
            removeItemFromOpenList();
            break;
        }
    });
}

/** 打开配置文件 */
export function openConfigFile() {
    configManager.ensureConfigFileCreated();
    opener.openFile(configManager.configFilePath);
}

export function addItemToOpenList() {
    vscode.window.showInformationMessage('TODO: addItemToOpenList');
}

export function editItemFromOpenList() {
    vscode.window.showInformationMessage('TODO: editItemFromOpenList');
}

export function removeItemFromOpenList() {
    vscode.window.showInformationMessage('TODO: removeItemFromOpenList');
}

function showLoadingFileErrorMessage(err) {
    const message = `Error loading \`${configManager.configFileName}\` file. Message: ${err.toString()}`;
    const items = { title: 'Open File' };

    vscode.window.showErrorMessage(message, items).then(option => {
        if (option && option.title === 'Open File') {
            vscode.commands.executeCommand('hiveOpener.openConfigFile');
        }
    });
}
