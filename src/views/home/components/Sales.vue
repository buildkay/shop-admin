<template>
  <el-card>
    <div class="sales-header">
      <!-- 选项卡 -->
      <el-tabs v-model="tab">
        <el-tab-pane label="销售额" name="sales" />
        <el-tab-pane label="访问量" name="visited" />
      </el-tabs>

      <div class="sales-date">
        <!-- 单选框 -->
        <el-radio-group
          class="sales-date-radio"
          v-model="radioValue"
          @change="handleRadioChange"
        >
          <el-radio-button label="今日" />
          <el-radio-button label="本周" />
          <el-radio-button label="本月" />
          <el-radio-button label="今年" />
        </el-radio-group>

        <el-date-picker
          v-model="date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD"
        />
      </div>
    </div>

    <div class="chart-container" ref="chartRef"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "NSales",
};
</script>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import type { SingleOrRange, DateModelType } from "element-plus";

const tab = ref("sales");

watch(tab, (tab) => {
  myEcharts.setOption({
    title: {
      text: tab === "sales" ? "销售趋势" : "访问量趋势",
    },
    series: {
      data: getData(),
    },
  });
});

function getData() {
  const data = [];

  for (let i = 0; i < 12; i++) {
    data.push(Math.round(Math.random() * 70 + 30));
  }

  return data;
}

const chartRef = ref();

let myEcharts: ECharts;

onMounted(() => {
  myEcharts = echarts.init(chartRef.value);
  const option = {
    xAxis: {
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
    },
    yAxis: {},
    title: {
      text: "销售趋势",
    },
    series: {
      type: "bar",
      data: getData(),
    },
  };
  myEcharts.setOption(option);
});

const shortcuts = [
  {
    text: "最近一周",
    value: () => {
      const start = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");
      const end = dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD");
      return [start, end];
    },
  },
  {
    text: "最近一个月",
    value: () => {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      return [start, end];
    },
  },
  {
    text: "最近三个月",
    value: () => {
      const start = dayjs()
        .subtract(2, "month")
        .startOf("month")
        .format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      return [start, end];
    },
  },
];

const radioValue = ref("今日");
const handleRadioChange = (val: string | number | boolean) => {
  if (val === "今日") {
    const start = dayjs().format("YYYY-MM-DD");
    date.value = [start, start];
  } else if (val === "本周") {
    const start = dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD");
    const end = dayjs().endOf("week").add(1, "day").format("YYYY-MM-DD");
    date.value = [start, end];
  } else if (val === "本月") {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    date.value = [start, end];
  } else {
    const start = dayjs().startOf("year").format("YYYY-MM-DD");
    const end = dayjs().endOf("year").format("YYYY-MM-DD");
    date.value = [start, end];
  }
};

const start = dayjs().format("YYYY-MM-DD");
const date = ref<SingleOrRange<DateModelType>>([start, start]);
</script>

<style scoped>
.sales-header {
  position: relative;
}

.sales-date {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
}
.sales-date-radio {
  margin-right: 10px;
}

.chart-container {
  height: 400px;
}
</style>
