import request from "@/utils/request";
import type {
  GetTrademarkListApiResponse,
  TrademarkItem,
  TrademarkList,
} from "./models/trademarkModel";

// 枚举类型用来统一定义接口请求地址
enum Api {
  getTrademarkListUrl = "/admin/product/baseTrademark",
  getAllTrademarkListUrl = "/admin/product/baseTrademark/getTrademarkList",
  saveTrademarkUrl = "/admin/product/baseTrademark/save",
  updateTrademarkUrl = "/admin/product/baseTrademark/update",
  removeTrademarkUrl = "/admin/product/baseTrademark/remove",
}
// 获取品牌数据
export const getTrademarkListApi = (page: number, limit: number) => {
  return request.get<string, GetTrademarkListApiResponse>(
    Api.getTrademarkListUrl + `/${page}/${limit}`
  );
};

// 添加品牌
export const saveTrademarkApi = (tmName: string, logoUrl: string) => {
  return request.post<string, null>(Api.saveTrademarkUrl, {
    tmName,
    logoUrl,
  });
};

// 修改品牌
export const updateTrademarkApi = (trademark: TrademarkItem) => {
  return request.put<string, null>(Api.updateTrademarkUrl, trademark);
};

// 删除品牌
export const removeTrademarkApi = (id: number) => {
  return request.delete<string, null>(Api.removeTrademarkUrl + `/${id}`);
};

// 获取所有品牌的数据
export const getAllTrademarkListApi = () => {
  return request.get<string, TrademarkList>(Api.getAllTrademarkListUrl);
};
