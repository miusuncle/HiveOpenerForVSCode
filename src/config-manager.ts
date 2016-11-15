import * as paths from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import * as validator from './validator';
import { OpenerItemTypeList, OpenerItemMapping } from './types';

class ConfigManager {
	/**
	 * 加载打开配置项
	 */
	loadOpenerItemMappingFromFile(filters: OpenerItemTypeList = ['files', 'dirs', 'urls']): OpenerItemMapping | string {
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
	saveOpenerItemMappingToFile(openerItemMapping: OpenerItemMapping) {
		fs.writeFileSync(this.configFilePath, JSON.stringify(openerItemMapping, null, '\t'));
	}

	/**
	 * 配置文件中是否添加有打开配置项
	 */
	hasOpenerItem(): boolean | string {
		this.ensureConfigFileCreated();

		try {
			const config = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8'));

			return (!!(false
				|| _.get(config, 'files', []).length
				|| _.get(config, 'dirs', []).length
				|| _.get(config, 'urls', []).length
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
		// Initialize with empty files, dirs and urls
		this.saveOpenerItemMappingToFile({ files: [], dirs: [], urls: [] });
	}

	/**
	 * 获取配置文件路径
	 */
	get configFilePath() {
		const configFileLocation = vscode.workspace.getConfiguration('hiveOpener').get('configFileLocation');

		if (configFileLocation !== '') {
			return paths.join(configFileLocation, this.configFileName);

		} else {
			const appData = process.env.APPDATA;
			return paths.join(appData, this._channelPath, 'User', this.configFileName);
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
