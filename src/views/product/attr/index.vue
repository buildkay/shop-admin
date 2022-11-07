<template>
  <div>
    <CategorySelector :disabled="!isShowAttrList"></CategorySelector>
    <AttrList
      v-if="isShowAttrList"
      @setIsShowAttrList="isShowAttrList = $event"
    ></AttrList>
    <SaveOrUpdateAttr
      v-else
      @setIsShowAttrList="isShowAttrList = $event"
    ></SaveOrUpdateAttr>
  </div>
</template>

<script lang="ts">
export default {
  name: "NAttr",
};
</script>

<script lang="ts" setup>
import { ref } from "vue";
import CategorySelector from "../../../components/CategorySelector/index.vue";
import AttrList from "./components/AttrList.vue";
import SaveOrUpdateAttr from "./components/SaveOrUpdateAttr.vue";

//是否显示AttrList
const isShowAttrList = ref(true);
</script>

<style scoped></style>
