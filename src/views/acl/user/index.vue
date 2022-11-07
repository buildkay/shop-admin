<template>
  <el-card>
    <el-form inline>
      <el-form-item>
        <el-input placeholder="请输入用户名" v-model="username"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search">查询</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="showSaveUser">添加</el-button>
    <el-button type="danger">批量删除</el-button>

    <!-- 表格渲染 -->
    <el-table :data="userList" border class="user-table" v-loading="loading">
      <el-table-column type="selection" width="60" />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
      ></el-table-column>
      <el-table-column
        label="用户名"
        prop="username"
        width="200"
      ></el-table-column>
      <el-table-column
        label="用户昵称"
        prop="nickName"
        width="200"
      ></el-table-column>
      <el-table-column
        label="角色列表"
        prop="roleName"
        width="200"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="gmtCreate"
        width="200"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="gmtModified"
        width="200"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            :icon="User"
            @click="showAssignRole(row)"
          ></el-button>
          <el-button type="warning" :icon="Edit"></el-button>
          <el-button type="danger" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="getUserList"
      @current-change="getUserList"
    ></el-pagination>

    <!-- 添加用户 -->
    <el-dialog v-model="saveUserVisible" title="添加用户">
      <el-form
        label-width="100px"
        ref="userFormRef"
        :model="userFormData"
        :rules="userFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFormData.username" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="userFormData.nickName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userFormData.password" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="saveUserVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 设置角色权限 -->
    <el-dialog v-model="assignRoleVisible" title="设置角色">
      <el-form
        label-width="100px"
        ref="assignRoleFormRef"
        :model="assignRoleFormData"
        :rules="assignRoleFormRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="assignRoleFormData.username" disabled />
        </el-form-item>
        <el-form-item label="角色列表" prop="roleId">
          <el-checkbox
            v-model="assignRoleFormData.checkAll"
            :indeterminate="assignRoleFormData.isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>

          <el-checkbox-group
            v-model="assignRoleFormData.roleId"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in assignRoleFormData.allRolesList"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignRoleVisible = false">取消</el-button>
          <el-button type="primary" @click="assignRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "NUser",
};
</script>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Search, User, Edit, Delete } from "@element-plus/icons-vue";
import {
  getUserListApi,
  saveUserApi,
  getUserRoleListApi,
  assignUserRoleApi,
} from "@/api/acl/user";
import { ElMessage } from "element-plus";
import type { UserList, UserItem, RoleList } from "@/api/acl/models/userModel";
import type { FormInstance, FormRules } from "element-plus";

// 分页查询
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);

const username = ref("");
const userList = ref<UserList>([]);

// 控制loading
const loading = ref(false);

// 添加用户
const saveUserVisible = ref(false);

// 获取数据
const getUserList = async () => {
  loading.value = true;
  const res = await getUserListApi({
    page: currentPage.value,
    limit: pageSize.value,
    username: username.value,
  });
  total.value = res.total;
  userList.value = res.items;
  loading.value = false;
};

// 显示添加用户
const showSaveUser = () => {
  saveUserVisible.value = true;
  userFormData.username = "";
  userFormData.nickName = "";
  userFormData.password = "";
  userFormRef.value?.clearValidate();
};

const userFormRef = ref<FormInstance>();
const userFormData = reactive({
  username: "",
  nickName: "",
  password: "",
});

// 定义表单校验
const userFormRules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

// 添加用户
const saveUser = async () => {
  await userFormRef.value?.validate();
  await saveUserApi(userFormData);
  ElMessage.success("添加用户成功");
  saveUserVisible.value = false;
  getUserList();
};

onMounted(getUserList);

// 给用户设置角色
const assignRoleVisible = ref(false);

const showAssignRole = async (row: UserItem) => {
  const res = await getUserRoleListApi(row.id);
  assignRoleFormData.roleId = res.assignRoles.map((role) => role.id);
  assignRoleFormData.allRolesList = res.allRolesList;
  assignRoleFormData.isIndeterminate =
    !!assignRoleFormData.roleId.length &&
    assignRoleFormData.roleId.length !== assignRoleFormData.allRolesList.length;

  assignRoleVisible.value = true;
  assignRoleFormData.username = row.username;
  assignRoleFormData.userId = row.id;
};

const assignRoleFormRef = ref<FormInstance>();

interface AssignRoleFormData {
  username: string;
  userId: string;
  roleId: string[];
  checkAll: boolean;
  isIndeterminate: boolean;
  allRolesList: RoleList;
}

const assignRoleFormData = reactive<AssignRoleFormData>({
  username: "",
  userId: "",
  roleId: [],
  checkAll: false, // 全选
  isIndeterminate: false, // 是否半选
  // assignRoles: [],
  allRolesList: [],
});

const assignRoleFormRules = reactive<FormRules>({
  roleId: [{ required: true, message: "请设置角色", trigger: "blur" }],
});

// 全选
const handleCheckAllChange = (val: boolean | string | number) => {
  if (val) {
    assignRoleFormData.roleId = assignRoleFormData.allRolesList.map(
      (role) => role.id
    );
  } else {
    assignRoleFormData.roleId = [];
  }

  assignRoleFormData.isIndeterminate = false;
};
// 单个选
const handleCheckedChange = () => {
  assignRoleFormData.isIndeterminate =
    !!assignRoleFormData.roleId.length &&
    assignRoleFormData.roleId.length !== assignRoleFormData.allRolesList.length;

  assignRoleFormData.checkAll =
    assignRoleFormData.roleId.length === assignRoleFormData.allRolesList.length;
};

const assignRole = async () => {
  await assignRoleFormRef.value?.validate();
  await assignUserRoleApi(assignRoleFormData.userId, assignRoleFormData.roleId);
  getUserList();
  assignRoleVisible.value = false;
  ElMessage.success("给用户分配角色成功");
};
</script>

<style scoped>
.user-table {
  margin: 15px 0;
}
</style>
