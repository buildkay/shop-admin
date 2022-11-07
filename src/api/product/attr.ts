import request from "@/utils/request";
import type {
  GetAttrListApiParams,
  AttrList,
  AttrItem,
} from "./models/attrModel";

enum Api {
  getAttrListUrl = "/admin/product/attrInfoList",
  saveOrUpdateAttrUrl = "/admin/product/saveAttrInfo",
  delAttrUrl = "/admin/product/deleteAttr",
}

// 获取属性列表函数
export const getAttrListApi = ({
  category1Id,
  category2Id,
  category3Id,
}: GetAttrListApiParams) => {
  return request.get<string, AttrList>(
    Api.getAttrListUrl + `/${category1Id}/${category2Id}/${category3Id}`
  );
};

// 添加或更新属性
export const saveOrUpdateAttrApi = (data: AttrItem) => {
  return request.post<string, null>(Api.saveOrUpdateAttrUrl, data);
};

//删除属性
export const delAttrApi = (id: number) => {
  return request.delete<string, null>(Api.delAttrUrl + `/${id}`);
};
