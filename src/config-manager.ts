import * as paths from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as util from './util';
import * as validator from './validator';
import * as platform from './platform';
import * as defaultConfigs from './default-configs';
import { OpenerItemCategoryList, OpenerItemMapping } from './types';

class ConfigManager {
    /**
     * 加载打开配置项
     */
    loadOpenerItemMappingFromFile(filters: OpenerItemCategoryList = ['files', 'dirs', 'urls']): OpenerItemMapping | string {
        this.ensureConfigFileCreated();

        try {
            return JSON.parse(fs.readFileSync(this.configFilePath, 'utf8'));
        } catch (err) {
            return err.toString();
        }
    }

    /**
     * 保存打开配置项
     */
    saveOpenerItemMappingToFile({ files, dirs, urls }: OpenerItemMapping) {
        fs.writeFileSync(this.configFilePath, JSON.stringify({ files, dirs, urls }, null, 4));
    }

    /**
     * 配置文件中是否添加有打开配置项
     */
    hasOpenerItem(): boolean | string {
        this.ensureConfigFileCreated();

        try {
            const openerItemMapping = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8')) as OpenerItemMapping;

            return (!!(false
                || (openerItemMapping.files || []).length
                || (openerItemMapping.dirs || []).length
                || (openerItemMapping.urls || []).length
            ));

        } catch (err) {
            return err.toString();
        }
    }

    /**
     * 确保配置文件已创建
     */
    ensureConfigFileCreated() {
        if (!validator.isFile(this.configFilePath)) {
            this.initConfigFile();
        }
    }

    /**
     * 初始化配置文件
     */
    initConfigFile() {
        let openerItemMapping: OpenerItemMapping;

        if (platform.win) {
            openerItemMapping = defaultConfigs.win;
        } else if (platform.mac) {
            openerItemMapping = defaultConfigs.mac;
        } else {
            openerItemMapping = defaultConfigs.defaults;
        }

        this.saveOpenerItemMappingToFile(openerItemMapping);
    }

    /**
     * 获取配置文件路径
     */
    get configFilePath() {
        let configFileLocation = <string>vscode.workspace.getConfiguration('hiveOpener').get('configFileLocation');

        if (configFileLocation !== '') {
            configFileLocation = util.replaceTidleWithHomeDir(configFileLocation);
            return paths.join(configFileLocation, this.configFileName);

        } else {
            let appDataPath = '';

            if (platform.win) {
                appDataPath = process.env.APPDATA;
            } else if (platform.mac) {
                appDataPath = process.env.HOME + '/Library/Application Support';
            } else {
                appDataPath = '/var/local';
            }

            return paths.join(appDataPath, this._channelPath, 'User', this.configFileName);
        }
    }

    /**
     * 获取配置文件名
     */
    get configFileName() {
        return vscode.workspace.getConfiguration('hiveOpener').get('configFileName');
    }

    /**
     * 获取 VSCode 对应 Channel 配置路径
     */
    get _channelPath() {
        if (vscode.env.appName.indexOf('Insiders') > 0) {
            return 'Code - Insiders';
        }

        return 'Code';
    }
}

export default new ConfigManager();
