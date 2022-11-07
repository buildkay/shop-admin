import type { RouteRecordRaw } from "vue-router";
import type { CategoryList } from "@/api/product/models/categoryModel";
import type { SaveAttrItem } from "@/api/product/models/attrModel";
// 用户信息包括权限数据
export interface UserInfoState {
  token: string;
  avatar: string;
  name: string;

  menuRoutes: RouteRecordRaw[]; // 用于生成导航菜单的路由列表
}

// 三级分类数据类型
export interface Category {
  category1Id?: number;
  category2Id?: number;
  category3Id?: number;
  category1List: CategoryList;
  category2List: CategoryList;
  category3List: CategoryList;
}

export interface attr {
  attr: SaveAttrItem;
}
