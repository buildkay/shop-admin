<template>
  <el-card class="spu-card">
    <el-form
      label-width="100px"
      ref="spuFormRef"
      :model="spuFormData"
      :rules="spuFormRules"
    >
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spuFormData.spuName" />
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spuFormData.tmId">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          placeholder="SPU描述"
          :rows="2"
          type="textarea"
          v-model="spuFormData.description"
        />
      </el-form-item>
      <el-form-item label="SPU图片" prop="spuImageList">
        <el-upload
          v-model:file-list="spuFormData.spuImageList"
          :action="UPLOAD_URL_PREFIX + '/admin/product/fileUpload'"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeAvatarUpload"
          :limit="3"
          :on-exceed="beyondAttr"
          :on-success="handleSuccess"
        >
          <el-icon
            ><Plus v-if="spuFormData.spuImageList.length < 3" />
            <p v-else class="tip-p">已达到最大上传数量</p></el-icon
          >
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </template>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="预览图片" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select
          :placeholder="`还剩 ${filterBaseSaleAttrList.length} 个未选择`"
          v-model="selectedSaleAttr"
        >
          <el-option
            v-for="baseSaleAttr in filterBaseSaleAttrList"
            :key="baseSaleAttr.id"
            :label="baseSaleAttr.name"
            :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          :icon="Plus"
          class="spu-btn"
          :disabled="!selectedSaleAttr"
          @click="addSaleAttr"
        >
          增加销售属性
        </el-button>
        <el-table :data="spuFormData.spuSaleAttrList" border class="spu-table">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="60"
          />
          <el-table-column label="属性名" prop="saleAttrName" width="200" />
          <el-table-column label="属性值名称列表" prop="xxx">
            <template v-slot="{ row }">
              <!-- tag框 -->
              <el-tag
                closable
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.saleAttrValueName"
                class="spu-tag"
                @close="delSaleAttrValue(row, index)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>
              <!-- 编辑 -->
              <el-input
                placeholder="请输入属性值名称"
                size="small"
                class="spu-input"
                v-if="row.isEdit"
                ref="inputRef"
                v-model="saleAttrValueName"
                @blur="addSaleAttrValueName(row)"
                @keyup.enter="addSaleAttrValueName(row)"
              ></el-input>
              <!-- 显示 -->
              <el-button
                :icon="Plus"
                size="small"
                v-else
                @click="showEdit(row)"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="{ $index }">
              <el-tooltip content="删除销售属性" placement="bottom">
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="small"
                  @click="delSaleAttr($index)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="showSaveSpu">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "SaveOrUpdate",
};
</script>

<script lang="ts" setup>
import { onMounted, reactive, ref, computed, nextTick } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { getAllTrademarkListApi } from "@/api/product/trademark";
import type { TrademarkList } from "@/api/product/models/trademarkModel";
import {
  getBaseSaleAttrListApi,
  saveSpuApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
  updateSpuApi,
} from "@/api/product/spu";
import type {
  BaseSaleAttrList,
  SpuFormData,
  SaveSpuSaleAttrItem,
  SaveSpuSaleAttrList,
} from "@/api/product/models/spuModel";
import type { FormInstance, FormRules, UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import { useCategoryStore } from "@/stores/category";

const trademarkList = ref<TrademarkList>([]);
const baseSaleAttrList = ref<BaseSaleAttrList>([]);

// 请求数据
onMounted(async () => {
  trademarkList.value = await getAllTrademarkListApi();
});

onMounted(async () => {
  baseSaleAttrList.value = await getBaseSaleAttrListApi();
});

// 组件创建后就要发送请求
onMounted(async () => {
  const { id } = spuFormData;
  if (!id) return;
  const res = await getSpuImageListApi(id);
  spuFormData.spuImageList = res.map((img) => {
    return {
      name: img.imgName,
      url: img.imgUrl,
    };
  });
});

onMounted(async () => {
  const { id } = spuFormData;
  if (!id) return;
  spuFormData.spuSaleAttrList = await getSpuSaleAttrListApi(id);
});

const props = defineProps<{
  spu: SpuFormData;
}>();

// 表单实例
const spuFormRef = ref<FormInstance>();

// 表单数据容器
const spuFormData = reactive<SpuFormData>(props.spu);

// 请求前缀
const UPLOAD_URL_PREFIX = import.meta.env.VITE_API_URL;

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// 收集属性值
const saleAttrValueName = ref("");

const inputRef = ref();

// 预览
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url as string;
  dialogVisible.value = true;
};

// 超出后执行的钩子函数
const beyondAttr = () => {
  alert("已经到达了最大的上传数量！！！");
};

// 限制图片的大小和类型
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // 定义图片类型
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

// 上传成功的回调函数
const handleSuccess = () => {
  if (spuFormData.spuImageList.length === 1) {
    spuFormRef.value?.clearValidate(["spuImageList"]);
  }
};

// 选中的销售属性
const selectedSaleAttr = ref("");

// 自定义校验规则
const spuSaleAttrListValidator = (
  rule: any,
  value: SaveSpuSaleAttrList,
  callback: any
) => {
  if (!value.length) {
    callback(new Error("至少添加一个销售属性"));
    return;
  }
  if (!value.every((saleAttr) => saleAttr.spuSaleAttrValueList.length)) {
    callback(new Error("每个销售属性至少添加一个属性值"));
    return;
  }
  callback();
};

// 定义表单规则
const spuFormRules = reactive<FormRules>({
  tmId: [{ required: true, message: "请输入SPU品牌" }],
  spuName: [{ required: true, message: "请输入SPU名称", trigger: "blur" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
  spuImageList: [{ required: true, message: "请上传SPU图片" }],
  spuSaleAttrList: [{ required: true, validator: spuSaleAttrListValidator }],
});

// 添加销售属性
const addSaleAttr = () => {
  const [id, name] = selectedSaleAttr.value.split(":");
  spuFormData.spuSaleAttrList.push({
    baseSaleAttrId: +id,
    saleAttrName: name,
    spuSaleAttrValueList: [],
    isEdit: false,
  });
  selectedSaleAttr.value = "";
};

// 销售属性
const filterBaseSaleAttrList = computed(() => {
  return baseSaleAttrList.value.filter((baseSaleAttr) => {
    return !spuFormData.spuSaleAttrList.some(
      (saleAttr) => saleAttr.baseSaleAttrId === baseSaleAttr.id
    );
  });
});

// 接受事件
const emit = defineEmits(["setIsShow"]);

// 组件切换
const showSaveSpu = () => {
  emit("setIsShow", 1);
};

// 删除销售属性
const delSaleAttr = (index: number) => {
  spuFormData.spuSaleAttrList.splice(index, 1);
};

// 进入显示模式
const addSaleAttrValueName = (row: SaveSpuSaleAttrItem) => {
  if (saleAttrValueName.value) {
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrValueName: saleAttrValueName.value,
    });

    saleAttrValueName.value = "";
  }
  row.isEdit = false;
};

// 进入编辑模式
const showEdit = async (row: SaveSpuSaleAttrItem) => {
  row.isEdit = true;
  await nextTick();
  inputRef.value.focus();
};

// 删除销售属性值
const delSaleAttrValue = (row: SaveSpuSaleAttrItem, index: number) => {
  row.spuSaleAttrValueList.splice(index, 1);
};

const categoryStore = useCategoryStore();

// 提交表单
const submitForm = async () => {
  await spuFormRef.value?.validate();

  const data = {
    ...spuFormData,
    tmId: spuFormData.tmId as number,
    spuImageList: spuFormData.spuImageList.map((img) => {
      return {
        imgName: img.name,
        imgUrl: img.response ? (img.response as any).data : img.url,
      };
    }),
    category3Id: categoryStore.category3Id as number,
  };

  if (spuFormData.id) {
    updateSpuApi(data);
  } else {
    await saveSpuApi(data);
  }

  ElMessage.success(`${spuFormData.id ? "更新" : "添加"}SPU成功`);
  showSaveSpu();
};
</script>

<style scoped>
.spu-card {
  margin-top: 20px;
}
.spu-table {
  margin-top: 10px;
}
.spu-btn {
  margin-left: 10px;
}
.tip-p {
  font-size: 12px;
}
.spu-input {
  width: 200px;
}
.spu-tag {
  margin-right: 12px;
}
</style>
