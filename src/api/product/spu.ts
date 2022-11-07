import request from "@/utils/request";
import type {
  GetSpuListApiParams,
  GetSpuListApiResponse,
  BaseSaleAttrList,
  SaveOrUpdateSpuApiParams,
  SpuImageList,
  SaveSpuSaleAttrList,
} from "./models/spuModel";

enum Api {
  getSpuListUrl = "/admin/product",
  getBaseSaleAttrListUrl = "/admin/product/baseSaleAttrList",
  saveSpuUrl = "/admin/product/saveSpuInfo",
  getSpuImageListUrl = "/admin/product/spuImageList",
  getSpuSaleAttrListUrl = "/admin/product/spuSaleAttrList",
  updateSpuUrl = "/admin/product/updateSpuInfo",
}
// 定义获取SPU列表请求函数
export const getSpuListApi = ({
  page,
  limit,
  category3Id,
}: GetSpuListApiParams) => {
  return request.get<string, GetSpuListApiResponse>(
    Api.getSpuListUrl + `/${page}/${limit}`,
    {
      params: {
        category3Id,
      },
    }
  );
};

// 定义获取基础销售属性列表函数
export const getBaseSaleAttrListApi = () => {
  return request.get<string, BaseSaleAttrList>(Api.getBaseSaleAttrListUrl);
};

// 定义添加spu请求函数
export const saveSpuApi = (data: SaveOrUpdateSpuApiParams) => {
  return request.post<string, null>(Api.saveSpuUrl, data);
};

// 获取图片
export const getSpuImageListApi = (id: number) => {
  return request.get<string, SpuImageList>(Api.getSpuImageListUrl + `/${id}`);
};

// 获取销售属性列表
export const getSpuSaleAttrListApi = (id: number) => {
  return request.get<string, SaveSpuSaleAttrList>(
    Api.getSpuSaleAttrListUrl + `/${id}`
  );
};

// 更新Spu
export const updateSpuApi = (data: SaveOrUpdateSpuApiParams) => {
  return request.post<string, null>(Api.updateSpuUrl, data);
};
