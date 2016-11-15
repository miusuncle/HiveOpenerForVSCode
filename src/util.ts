import * as paths from 'path';
import * as _ from 'lodash';
import * as validator from './validator';
import { OpenerItemList, OpenerItemMapping } from './types';

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
    return _(openerItemMapping).values().flatten().value() as OpenerItemList;
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
