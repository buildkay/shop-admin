<template>
  <el-card>
    <div class="card-title">{{ title }}</div>
    <div class="card-value">{{ value }}</div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-line"></div>
    <div class="card-footer"><slot name="footer" /></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "CommonCard",
};
</script>

<script lang="ts" setup>
defineProps<{ title: string; value: string }>();
</script>

<style scoped>
.card-title {
  font-size: 12px;
  color: #999;
}
.card-value {
  font-size: 25px;
  margin: 5px 0;
  letter-spacing: 1px;
}

.card-body {
  height: 40px;
  font-size: 12px;
}

.card-line {
  height: 2px;
  background-color: #eee;
  margin: 10px 0;
}

.card-footer {
  font-size: 12px;
}
</style>
