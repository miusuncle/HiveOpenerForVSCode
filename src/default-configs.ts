import { OpenerItemMapping } from './types';

export const defaults: OpenerItemMapping = { files: [], dirs: [], urls: [] };

export const win: OpenerItemMapping = {
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

export const mac: OpenerItemMapping = {
    files: [
        [
            '/etc/hosts',
            'hosts_file'
        ],
        [
            '/Applications/Calculator.app',
            'calc'
        ]
    ],
    dirs: [
        [
            '~',
            'home'
        ],
        [
            '~/Desktop',
            'desktop'
        ]
    ],
    urls: [
        [
            'https://github.com/miusuncle/HiveOpenerForVSCode',
            'HiveOpener'
        ]
    ]
};
