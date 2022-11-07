import { defineStore } from "pinia";
import {
  getCategory1ListApi,
  getCategory2ListApi,
  getCategory3ListApi,
} from "@/api/product/category";
import type { Category } from "./interface";

export const useCategoryStore = defineStore("category", {
  state(): Category {
    return {
      //让select组件一开始不选中任何内容
      category1Id: undefined,
      category2Id: undefined,
      category3Id: undefined,
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  actions: {
    // 一级分类列表
    async getCategory1List() {
      this.category1List = await getCategory1ListApi();
    },
    // 二级分类列表
    async getCategory2List(category1Id: number) {
      this.category2List = await getCategory2ListApi(category1Id);
      this.category2Id = undefined;
      this.category3Id = undefined;
      this.category3List = [];
    },
    // 三级分类列表
    async getCategory3List(category2Id: number) {
      this.category3List = await getCategory3ListApi(category2Id);
      this.category3Id = undefined;
    },
  },
});
