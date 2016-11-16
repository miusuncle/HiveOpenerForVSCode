# Functionality

Quickly open file, directory and url within VSCode.

By the way, this extension is just VSCode version of [Hive Opener for Sublime Text](https://packagecontrol.io/packages/HiveOpener), so the main feature is equal approximatively.

# Installation

Press `F1` in VSCode, type `ext install` and then look for `Hive Opener`.

# Usage

## Available commands

- `Hive Opener: Add Item to Open List` Show input box to add file, directory or url to open list
- `Hive Opener: Edit Item from Open List` Pick an item from open list to edit
- `Hive Opener: Remove Item From Open List` Pick an item from open list to remove
- `Hive Opener: Open Config file` Open config file which open items saved in
- `Hive Opener: Show Open List` Show open list which you can pick from and open
- `Hive Opener: Manage Open List` Show available actions(add, edit, remove) which you can choose from

## Available settings

- `hiveOpener.configFileName` Indicates an alternative config file name. The default config file name is `hive-opener.json`
- `hiveOpener.configFileLocation` Indicates an alternative location where the `hive-opener.json` file is stored

## Preset keybindings

- Press `alt + ctrl + o (win)` or `cmd + ctrl + o (mac)` to show open list
- Press `alt + ctrl + i (win)` or `cmd + ctrl + i (mac)` to manage open list
- Press `alt + shift + i` to open config file

# Known Issues

At this point, the extension only work under Windows and Mac, supporting for Linux is to be determined.

# License

[MIT](LICENSE)