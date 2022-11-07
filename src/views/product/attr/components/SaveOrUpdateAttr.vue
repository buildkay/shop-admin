<template>
  <el-card class="attr-table">
    <el-form>
      <el-form-item label="属性名">
        <el-input
          placeholder="请输入属性名"
          class="attr-input"
          v-model="attrFormData.attrName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 添加属性的按钮 -->
        <el-button
          type="primary"
          :icon="Plus"
          :disabled="!attrFormData.attrName"
          @click="showSaveAttrValue"
        >
          添加属性值
        </el-button>
        <!-- 表格部分 -->
        <el-table :data="attrFormData.attrValueList" border class="attr-table">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="60"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <el-input
                size="small"
                ref="inputRef"
                v-if="row.isEdit"
                v-model="row.valueName"
                @blur="addAttrValue(row, $index)"
                @keyup.enter="addAttrValue(row, $index)"
              ></el-input>
              <span
                class="attr-text-value"
                v-if="!row.isEdit"
                @click="showEdit(row)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`您确认要删除 ${row.valueName} 吗?`"
                @confirm="delAttr($index)"
              >
                <template #reference>
                  <el-button type="danger" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="saveOrUpdateAttr"
          >确定</el-button
        >
        <el-button @click="goAttrList">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "SaveOrUpdateAttr",
};
</script>

<script lang="ts" setup>
import { reactive, ref, nextTick, computed } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { saveOrUpdateAttrApi } from "@/api/product/attr";
import { useCategoryStore } from "@/stores/category";
import { ElMessage } from "element-plus";
import { useAttrStore } from "@/stores/attr";
import type {
  SaveAttrItem,
  SaveAttrValueItem,
} from "@/api/product/models/attrModel";

const attrStore = useAttrStore();
const attrFormData = reactive<SaveAttrItem>(attrStore.attr);

const inputRef = ref();

const emit = defineEmits(["setIsShowAttrList"]);

const goAttrList = () => {
  emit("setIsShowAttrList", true);
};

const isBtnDisabled = computed(() => {
  return (
    !attrFormData.attrName ||
    !attrFormData.attrValueList.some((attrValue) => attrValue.valueName)
  );
});
// 显示添加属性值
const showSaveAttrValue = async () => {
  // table添加一行属性
  attrFormData.attrValueList.push({
    // 定义一个控制显示的值
    isEdit: true,
    valueName: "",
  });
  await nextTick();
  inputRef.value.focus();
};

// 添加脱离焦点事件    即显示模式
const addAttrValue = (row: SaveAttrValueItem, index: number) => {
  if (!row.valueName) {
    attrFormData.attrValueList.splice(index, 1);
    return;
  }
  row.isEdit = false;
};
// 添加span标签的点击事件    即编辑模式
const showEdit = async (row: SaveAttrValueItem) => {
  row.isEdit = true;
  await nextTick();
  inputRef.value.focus();
};
// 删除属性
const delAttr = (index: number) => {
  attrFormData.attrValueList.splice(index, 1);
};

const categoryStore = useCategoryStore();

// 添加或更新属性函数
const saveOrUpdateAttr = async () => {
  await saveOrUpdateAttrApi({
    ...attrFormData,
    categoryId: categoryStore.category3Id as number,
    categoryLevel: 3,
  });
  ElMessage.success(`${attrFormData.id ? "修改" : "添加"}属性成功`);
  goAttrList();
};
</script>

<style scoped>
.attr-input {
  width: 300px;
}
.attr-table {
  margin-top: 20px;
}
.attr-text-value {
  display: inline-block;
  width: 100%;
}
</style>
