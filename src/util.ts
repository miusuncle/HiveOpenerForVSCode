import * as paths from 'path';
import * as validator from './validator';
import { OpenerItem, OpenerItemList, OpenerItemMapping, OpenerItemCategory, OpenerEntity, OpenerEntityInPosition } from './types';

import * as os from 'os';
const HOME_DIR = os.homedir();

export function getItemType(target: string) {
    target = replaceTidleWithHomeDir(target);

    if (validator.isUrl(target)) {
        return 'URL';
    }

    if (validator.isApp(target)) {
        return 'APP';
    }

    if (validator.isDirectory(target)) {
        return 'DIR';
    }

    if (validator.isFile(target)) {
        return paths.extname(target).slice(1).toUpperCase() || 'FILE';
    }

    return 'UNKNOWN';
}

export function getItemCategory(target: string): OpenerItemCategory {
    target = replaceTidleWithHomeDir(target);

    if (validator.isApp(target)) {
        return 'files';
    }

    if (validator.isUrl(target)) {
        return 'urls';
    }

    if (validator.isDirectory(target)) {
        return 'dirs';
    }

    if (validator.isFile(target)) {
        return 'files';
    }
}

export function convertOpenerItemMappingToOpenerItemList(openerItemMapping: OpenerItemMapping): OpenerItemList {
    return [
        ...openerItemMapping.files || [],
        ...openerItemMapping.dirs || [],
        ...openerItemMapping.urls || [],
    ];
}

export function convertOpenerItemListToQuickPickItems(openerItemList: OpenerItemList) {
    return openerItemList.map(([detail, label]) => {
        let description = `[${getItemType(detail)}]`;

        if (!label) {
            if (validator.isFile(detail)) {
                label = paths.basename(detail);
            } else {
                label = detail;
            }
        }

        return { label, description, detail };
    });
}

export function findOpenerEntityFromOpenerItemMapping(openerEntity: OpenerEntity, openerItemMapping: OpenerItemMapping): OpenerEntityInPosition {
    const openerItemList = openerItemMapping[openerEntity.belongTo] as OpenerItemList;

    if (openerItemList) {
        const openerItemPath = openerEntity.value[0];
        const index = openerItemList.findIndex(([path]) => path === openerItemPath);

        if (index >= 0) {
            const belongTo = openerEntity.belongTo;
            const value = openerItemList[index];
            return { belongTo, value, index };
        }
    }
}

export function addOpenerEntityToOpenerItemMapping(openerEntity: OpenerEntity, openerItemMapping: OpenerItemMapping, append = true) {
    let openerItemList = openerItemMapping[openerEntity.belongTo] as OpenerItemList;
    if (!openerItemList) {
        openerItemMapping[openerEntity.belongTo] = openerItemList = [];
    }

    if (append) {
        openerItemList.push(openerEntity.value);
    } else {
        openerItemList.unshift(openerEntity.value);
    }
}

export function replaceOpenerEntityInOpenerItemMapping(index: number, openerEntity: OpenerEntity, openerItemMapping: OpenerItemMapping) {
    const openerItemList = openerItemMapping[openerEntity.belongTo] as OpenerItemList;
    openerItemList.splice(index, 1, openerEntity.value);
}

export function removeOpenerEntityFromOpenerItemMapping(openerEntityInPosition: OpenerEntityInPosition, openerItemMapping: OpenerItemMapping) {
    const openerItemList = openerItemMapping[openerEntityInPosition.belongTo] as OpenerItemList;
    openerItemList.splice(openerEntityInPosition.index, 1);
}

export function removeOpenerItemFromOpenerItemMapping(openerItemPath: string, openerItemMapping: OpenerItemMapping) {
    const openerItemListCollection = [openerItemMapping.files, openerItemMapping.dirs, openerItemMapping.urls];

    for (const openerItemList of openerItemListCollection) {
        if (!openerItemList) {
            continue;
        }

        const index = openerItemList.findIndex(([path]) => path === openerItemPath);

        if (index >= 0) {
            openerItemList.splice(index, 1);
            return;
        }
    }
}

export function parseOpenerEntityFromUserInput(target: string, replaceTidle = false): OpenerEntity {
    const [rawPath, ...remain] = target.split('|');

    let realPath = stripQuotesAndWhiteSpaces(rawPath);
    if (replaceTidle) {
        realPath = replaceTidleWithHomeDir(realPath);
    }

    const description = stripQuotesAndWhiteSpaces(remain.join('|'));

    const itemCategory = getItemCategory(realPath);
    if (itemCategory) {
        return { belongTo: itemCategory, value: [realPath, description] };
    }
}

export function stripQuotesAndWhiteSpaces(target: string) {
    return target.replace(/^["'\s]+/g, '').replace(/["'\s]+$/g, '');
}

export function replaceTidleWithHomeDir(target: string) {
    return target.replace(/^~/, HOME_DIR);
}
