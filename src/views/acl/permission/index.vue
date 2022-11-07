<template>
  <el-card>
    <el-table
      :data="permissionList"
      border
      row-key="id"
      :expand-row-keys="['1']"
    >
      <el-table-column label="名称" prop="name" />
      <el-table-column label="权限值" prop="code" />
      <el-table-column label="跳转权限值" prop="toCode" />
      <el-table-column label="操作">
        <el-button type="primary" :icon="Plus" size="small" />
        <el-button type="warning" :icon="Edit" size="small" />
        <el-button type="danger" :icon="Delete" size="small" />
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "XPermission",
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { getPermissionListApi } from "../../../api/acl/permission";
import type { PermissionList } from "../../../api/acl/models/permissionModel";

const permissionList = ref<PermissionList>([]);

onMounted(async () => {
  const res = await getPermissionListApi();
  permissionList.value = res.children;
});
</script>

<style scoped></style>
