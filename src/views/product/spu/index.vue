<template>
  <div>
    <CategorySelector :disabled="isShow !== 1"></CategorySelector>
    <SpuList
      v-if="isShow === 1"
      @setIsShow="setIsShow"
      @setSpu="setSpu"
    ></SpuList>
    <SaveOrUpdateSpu
      v-else-if="isShow === 2"
      @setIsShow="setIsShow"
      :spu="spu"
    ></SaveOrUpdateSpu>
    <SaveSku v-else :spu="spu" @setIsShow="setIsShow"></SaveSku>
  </div>
</template>

<script lang="ts">
export default {
  name: "NSpu",
};
</script>

<script lang="ts" setup>
import { ref } from "vue";
import CategorySelector from "../../../components/CategorySelector/index.vue";
import SpuList from "./components/SpuList.vue";
import SaveOrUpdateSpu from "./components/SaveOrUpdateSpu.vue";
import type { SpuFormData } from "@/api/product/models/spuModel";
import SaveSku from "./components/SaveSku.vue";

const spu = ref<SpuFormData>({
  spuName: "",
  tmId: undefined,
  description: "",
  spuImageList: [],
  spuSaleAttrList: [],
});

enum IsShow {
  "SpuList" = 1,
  "SaveOrUpdateSpu" = 2,
  "SaveSku" = 3,
}

const isShow = ref<IsShow>(1);

const setIsShow = (val: IsShow) => {
  isShow.value = val;
};
const setSpu = (val: SpuFormData) => {
  spu.value = val;
};
</script>

<style scoped></style>
