<template>
  <el-card class="attr-list">
    <el-button
      type="primary"
      :icon="Plus"
      :disabled="!categoryStore.category3Id"
      @click="showSaveAttr"
      >添加属性</el-button
    >
    <el-table :data="attrlist" border class="attr-list">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        label="属性名称"
        prop="attrName"
        width="150"
      ></el-table-column>
      <el-table-column label="属性值列表">
        <template v-slot="{ row }">
          <el-tag
            v-for="attrValue in row.attrValueList"
            :key="attrValue.id"
            class="attr-tag"
            >{{ attrValue.valueName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot="{ row }">
          <el-tooltip content="修改属性" placement="bottom">
            <el-button
              :icon="Edit"
              type="warning"
              size="small"
              @click="showUpdateAttr(row)"
            />
          </el-tooltip>
          <el-tooltip content="删除属性" placement="bottom">
            <div class="btn-wrap">
              <el-popconfirm
                :title="`您确定要删除 ${row.attrName} 属性吗?`"
                @confirm="delAttr(row.id)"
              >
                <template #reference>
                  <el-button :icon="Delete" type="danger" size="small" />
                </template>
              </el-popconfirm>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "AttrList",
};
</script>

<script lang="ts" setup>
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { watch, ref } from "vue";
import { useCategoryStore } from "@/stores/category";
import type { AttrList, SaveAttrItem } from "@/api/product/models/attrModel";
import { getAttrListApi, delAttrApi } from "@/api/product/attr";
import { useAttrStore } from "@/stores/attr";
import { ElMessage } from "element-plus";

const categoryStore = useCategoryStore();

const attrlist = ref<AttrList>([]);

// 接受自定义事件
const emit = defineEmits(["setIsShowAttrList"]);
const showSaveAttr = () => {
  attrStore.attr = {
    attrName: "",
    attrValueList: [],
  };
  emit("setIsShowAttrList", false);
};

const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrlist.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
};
watch(
  () => categoryStore.category3Id,
  async (category3Id) => {
    if (!category3Id) {
      attrlist.value = [];
      return;
    }
    getAttrList();
  },
  {
    immediate: true,
  }
);
const attrStore = useAttrStore();
// 给菠萝数据
const showUpdateAttr = (row: SaveAttrItem) => {
  attrStore.attr = row;
  emit("setIsShowAttrList", false);
};

// 删除属性
const delAttr = async (id: number) => {
  await delAttrApi(id);
  ElMessage.success("删除属性成功");
  getAttrList();
};
</script>

<style scoped>
.attr-list {
  margin-top: 10px;
}
.attr-tag {
  margin-right: 10px;
}
.btn-wrap {
  display: inline-block;
  margin-left: 10px;
}
</style>
