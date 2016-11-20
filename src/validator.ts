import * as fs from 'fs';
import * as paths from 'path';
import * as validUrl from 'valid-url';
import * as platform from './platform';

export function isFile(target: string) {
    try {
        return fs.statSync(target).isFile();
    } catch (e) {
        return false;
    }
}

export function isDirectory(target: string) {
    try {
        return fs.statSync(target).isDirectory();
    } catch (e) {
        return false;
    }
}

export function isUrl(target: string) {
    return !!validUrl.isWebUri(target);
}

export function isApp(target: string) {
    if (!platform.mac) {
        return false;
    }

    return paths.extname(target).toLowerCase() === '.app';
}
