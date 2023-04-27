<template>
    <div class="mapdata-visual-view">
        <div id="sceneview"></div>
        <div id="echarts01"></div>
    </div>
</template>
<script>
import { loadModules } from 'esri-loader';
import config from './config';
import * as echarts from 'echarts';
export default {
    name: 'MapDataVisual',
    data() {
        return {
            data: '',
        };
    },
    methods: {
        async initMap() {
            //实例化三维底图
            const [Map, SceneView, Basemap, TileLayer] = await loadModules(
                ['esri/Map', 'esri/views/SceneView', 'esri/Basemap', 'esri/layers/TileLayer'],
                config.options,
            );
            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', //黑蓝配色
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });

            const map = new Map({
                basemap: basemap,
            });

            const mapView = new SceneView({
                container: 'sceneview',
                map: map,
            });

            mapView.ui.components = []; //去掉左上角的缩放图标
        },
        //实例化echarts图表实例
        initEchart01() {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('echarts01'));

            // 指定图表的配置项和数据
            const option = {
                title: {
                    text: 'ECharts 入门示例',
                },
                tooltip: {},
                legend: {
                    data: ['销量'],
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
    },
    mounted() {
        this.initMap();
        this.initEchart01();
    },
};
</script>
<style>
.mapdata-visual-view {
    position: relative;
    width: 100%;
    height: 100%;
}
#sceneview {
    position: absolute;
    width: 100%;
    height: 100%;
}
#echarts01 {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 300px;
    height: 200px;
    background-color: antiquewhite;
}
</style>
