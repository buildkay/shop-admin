<template>
  <el-card>
    <el-button
      type="primary"
      plain
      :icon="Plus"
      @click="showSaveOrUpdateTrademark()"
      >添加</el-button
    >
    <el-table
      v-loading="loading"
      :data="trademarkList"
      border
      class="trademark-table"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" :alt="row.tmName" class="trademark-img" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            :icon="Edit"
            size="small"
            @click="showSaveOrUpdateTrademark(row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="showRemoveTrademark(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[4, 5, 6]"
      :small="false"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="getTrademarkList"
      @current-change="getTrademarkList"
    />
    <!-- 添加和修改商品 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${trademarkFormData.id ? '修改' : '添加'}品牌`"
    >
      <el-form
        label-width="100px"
        ref="trademarkFormRef"
        :model="trademarkFormData"
        :rules="trademarkFormRules"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input
            class="trademark-input"
            v-model="trademarkFormData.tmName"
          />
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="UPLOAD_URL_PREFIX + '/admin/product/fileUpload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkFormData.logoUrl"
              :src="trademarkFormData.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "NTrademark",
};
</script>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
//导入类型
import type {
  TrademarkList,
  TrademarkItem,
} from "@/api/product/models/trademarkModel";
import {
  getTrademarkListApi,
  saveTrademarkApi,
  updateTrademarkApi,
  removeTrademarkApi,
} from "@/api/product/trademark";
//请求数据成功提醒
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, FormInstance, FormRules } from "element-plus";

/*********************** 删除品牌 *******************/
const showRemoveTrademark = (row: TrademarkItem) => {
  ElMessageBox.confirm(`您确认要删除 ${row.tmName} 吗?`, "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await removeTrademarkApi(row.id);
    ElMessage.success("删除品牌成功");
    getTrademarkList();
  });
};

/*********************** 修改品牌 *******************/
const showSaveOrUpdateTrademark = (
  row: TrademarkItem = { tmName: "", logoUrl: "", id: 0 }
) => {
  dialogVisible.value = true;
  // 表单赋值
  trademarkFormData.tmName = row.tmName;
  trademarkFormData.logoUrl = row.logoUrl;
  trademarkFormData.id = row.id; // 将来发送更新请求，需要id
  // 清空表单校验
  trademarkFormRef.value?.clearValidate();
};

/*********************** 添加品牌 *******************/
const dialogVisible = ref(false);

// 请求前缀
const UPLOAD_URL_PREFIX = import.meta.env.VITE_API_URL;

//上传成功
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  trademarkFormData.logoUrl = response.data;
  //清除表单验证
  trademarkFormRef.value?.clearValidate(["logoUrl"]);
};

//上传之前
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const imageTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (!imageTypes.includes(rawFile.type)) {
    ElMessage.error("上传的图片必须是jpg或png格式!");
    return false;
  } else if (rawFile.size / 1024 > 500) {
    ElMessage.error("上传的图片不能超过500kb!");
    return false;
  }

  return true;
};

// 表单组件实例对象
const trademarkFormRef = ref<FormInstance>();

// 定义表单数据
const trademarkFormData = reactive({
  tmName: "",
  logoUrl: "",
  id: 0,
});

// 定义表单校验的规则
const trademarkFormRules = reactive<FormRules>({
  tmName: [
    { required: true, message: "请输入品牌名称", trigger: "blur" },
    { min: 2, max: 10, message: "品牌名称长度只能为2-10位", trigger: "blur" },
  ],
  logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
});
// 提交表单
const submitForm = () => {
  trademarkFormRef.value?.validate(async (valid) => {
    if (valid) {
      const { tmName, logoUrl, id } = trademarkFormData;

      if (id) {
        // 修改品牌
        await updateTrademarkApi({ tmName, logoUrl, id });
      } else {
        // 添加品牌
        await saveTrademarkApi(tmName, logoUrl);
      }
      ElMessage.success(`${id ? "修改" : "添加"}品牌成功`);
      dialogVisible.value = false;
      getTrademarkList();
    }
  });
};

/*********************** 分页器功能 *******************/
const currentPage = ref(1);
const pageSize = ref(4);
const total = ref(0);

/*********************** 品牌列表数据展示 *******************/
const trademarkList = ref<TrademarkList>([]);
//判断loading状态
const loading = ref(false);
// 封装发送请求数据的函数
const getTrademarkList = async () => {
  loading.value = true;
  const res = await getTrademarkListApi(currentPage.value, pageSize.value);
  trademarkList.value = res.records;
  total.value = res.total;
  loading.value = false;
  ElMessage.success("获取数据成功");
};
onMounted(async () => {
  //发送请求
  getTrademarkList();
});
</script>

<style scoped>
.trademark-table {
  margin: 20px 0;
}
.trademark-img {
  width: 60px;
  height: 40px;
}
.trademark-input {
  width: 80%;
}
</style>

<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
