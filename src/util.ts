'use strict';

import * as paths from 'path';
import * as validator from './validator';

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

export function mapItemPairsToQuickPickItems(itemPairs: [string, string][]) {
    return itemPairs.map(([detail, label]) => {
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
