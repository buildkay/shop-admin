<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input placeholder="角色名称" v-model="roleName" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search">查询</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="showSaveRole"> 添加 </el-button>
    <el-button type="danger"> 批量删除 </el-button>

    <el-table :data="roleList" border class="role-table" v-loading="loading">
      <el-table-column type="selection" width="60" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            size="small"
            type="primary"
            :icon="User"
            @click="goRoleAuth(row)"
          />
          <el-button size="small" type="warning" :icon="Edit" />
          <el-button size="small" type="danger" :icon="Delete" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      :small="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="getRoleList"
      @current-change="getRoleList"
    />

    <el-dialog v-model="visible" title="添加角色">
      <el-form
        label-width="100px"
        ref="roleFormRef"
        :model="roleFormData"
        :rules="roleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleFormData.roleName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="saveRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "NRole",
};
</script>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { Search, User, Edit, Delete } from "@element-plus/icons-vue";
import { getRoleListApi, saveRoleApi } from "@/api/acl/role";
import type { RoleList, RoleItem } from "@/api/acl/models/userModel";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const goRoleAuth = (row: RoleItem) => {
  router.push({
    name: "RoleAuth",
    query: {
      id: row.id,
      roleName: row.roleName,
    },
  });
};

// 分页查询用户列表
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);

const roleName = ref("");
const roleList = ref<RoleList>([]);
const loading = ref(false);

const roleFormRef = ref<FormInstance>();
const roleFormData = reactive({
  roleName: "",
});

const roleFormRules = reactive<FormRules>({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
});

const getRoleList = async () => {
  loading.value = true;
  const res = await getRoleListApi({
    page: currentPage.value,
    limit: pageSize.value,
    roleName: roleName.value,
  });
  total.value = res.total;
  roleList.value = res.items;
  loading.value = false;
};

onMounted(getRoleList);

// 添加角色
const visible = ref(false);

const showSaveRole = () => {
  visible.value = true;
  roleFormData.roleName = "";
  roleFormRef.value?.clearValidate();
};

const saveRole = async () => {
  await roleFormRef.value?.validate();
  await saveRoleApi(roleFormData.roleName);
  ElMessage.success("添加角色成功");
  visible.value = false;
  getRoleList();
};
</script>

<style scoped>
.role-table {
  margin: 15px 0;
}
</style>
