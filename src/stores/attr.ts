import { defineStore } from "pinia";
import type { attr } from "./interface";

export const useAttrStore = defineStore("attr", {
  state(): attr {
    return {
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  actions: {},
});
