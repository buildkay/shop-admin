import type { UploadUserFile } from "element-plus";
// 定义请求参数类型
export interface GetSpuListApiParams {
  page: number;
  limit: number;
  category3Id: number;
}

// 定义响应参数类型
export interface SpuItem {
  id: number;
  spuName: string;
  description: string;
  category3Id: number;
  tmId: number;
}

export type SpuList = SpuItem[];

export interface GetSpuListApiResponse {
  records: SpuList;
  total: number;
}

// 基础销售属性参数类型
export interface BaseSaleAttrItem {
  id: number;
  name: string;
}

export type BaseSaleAttrList = BaseSaleAttrItem[];

/********************************************************** */
// 图片相关
export interface SpuImageItem {
  id?: number;
  imgName: string;
  imgUrl: string;
}

export type SpuImageList = SpuImageItem[];

export interface SpuSaleAttrValueItem {
  baseSaleAttrId: number;
  id?: number;
  saleAttrValueName: string;
}

export type SpuSaleAttrValueList = SpuSaleAttrValueItem[];

export interface SpuSaleAttrItem {
  baseSaleAttrId: number;
  id?: number;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValueList;
}

export type SpuSaleAttrList = SpuSaleAttrItem[];

export interface SaveOrUpdateSpuApiParams {
  category3Id: number;
  id?: number;
  spuName: string;
  tmId: number;
  description: string;
  spuImageList: SpuImageList;
  spuSaleAttrList: SpuSaleAttrList;
}

// 定义spu组件需要类型

export interface SaveSpuSaleAttrItem extends SpuSaleAttrItem {
  isEdit: boolean;
}

export type SaveSpuSaleAttrList = SaveSpuSaleAttrItem[];

export interface SpuFormData
  extends Pick<SaveOrUpdateSpuApiParams, "id" | "spuName" | "description"> {
  tmId: undefined | number;
  spuImageList: UploadUserFile[];
  spuSaleAttrList: SaveSpuSaleAttrList;
}
