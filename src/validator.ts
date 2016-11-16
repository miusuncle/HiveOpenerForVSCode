import * as fs from 'fs';
import * as validUrl from 'valid-url';

export function isFile(target: string) {
    try {
        return fs.lstatSync(target).isFile();
    } catch (e) {
        return false;
    }
}

export function isDirectory(target: string) {
    try {
        return fs.lstatSync(target).isDirectory();
    } catch (e) {
        return false;
    }
}

export function isUrl(target: string) {
    return !!validUrl.isWebUri(target);
}