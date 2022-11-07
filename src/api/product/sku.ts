import request from "@/utils/request";

enum Api {
  saveSkuUrl = "/admin/product/saveSkuInfo",
}

export const saveSkuApi = (data: any) => {
  return request.post<string, null>(Api.saveSkuUrl, data);
};
