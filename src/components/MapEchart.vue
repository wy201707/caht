<template>
    <div class="mapview-pannel">
        <div id="mapview"></div>
        <div id="basemapToggle"></div>
        <div id="scalebar"></div>
        <div id="zoom"></div>

        <div class="view-home" id="viewHome"></div>
        <!-- <button class="btn" @click="useEchart()">点击绘图</button> -->
        <!-- <div id="main" style="width: 600px; height: 400px; display: flex">
            <button @click="useEchart">点击绘图</button>
        </div> -->
        <div id="echartDiv"></div>
        
<div id = "location" style="position: absolute;z-index: 999;background:red;">I am here!</div>

        <!-- <div class="TimeInfoComponent-pannel-Test">
            <el-form ref="TimeSetData" :model="TimeSetData" label-width="80px" size="small">
                <el-form-item label="选择时间">
                    <el-col :span="22">
                        <el-date-picker
                            v-model="TimeSetData.startDT"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width: 100%"
                        >
                        </el-date-picker>
                    </el-col>
                </el-form-item>

                <el-form-item label="参数类型">
                    <el-radio-group v-model="TimeSetData.DataType">
                        <el-radio :label="1">风 风速、风向</el-radio>
                        <el-radio :label="2">浪 浪高、浪向</el-radio>
                        <el-radio :label="3">流 流速、流向</el-radio>
                    </el-radio-group>
 
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="useEchart">显示</el-button>
          
                    <el-button @click="ClearData">清屏</el-button>
       
                </el-form-item>
            </el-form>-->
        </div> 
    </div>
</template>
<script>
import { loadModules } from 'esri-loader';
import config from './config';
import * as echarts from 'echarts';
// import * as echarts from 'echarts/core';
// import { VisualMapComponent } from 'echarts/components';
// import { CanvasRenderer } from 'echarts/renderers';
// import { FlowGLChart } from 'echarts-gl/charts';
// 请确保在引入百度地图扩展之前已经引入百度地图 JS API 脚本并成功加载
// https://api.map.baidu.com/api?v=3.0&ak=你申请的AK
// import 'echarts/extension/bmap/bmap';
// import EchartsLayer from './../assets/js/EchartsLayer';
import jquery from './../assets/js/jquery-3.6.2.min';
export default {
    name: 'APP',
    data() {
        return {
            mapView: null,
            echartsInfos: [],
            TimeSetData: {
                startDT: '',
                DataType: 1, //默认不跨天
            },
        };
    },
    computed: {
        start() {
            if (this.TimeSetData.startDT) {
                let sDT = this.TimeSetData.startDT;
                sDT.setMinutes(Math.round(sDT.getMinutes() / 10) * 10);
                this.TimeSetData.startDT = sDT;
                // if (this.SaveTime != '' && this.SaveTime!=sDT) {
                //     this.TimeSetData.startDT = this.SaveTime;
                // }
            } else {
                this.TimeSetData.startDT = new Date('2021/09/12 0:00:00');
            }
            return this.TimeSetData.startDT;
        },
    },
    methods: {
        ClearData() {
            console.log(' ClearData');

            const view = this.mapView;
            const resultLayer = view.map.findLayerById('GeoJSON'); //这里要改
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
        },
        async _createMapView() {
            // 妈的获得的是div的id，因为scaleBar中的B搞了半天
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scalebar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom, Home, Graphic, Point,SimpleMarkerSymbol] =
                await loadModules(
                    [
                        'esri/Map',
                        'esri/views/MapView',
                        'esri/Basemap',
                        'esri/layers/TileLayer',
                        'esri/widgets/BasemapToggle',
                        'esri/widgets/ScaleBar',
                        'esri/widgets/Zoom',
                        'esri/widgets/Home',
                        'esri/Graphic',
                        'esri/geometry/Point',
                        "esri/symbols/SimpleMarkerSymbol",
                    ],
                    config.options,
                );

            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
                        // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', //黑蓝配色
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                thumbnailUrl: `static/basemap1.png`,
                id: 'basemap',
            });
            let basemap2 = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                        title: 'Basemap2',
                    }),
                ],
                thumbnailUrl: `static/basemap2.png`,
                title: 'basemap',
                id: 'basemap',
            });
            const map = new Map({
                basemap,
                // basemap: 'topo-vector',
            });
            const mapView = new MapView({
                container: 'mapview',
                map: map,
                zoom: 10,
                center: [117.81813, 24.44658],
            });
        
            this.basemapToggle = new BasemapToggle({
                view: mapView, // The view that provides access to the map's "streets-vector" basemap
                nextBasemap: basemap2, // 下一次底图
                // nextBasemap: a,
                container: 'basemapToggle', //id=basemapToggle的那个div
                visible: true,
            });
          
            mapView.ui.add(this.basemapToggle); //与底部样式一起实现地图切换控件自定义位置
           
            //添加比例尺
            this.scaleBar = new ScaleBar({
                view: mapView,
                unit: 'metric',
                container: 'scalebar',
            });
            mapView.ui.add(this.scaleBar);
            //添加缩放控件
            this.zoom = new Zoom({
                view: mapView,
                container: 'zoom',
            });
            mapView.ui.add(this.zoom);
            mapView.ui.add(
                new Home({
                    view: mapView,
                    container: 'viewHome',
                }),
            );

            // console.log('before []', mapView.ui.components);
            mapView.ui.components = []; //去掉左上角的缩放图标(地图自带的，没办法设置格式和位置)
            this.mapView = mapView; //设置默认地图
            var point = new Point({
                longitude: -49.97,
                latitude: 24.44658 ,
            });
            var markerSymbol = new SimpleMarkerSymbol({
                color: [226, 119, 40],
                outline: {
                    color: [255, 255, 255],
                    width: 2,
                },
            });
            console.log('未添加前',this.mapView.graphics)
debugger
            var pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol,
            });

            mapView.graphics.add(pointGraphic);
            console.log('添加后',this.mapView.graphics)
 
debugger
            mapView.watch('extent', function (evt) {
                var point = mapView.graphics.getItemAt(0);
                if (point.geometry) {
                    // 关键代码 点的空间参考需与地图保持一致
                    point.geometry.spatialReference = mapView.spatialReference;
                    var screenPoint = mapView.toScreen(point.geometry);
                    var test = document.getElementById('location');
                    test.style.top = Number(screenPoint.y) + 'px';
                    test.style.left = Number(screenPoint.x) + 'px';
                    console.log('最后的点坐标',screenPoint)
debugger
                }
            });
            console.log('所以为什么看不见',this.mapView)
           
        },

 
    },
    mounted() {
        this._createMapView();
        this.TimeSetData.startDT = this.start;
        // console.log('这咋了？');
        // var myChart = echarts.init(document.getElementById('mapview'));
        // console.log('到底拿没拿到面板', myChart);
    },
};
</script>
<style lang="css">
.TimeInfoComponent-pannel-Test {
    position: absolute;
    top: 20px;
    left: 50px;
    width: 280px;
    height: 180px;
    background-color: #fff;
}
/* #mapview {
    position: absolute;
    width: 100%;
    height: 100%;
} */

#mapview,
.mapview-pannel {
    position: relative;
    width: 100%;
    height: 100%;
}
#basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
}
#scalebar {
    position: absolute;
    left: 20px;
    bottom: 15px;
}
#zoom {
    position: absolute;
    right: 20px;
    bottom: 95px;
}
.view-change {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 15px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-home {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 15px;
    bottom: 220px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.btn {
    position: absolute;
    width: 120px;
    height: 32px;
    right: 15px;
    bottom: 260px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-change span {
    line-height: 32px;
}
</style>

<!-- url: `static/icon/train.jpg`, -->
