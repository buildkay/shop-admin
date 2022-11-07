<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script lang="ts">
export default {
  name: "LineChart",
};
</script>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

// 引入echarts
import * as echarts from "echarts";

const chartRef = ref();

onMounted(() => {
  const myEcharts = echarts.init(chartRef.value);
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
      // 留白
      boundaryGap: false,
    },
    yAxis: {
      // 隐藏
      show: false,
    },
    tooltip: {},
    series: {
      type: "line",
      data: [10, 20, 30, 40, 50, 60, 50, 40, 30, 20, 10, 0],
      smooth: true,
      itemStyle: {
        opacity: 0,
      },
      // 区域样式
      areaStyle: {
        color: "#a64ca6",
        opacity: 1,
      },
      // 折线样式
      lineStyle: {
        color: "rgba(0, 0, 0, 0)",
      },
    },
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  };
  myEcharts.setOption(option);
});
</script>

<style scoped>
.chart-container {
  height: 100%;
}
</style>
