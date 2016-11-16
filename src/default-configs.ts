import { OpenerItemMapping } from './types';

export const defaults: OpenerItemMapping = { files: [], dirs: [], urls: [] };

export const windows: OpenerItemMapping = {
    files: [
        [
            'C:\\Windows\\System32\\drivers\\etc\\hosts',
            'hosts_file'
        ]
    ],
    dirs: [
        [
            'C:\\Windows\\System32\\drivers\\etc',
            'hosts_dir'
        ]
    ],
    urls: [
        [
            'https://github.com/miusuncle/HiveOpenerForVSCode',
            'HiveOpener'
        ]
    ]
};