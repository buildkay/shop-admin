<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script lang="ts">
export default {
  name: "BarChart",
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
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      data: ["百分比"],
      // 留白
      boundaryGap: false,
    },
    tooltip: {},
    series: {
      type: "bar",
      data: [10],
      barWidth: 10,
      showBackground: true,
      itemStyle: {
        color: "#9acd32",
      },
    },
    label: {
      show: true,
      position: "right",
      formatter: "|",
      color: "#9acd32",
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
