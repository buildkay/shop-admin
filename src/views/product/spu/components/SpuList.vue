<template>
  <el-card class="spu">
    <el-button
      type="primary"
      plain
      :icon="Plus"
      :disabled="!categoryStore.category3Id"
      @click="showSaveSpu"
      >添加Spu</el-button
    >
    <el-table v-loading="loading" :data="spuList" border class="spu-table">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="spuName" label="Spu名称" />
      <el-table-column prop="description" label="Spu描述" />
      <el-table-column label="操作" width="300">
        <template v-slot="{ row }">
          <el-tooltip content="添加SKU" placement="bottom">
            <el-button type="primary" :icon="Plus" @click="showSaveSku(row)" />
          </el-tooltip>
          <el-tooltip content="修改SPU" placement="bottom">
            <el-button
              type="warning"
              :icon="Edit"
              @click="showUpdateSpu(row)"
            />
          </el-tooltip>
          <el-tooltip content="查看SKU列表" placement="bottom">
            <el-button type="info" :icon="InfoFilled" />
          </el-tooltip>
          <el-tooltip content="删除SPU" placement="bottom">
            <el-button type="danger" :icon="Delete" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 4, 5]"
      :small="false"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="getSpuList"
      @current-change="getSpuList"
    />
  </el-card>
</template>

<script lang="ts">
export default {
  name: "SpuList",
};
</script>

<script lang="ts" setup>
import { Plus, Edit, InfoFilled, Delete } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { useCategoryStore } from "@/stores/category";
import { getSpuListApi } from "@/api/product/spu";
import type { SpuList, SpuFormData } from "@/api/product/models/spuModel";
import { ElMessage } from "element-plus";

const loading = ref(false);
const spuList = ref<SpuList>([]);

const categoryStore = useCategoryStore();

const currentPage = ref(1);
const pageSize = ref(3);
const total = ref(0);

/******************** SpuList数据展示 **********************/
// 获取列表数据
const getSpuList = async () => {
  loading.value = true;
  const res = await getSpuListApi({
    page: currentPage.value,
    limit: pageSize.value,
    category3Id: categoryStore.category3Id as number,
  });
  spuList.value = res.records;
  total.value = res.total;
  loading.value = false;
  ElMessage.success("获取SPU列表成功");
};

// 监听3Id变化以发送请求
watch(
  () => categoryStore.category3Id,
  (category3Id) => {
    if (!category3Id) {
      spuList.value = [];
      currentPage.value = 1;
      pageSize.value = 3;
      total.value = 0;
      return;
    }
    getSpuList();
  },
  {
    immediate: true,
  }
);

//接受事件
const emit = defineEmits(["setIsShow", "setSpu"]);

// 组件切换
const showSaveSpu = () => {
  emit("setIsShow", 2);
  emit("setSpu", {
    spuName: "",
    tmId: undefined,
    description: "",
    spuImageList: [],
    spuSaleAttrList: [],
  });
};

// 显示修改组件
const showUpdateSpu = (row: SpuFormData) => {
  emit("setIsShow", 2);
  emit("setSpu", {
    ...row,
    spuImageList: [],
    spuSaleAttrList: [],
  });
};
// 显示添加SKU
const showSaveSku = (row: SpuFormData) => {
  emit("setIsShow", 3);
  emit("setSpu", row);
};
</script>

<style scoped>
.spu {
  margin-top: 20px;
}
.spu-table {
  margin: 15px 0;
}
</style>
