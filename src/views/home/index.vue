<template>
  <div>
    <el-row :gutter="10">
      <el-col class="home-col" :xs="24" :sm="12" :md="6">
        <CommonCard :title="'今日销售额'" value="100,278">
          <div>
            日同比 -19.19%
            <svg
              t="1664192598286"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7194"
              width="14"
              height="14"
            >
              <path
                d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                p-id="7195"
                fill="#15d20c"
              ></path>
            </svg>
          </div>
          <div>
            日同比 56.66%
            <svg
              t="1664192669273"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3814"
              width="14"
              height="14"
            >
              <path
                d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                p-id="3815"
                fill="#d81e06"
              ></path>
            </svg>
          </div>
          <template #footer> 昨日销售额¥ 360,000,00 </template>
        </CommonCard>
      </el-col>
      <el-col class="home-col" :xs="24" :sm="12" :md="6">
        <CommonCard :title="'今日订单'" value="1,990,278">
          <LineChart></LineChart>
          <template #footer> 昨日订单量¥ 210,000,0 </template>
        </CommonCard>
      </el-col>
      <el-col class="home-col" :xs="24" :sm="12" :md="6">
        <CommonCard title="今日交易用户数" value="110,120">
          <BarChart></BarChart>
          <template #footer> 退货率5.99% </template>
        </CommonCard>
      </el-col>
      <el-col class="home-col" :xs="24" :sm="12" :md="6">
        <CommonCard title="累计用户数" value="110,110,5">
          <ProgressChart></ProgressChart>
          <template #footer>
            日同比 16.66%
            <svg
              t="1664192598286"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7194"
              width="14"
              height="14"
            >
              <path
                d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                p-id="7195"
                fill="#15d20c"
              ></path>
            </svg>
            月同比 11.11%
            <svg
              t="1664192669273"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3814"
              width="14"
              height="14"
            >
              <path
                d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
                p-id="3815"
                fill="#d81e06"
              ></path>
            </svg>
          </template>
        </CommonCard>
      </el-col>
    </el-row>
    <Sales></Sales>
    <Nmap></Nmap>
  </div>
</template>

<script lang="ts">
export default {
  name: "NHome",
};
</script>
<script lang="ts" setup>
import CommonCard from "./components/CommonCard.vue";
import LineChart from "./components/LineChart.vue";
import BarChart from "./components/BarChart.vue";
import ProgressChart from "./components/ProgressChart.vue";
import Sales from "./components/Sales.vue";
import Nmap from "./components/Nmap.vue";
</script>

<style scoped>
.home-col {
  margin-bottom: 10px;
}
</style>
