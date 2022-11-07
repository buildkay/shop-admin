import request from "@/utils/request";
import type { CategoryList } from "./models/categoryModel";

enum Api {
  getCategory1ListUrl = "/admin/product/getCategory1",
  getCategory2ListUrl = "/admin/product/getCategory2",
  getCategory3ListUrl = "/admin/product/getCategory3",
}

//获取一级列表数据
export const getCategory1ListApi = () => {
  return request.get<string, CategoryList>(Api.getCategory1ListUrl);
};

//获取二级列表数据
export const getCategory2ListApi = (category1Id: number) => {
  return request.get<string, CategoryList>(
    Api.getCategory2ListUrl + `/${category1Id}` //需要一级列表ID
  );
};

//获取三级列表数据
export const getCategory3ListApi = (category2Id: number) => {
  return request.get<string, CategoryList>(
    Api.getCategory3ListUrl + `/${category2Id}` //需要二级列表ID
  );
};
