<template>
  <div>
    <el-card class="attr-card">
      <el-form inline :disabled="disabled">
        <el-form-item label="一级分类">
          <el-select
            placeholder="请选择一级分类"
            v-model="categoryStore.category1Id"
          >
            <el-option
              v-for="c1 in categoryStore.category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select
            placeholder="请选择二级分类"
            v-model="categoryStore.category2Id"
          >
            <el-option
              v-for="c2 in categoryStore.category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
          <el-select
            placeholder="请选择三级分类"
            v-model="categoryStore.category3Id"
          >
            <el-option
              v-for="c3 in categoryStore.category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "CategorySelector",
};
</script>

<script lang="ts" setup>
import { onMounted, watch, onBeforeUnmount } from "vue";
import { useCategoryStore } from "@/stores/category";

const categoryStore = useCategoryStore();

defineProps<{
  disabled: boolean;
}>();

//组件渲染完毕后请求一级分类数据
onMounted(async () => {
  categoryStore.getCategory1List();
});

//监视一级分类Id和二级分类Id变化以发送请求
watch(
  () => categoryStore.category1Id,
  async (newVal) => {
    categoryStore.getCategory2List(newVal as number);
  }
);
watch(
  () => categoryStore.category2Id,
  async (newVal) => {
    //重新选择一级Id时，会导致二级Id设置为undefind,此时触发watch,导致请求失败
    if (!newVal) return;
    categoryStore.getCategory3List(newVal as number);
  }
);
// 卸载时，清空数据
onBeforeUnmount(() => {
  categoryStore.$patch({
    category1Id: undefined,
    category2Id: undefined,
    category3Id: undefined,
    category1List: [],
    category2List: [],
    category3List: [],
  });
});
</script>

<style scoped>
.attr-card :deep(.el-form-item) {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
