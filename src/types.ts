export type OpenerItemType = 'files' | 'dirs' | 'urls';
export type OpenerItemTypeList = OpenerItemType[];

export type OpenerItem = [string, string];
export type OpenerItemList = OpenerItem[];

export interface OpenerItemMapping {
	files?: OpenerItemList;
	dirs?: OpenerItemList;
	urls?: OpenerItemList;
}
