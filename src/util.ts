import * as paths from 'path';
import * as validator from './validator';
import { OpenerItemList, OpenerItemMapping, OpenerItemType } from './types';

export function getItemType(target: string) {
    if (validator.isUrl(target)) {
        return 'URL';
    }

    if (validator.isDirectory(target)) {
        return 'DIR';
    }

    if (validator.isFile(target)) {
        return paths.extname(target).slice(1).toUpperCase() || 'FILE';
    }

    return 'UNKNOWN';
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

export function removeOpenerItemFromOpenerItemMapping(openerItemPath: string, openerItemMapping: OpenerItemMapping) {
    const openerItemListCollection = [openerItemMapping.files, openerItemMapping.dirs, openerItemMapping.urls];

    for (const openerItemList of openerItemListCollection) {
        const index = openerItemList.findIndex(([path]) => path === openerItemPath);

        if (index >= 0) {
            openerItemList.splice(index, 1);
            return;
        }
    }
}
