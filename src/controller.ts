import * as vscode from 'vscode';
import * as util from './util';
import * as opener from './opener';
import configManager from './config-manager';
import getSupportActions from './support-actions';
import { OpenerItemTypeList, OpenerItemList, OpenerItemMapping } from './types';

/** 显示打开项列表 */
export async function showOpenerList(filters?: OpenerItemTypeList) {
    const openerItemMapping = configManager.loadOpenerItemMappingFromFile(filters);

    if (typeof openerItemMapping === 'string') {
        showLoadingFileErrorMessage(openerItemMapping);
        return;
    }

    const openerItemList = util.convertOpenerItemMappingToOpenerItemList(openerItemMapping);

    const picked = await showQuickPickForOpenerItemList(openerItemList, {
        placeHolder: 'Please pick an item to open',
    });

    // escaped away
    if (!picked) {
        return;
    }

    const target = picked.detail;

    if (opener.open(target) === false) {
        // remove item from open list
        util.removeOpenerItemFromOpenerItemMapping(target, openerItemMapping);
        configManager.saveOpenerItemMappingToFile(openerItemMapping);

        // show drop message
        vscode.window.showWarningMessage(`Unrecognized item: \`${target}\`, drop it anyway from config file!`);
    }
}

/** 管理打开项列表 */
export async function manageOpenerList() {
    const actions = getSupportActions();
    const result = configManager.hasOpenerItem();

    if (typeof result === 'string') {
        showLoadingFileErrorMessage(result);
        return;
    }

    if (result) {
        for (const action of actions) {
            if (['edit', 'remove'].indexOf(action.type) >= 0) {
                action.active = true;
            }
        }
    }

    const quickPickItems = actions.filter(({ active }) => active).map(({ label }) => label);
    const picked = await vscode.window.showQuickPick(quickPickItems);

    // escaped away
    if (!picked) {
        return;
    }

    const action = actions.find(({ label }) => label === picked);

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
}

/** 打开配置文件 */
export function openConfigFile() {
    configManager.ensureConfigFileCreated();
    opener.openFile(configManager.configFilePath);
}

/** 添加打开配置项 */
export function addItemToOpenerList() {
    vscode.window.showInformationMessage('TODO: addItemToOpenList');
}

/** 编辑打开配置项 */
export function editItemFromOpenerList() {
    vscode.window.showInformationMessage('TODO: editItemFromOpenList');
}

/** 移除打开配置项 */
export async function removeItemFromOpenerList() {
    const openerItemMapping = configManager.loadOpenerItemMappingFromFile();

    if (typeof openerItemMapping === 'string') {
        showLoadingFileErrorMessage(openerItemMapping);
        return;
    }

    const openerItemList = util.convertOpenerItemMappingToOpenerItemList(openerItemMapping);

    // no opener item exists
    if (!openerItemList.length) {
        vscode.window.showInformationMessage('There are no entries in open list')
        return;
    }

    const item = await showQuickPickForOpenerItemList(openerItemList, {
        placeHolder: 'Please pick an item to remove',
    });

    if (item) {
        util.removeOpenerItemFromOpenerItemMapping(item.detail, openerItemMapping);
        configManager.saveOpenerItemMappingToFile(openerItemMapping);

        // do repeat remove
        removeItemFromOpenerList();
    }
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

async function showLoadingFileErrorMessage(err) {
    const message = `Error loading \`${configManager.configFileName}\` file. Message: ${err.toString()}`;
    const items = { title: 'Open File' };

    const option = await vscode.window.showErrorMessage(message, items);

    if (option && option.title === 'Open File') {
        vscode.commands.executeCommand('hiveOpener.openConfigFile');
    }
}
