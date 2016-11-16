import * as vscode from 'vscode';
import * as util from './util';
import * as opener from './opener';
import configManager from './config-manager';
import getSupportActions from './support-actions';
import { OpenerItemCategoryList, OpenerItemList, OpenerItemMapping, OpenerEntity, OpenerEntityInPosition } from './types';

/** 显示打开项列表 */
export async function showOpenerList(filters?: OpenerItemCategoryList) {
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
export async function addItemToOpenerList(value = '', openerEntityToBeReplaced?: OpenerEntityInPosition) {
    const openerItemMapping = configManager.loadOpenerItemMappingFromFile();

    if (typeof openerItemMapping === 'string') {
        showLoadingFileErrorMessage(openerItemMapping);
        return;
    }

    const placeHolder = 'Please enter a file, directory or url path, and separated it by `|` with an optional description';
    const input = await showInputBox({ value, placeHolder });

    // escaped away
    if (input === undefined) {
        return;
    }

    const openerEntity = util.parseOpenerEntityFromUserInput(input);

    // input is invalid
    if (!openerEntity) {
        vscode.window.setStatusBarMessage(placeHolder, 1500);
        addItemToOpenerList(input, openerEntityToBeReplaced);
        return;
    }

    const openerEntityInPosition = util.findOpenerEntityFromOpenerItemMapping(openerEntity, openerItemMapping);

    // attempt to add repeating item
    if (openerEntityInPosition && (!openerEntityToBeReplaced || openerEntityInPosition.value[1] !== openerEntityToBeReplaced.value[1])) {
        vscode.window.setStatusBarMessage('Same item exists in open list, you can not add it again', 1500);
        addItemToOpenerList(input, openerEntityToBeReplaced);
        return;
    }

    if (openerEntityToBeReplaced) {
        if (openerEntityToBeReplaced.belongTo === openerEntity.belongTo) {
            const index = openerEntityToBeReplaced.index;
            util.replaceOpenerEntityInOpenerItemMapping(index, openerEntity, openerItemMapping);
        } else {
            util.removeOpenerEntityFromOpenerItemMapping(openerEntityToBeReplaced, openerItemMapping);
            util.addOpenerEntityToOpenerItemMapping(openerEntity, openerItemMapping);
        }

    } else {
        util.addOpenerEntityToOpenerItemMapping(openerEntity, openerItemMapping);
    }

    configManager.saveOpenerItemMappingToFile(openerItemMapping);

    if (openerEntityToBeReplaced) {
        // do repeat edit
        editItemFromOpenerList();
    }
}

/** 编辑打开配置项 */
export async function editItemFromOpenerList() {
    const openerItemMapping = configManager.loadOpenerItemMappingFromFile();

    if (typeof openerItemMapping === 'string') {
        showLoadingFileErrorMessage(openerItemMapping);
        return;
    }

    const openerItemList = util.convertOpenerItemMappingToOpenerItemList(openerItemMapping);

    // no opener item exists
    if (!openerItemList.length) {
        vscode.window.showInformationMessage('There are no entries in open list');
        return;
    }

    const picked = await showQuickPickForOpenerItemList(openerItemList, {
        placeHolder: 'Please pick an item to edit',
    });

    // escaped away
    if (!picked) {
        return;
    }

    const openerEntityToBeReplaced = util.findOpenerEntityFromOpenerItemMapping({
        belongTo: util.getItemCategory(picked.detail),
        value: [picked.detail, picked.label],
    }, openerItemMapping);

    const value = openerEntityToBeReplaced.value;
    const inputValue = value[1] ? value.join(' | ') : value[0];
    addItemToOpenerList(inputValue, openerEntityToBeReplaced);
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
        vscode.window.showInformationMessage('There are no entries in open list');
        return;
    }

    const picked = await showQuickPickForOpenerItemList(openerItemList, {
        placeHolder: 'Please pick an item to remove',
    });

    if (picked) {
        const openerEntityToBeRemoved: OpenerEntity = {
            belongTo: util.getItemCategory(picked.detail),
            value: [picked.detail, ''],
        };

        const openerEntityInPosition = util.findOpenerEntityFromOpenerItemMapping(openerEntityToBeRemoved, openerItemMapping);
        util.removeOpenerEntityFromOpenerItemMapping(openerEntityInPosition, openerItemMapping);

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

function showInputBox(options?: vscode.InputBoxOptions) {
    const inputBoxOptions = Object.assign({
        ignoreFocusOut: true,
    }, options) as vscode.InputBoxOptions;

    return vscode.window.showInputBox(inputBoxOptions);
}

async function showLoadingFileErrorMessage(err) {
    const message = `Error loading \`${configManager.configFileName}\` file. Message: ${err.toString()}`;
    const items = { title: 'Open File' };

    const option = await vscode.window.showErrorMessage(message, items);

    if (option && option.title === 'Open File') {
        vscode.commands.executeCommand('hiveOpener.openConfigFile');
    }
}
