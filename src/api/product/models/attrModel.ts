export interface GetAttrListApiParams {
  category1Id: number;
  category2Id: number;
  category3Id: number;
}
// 属性值规范,不包含isEdit
export interface AttrValueItem {
  id?: number;
  valueName: string;
  // attrId: number;
}
// 属性值列表规范,不包含isEdit
export type AttrValueList = AttrValueItem[];

// 属性值规范,包含isEdit
export interface SaveAttrValueItem extends AttrValueItem {
  isEdit: boolean;
}

// 属性值列表规范,包含isEdit
export type SaveAttrValueList = SaveAttrValueItem[];

// 组件使用
export interface SaveAttrItem {
  id?: number;
  attrName: string;
  attrValueList: SaveAttrValueList;
}

export interface AttrItem extends Omit<SaveAttrItem, "attrValueList"> {
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueList;
}

//属性列表规范
export type AttrList = AttrItem[];
