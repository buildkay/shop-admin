<template>
  <el-card>
    <el-input v-model="roleName" disabled />
    <el-tree
      class="role-tree"
      :data="permissionList"
      :props="{
        children: 'children',
        label: 'name',
      }"
      node-key="id"
      show-checkbox
      default-expand-all
      ref="treeRef"
    />
    <el-button type="primary" @click="assignRolePermission">确定</el-button>
    <el-button @click="cancel">取消</el-button>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "RoleAuth",
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getRolePermissionListApi,
  assignRolePermissionApi,
} from "@/api/acl/permission";
import type { PermissionList } from "@/api/acl/models/permissionModel";
import { ElMessage } from "element-plus";

const route = useRoute();
const roleName = route.query.roleName as string;

const treeRef = ref();

const permissionList = ref<PermissionList>([]);
onMounted(async () => {
  const res = await getRolePermissionListApi(route.query.id as string);
  permissionList.value = res.children;
  const ids = getSelectedIds(res.children);
  treeRef.value.setCheckedKeys(ids);
});

const getSelectedIds = (permissionList: PermissionList) => {
  let ids: string[] = [];
  permissionList.forEach((permission) => {
    if (permission.children && permission.children.length) {
      const childrenIds = getSelectedIds(permission.children);
      ids = [...ids, ...childrenIds];
    } else {
      if (permission.select) {
        ids.push(permission.id);
      }
    }
  });
  return ids;
};

const router = useRouter();
const cancel = () => {
  router.push({
    name: "Role",
  });
};
const assignRolePermission = async () => {
  // 获取所有选中的key
  const checkedKeys = treeRef.value.getCheckedKeys();
  // 获取所有半选的key
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys();

  await assignRolePermissionApi(route.query.id as string, [
    ...checkedKeys,
    ...halfCheckedKeys,
  ]);

  ElMessage.success("分配角色权限成功");
  cancel();
};
</script>

<style scoped>
.role-tree {
  margin: 10px 0;
}
</style>
