import * as paths from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import * as validator from './validator';
import { ItemTypes } from './types';

class ConfigManager {
	/**
	 * 确保配置文件已创建
	 */
	ensureConfigFileCreated() {
		if (!validator.isFile(this.configFilePath)) {
			this.createConfigFile();
		}
	}

	/**
	 * 配置文件中是否添加有配置项
	 */
	hasConfigItems(): boolean | string {
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
	 * 加载配置项
	 */
	loadConfigItems(filters: ItemTypes[] = ['files', 'dirs', 'urls']): [string, string][] | string {
		try {
			const config = JSON.parse(fs.readFileSync(this.configFilePath, 'utf8'));
			return  _(config).pick(filters).values().flatten().value() as [string, string][];

		} catch (err) {
			return err.toString();
		}
	}

	/**
	 * 保存配置项
	 */
	saveConfigItems() {

	}

	/**
	 * 创建配置文件
	 */
	createConfigFile() {
		// Initialize with empty files, dirs and urls
		fs.writeFileSync(this.configFilePath, JSON.stringify({
			files: [],
			dirs: [],
			urls: [],
		}, null, '\t'));
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
