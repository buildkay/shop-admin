<template>
  <el-card class="sku-card">
    <el-form
      label-width="100px"
      ref="skuFormRef"
      :model="skuFormData"
      :rules="skuFormRules"
    >
      <el-form-item label="SPU名称">{{ props.spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="skuFormData.skuName" />
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          class="sku-input-number"
          :min="0"
          :max="10000000"
          controls-position="right"
          placeholder="请输入价格"
          v-model="skuFormData.price"
        />
      </el-form-item>
      <el-form-item label="重量(kg)" prop="weight">
        <el-input-number
          class="sku-input-number"
          :min="0"
          :max="10000000"
          controls-position="right"
          placeholder="请输入重量"
          v-model="skuFormData.weight"
        />
      </el-form-item>
      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          placeholder="请输入SKU规格描述"
          type="textarea"
          :row="2"
          v-model="skuFormData.skuDesc"
        />
      </el-form-item>
      <el-form-item label="平台属性" prop="skuAttrValueList">
        <el-row :gutter="10" class="sku-wrap">
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <div class="sku-attr-wrap">
              <span class="sku-attr-name">{{ attr.attrName }}</span>
              <el-select v-model="skuFormData.skuAttrValueList[index]">
                <el-option
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <el-row :gutter="10" class="sku-wrap">
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <div class="sku-attr-wrap">
              <span class="sku-attr-name">{{ saleAttr.saleAttrName }}</span>
              <el-select v-model="skuFormData.skuSaleAttrValueList[index]">
                <el-option
                  v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                  :key="saleAttrValue.id"
                  :label="saleAttrValue.saleAttrValueName"
                  :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}`"
                />
              </el-select>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          :data="spuImageList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" class="sku-img" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-tag type="success" size="small" v-if="row.isDefault === '1'">
                默认
              </el-tag>
              <el-button
                type="primary"
                size="small"
                v-else
                @click="setSkuDefaultImg(row)"
              >
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "SaveSku",
};
</script>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { useCategoryStore } from "@/stores/category";
import type { FormInstance, FormRules } from "element-plus";
import { getAttrListApi } from "@/api/product/attr";
import { getSpuSaleAttrListApi, getSpuImageListApi } from "@/api/product/spu";
import type {
  SpuFormData,
  SpuImageList,
  SpuSaleAttrList,
} from "@/api/product/models/spuModel";
import type { AttrList } from "@/api/product/models/attrModel";
import { saveSkuApi } from "@/api/product/sku";
import { ElMessage } from "element-plus";

const categoryStore = useCategoryStore();

const props = defineProps<{
  spu: SpuFormData;
}>();
// 接受事件
const emit = defineEmits(["setIsShow"]);

// 组件切换
const showSaveSpu = () => {
  emit("setIsShow", 1);
};

const attrList = ref<AttrList>([]);
const spuSaleAttrList = ref<SpuSaleAttrList>([]);
const spuImageList = ref<SpuImageList>([]);

// 组件创建时请求数据
onMounted(async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  attrList.value = await getAttrListApi({
    category1Id: category1Id as number,
    category2Id: category2Id as number,
    category3Id: category3Id as number,
  });
});

onMounted(async () => {
  spuImageList.value = await getSpuImageListApi(props.spu.id as number);
});

onMounted(async () => {
  spuSaleAttrList.value = await getSpuSaleAttrListApi(props.spu.id as number);
});

const skuFormRef = ref<FormInstance>();
const skuFormData = reactive({
  skuName: "",
  price: 5,
  weight: 5,
  skuDesc: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: [],
  skuDefaultImg: "",
});

// 定义自定义表单规则
const skuImageListValidator = (rule: any, value: any, callback: any) => {
  if (!value.length) {
    callback("请至少选择一张图片");
    return;
  }

  if (!skuFormData.skuDefaultImg) {
    callback("请至少选择一张默认图片");
    return;
  }

  callback();
};

// 定义表单校验规则
const skuFormRules = reactive<FormRules>({
  skuName: [{ required: true, message: "请输入SKU名称", trigger: "blur" }],
  price: [{ required: true, message: "请输入SKU价格", trigger: "blur" }],
  weight: [{ required: true, message: "请输入SKU重量", trigger: "blur" }],
  skuDesc: [{ required: true, message: "请输入SKU规则描述", trigger: "blur" }],
  skuAttrValueList: [{ required: true, message: "请选择SKU平台属性" }],
  skuSaleAttrValueList: [{ required: true, message: "请选择SKU销售属性" }],
  skuImageList: [{ required: true, validator: skuImageListValidator }],
});

// 默认图片
const setSkuDefaultImg = (row: any) => {
  spuImageList.value.forEach((img: any) => {
    img.isDefault = "0";
  });
  row.isDefault = "1";
  if (!skuFormData.skuDefaultImg) {
    skuFormRef.value?.clearValidate(["skuImageList"]);
  }
  skuFormData.skuDefaultImg = row.imgUrl;
};

// 收集图片数据
const handleSelectionChange = (val: any) => {
  skuFormData.skuImageList = val;
};

// 提交表单
const submitForm = async () => {
  await skuFormRef.value?.validate();
  saveSkuApi({
    ...skuFormData,
    skuSaleAttrValueList: skuFormData.skuSaleAttrValueList
      .filter(Boolean)
      .map((attr: any) => {
        const [saleAttrId, saleAttrName, saleAttrValueId, saleAttrValueName] =
          attr.split(":");
        return {
          saleAttrId: +saleAttrId, // 销售属性id
          saleAttrName,
          saleAttrValueId: +saleAttrValueId, // 销售属性值id
          saleAttrValueName,
        };
      }),
    skuAttrValueList: skuFormData.skuAttrValueList
      .filter(Boolean)
      .map((attr: any) => {
        const [attrId, attrName, valueId, valueName] = attr.split(":");
        return {
          attrId: +attrId, // 属性id
          attrName,
          valueId: +valueId, // 属性值id
          valueName,
        };
      }),
    spuId: props.spu.id,
    category3Id: categoryStore.category3Id,
  });
  ElMessage.success("SKU更新成功");
  showSaveSpu();
};
</script>

<style scoped lang="scss">
.sku-card {
  margin-top: 20px;
  &:deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
}

.sku-input-number,
.sku-wrap {
  width: 100%;
}

.sku-attr-name {
  margin-right: 10px;
  white-space: nowrap;
}

.sku-attr-wrap {
  margin-bottom: 10px;
  display: flex;
}
.sku-img {
  width: 200px;
  height: 100px;
}
</style>
