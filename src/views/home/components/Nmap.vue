<template>
  <el-card>
    <div id="map-container"></div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "NMap",
};
</script>

<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement("script");
  script.src =
    "https://api.map.baidu.com/api?v=1.0&&type=webgl&ak=u7t6VoSMWQMzHbMoGPkSgcSM1WqZRC7o&callback=initMap";
  document.body.appendChild(script);

  window.initMap = () => {
    const map = new BMapGL.Map("map-container");
    const point = new BMapGL.Point(114.05, 22.543099);
    map.centerAndZoom(point, 8);

    const scaleCtrl = new BMapGL.ScaleControl();
    map.addControl(scaleCtrl);
    // const zoomCtrl = new BMapGL.ZoomControl(); // 添加缩放控件
    // map.addControl(zoomCtrl);
    const cityCtrl = new BMapGL.CityListControl(); // 添加城市列表控件
    map.addControl(cityCtrl);
  };
});
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 600px;
}
</style>
