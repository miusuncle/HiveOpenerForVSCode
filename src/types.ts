export type OpenerItemCategory = 'files' | 'dirs' | 'urls';
export type OpenerItemCategoryList = OpenerItemCategory[];

export type OpenerItem = [string, string];
export type OpenerItemList = OpenerItem[];

export interface OpenerItemMapping {
    files?: OpenerItemList;
    dirs?: OpenerItemList;
    urls?: OpenerItemList;
}

export interface OpenerEntity {
    belongTo: OpenerItemCategory;
    value: OpenerItem;
}

export interface OpenerEntityInPosition extends OpenerEntity {
    index: number;
}
