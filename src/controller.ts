import * as _ from 'lodash';
import * as vscode from 'vscode';
import * as util from './util';
import * as opener from './opener';
import configManager from './config-manager';
import getSupportActions from './support-actions';
import { OpenerItemTypeList, OpenerItemList, OpenerItemMapping } from './types';

/** 显示打开项列表 */
export function showOpenerList(filters?: OpenerItemTypeList) {
    const openerItemMapping = configManager.loadOpenerItemMappingFromFile(filters);

    if (typeof openerItemMapping === 'string') {
        showLoadingFileErrorMessage(openerItemMapping);
        return;
    }

    // current operating item
    let target: string;

    const openerItemList = util.convertOpenerItemMappingToOpenerItemList(openerItemMapping);

    showQuickPickForOpenerItemList(openerItemList, {
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
export function manageOpenerList() {
    const actions = getSupportActions();
    const result = configManager.hasOpenerItem();

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
            addItemToOpenerList();
            break;

        case 'edit':
            editItemFromOpenerList();
            break;

        case 'remove':
            removeItemFromOpenerList();
            break;
        }
    });
}

/** 打开配置文件 */
export function openConfigFile() {
    configManager.ensureConfigFileCreated();
    opener.openFile(configManager.configFilePath);
}

export function addItemToOpenerList() {
    vscode.window.showInformationMessage('TODO: addItemToOpenList');
}

export function editItemFromOpenerList() {
    vscode.window.showInformationMessage('TODO: editItemFromOpenList');
}

export function removeItemFromOpenerList() {
    vscode.window.showInformationMessage('TODO: removeItemFromOpenList');
}

function showQuickPickForOpenerItemList(openerItemList: OpenerItemList, options?: vscode.QuickPickOptions) {
    const quickPickItems = util.convertOpenerItemListToQuickPickItems(openerItemList) as vscode.QuickPickItem[];

    const quickPickOptions = Object.assign({
        ignoreFocusOut: false,
        matchOnDescription: true,
        matchOnDetail1: false,
    }, options) as vscode.QuickPickOptions;

    return vscode.window.showQuickPick(quickPickItems, quickPickOptions);
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
