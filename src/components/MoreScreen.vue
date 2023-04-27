<template>
    <div class="morescreen-view">
        <div class="morescreen-top-view">
            <div id="top-left" class="map-item"></div>
            <div id="top-right" class="map-item"></div>
        </div>
        <div class="morescreen-bottom-view">
            <div id="buttom-left" class="map-item"></div>
            <div id="buttom-right" class="map-item"></div>
        </div>
    </div>
</template>
<script>
import { loadModules } from 'esri-loader';
import config from './config';
export default {
    name: 'MoreScreen',
    mounted() {
        this._initMapView();
    },
    methods: {
        async _initMapView() {
            // const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom] = await loadModules(
            const [Map, MapView, Basemap, TileLayer, watchUtils] = await loadModules(
                ['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/TileLayer', 'esri/core/watchUtils'],
                config.options,
            );

            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });

            //之后的逻辑是：每个map添加不同的业务图层（在map上整），所以要建立4个map
            const map01 = new Map({
                basemap,
            });
            const mapView01 = new MapView({
                container: 'top-left',
                map: map01,
                zoom: 10,
                center: [114.02919, 30.58203],
                // [104.072745, 30.663774],
            });
            const map02 = new Map({
                basemap,
            });
            const mapView02 = new MapView({
                container: 'top-right',
                map: map02,
                zoom: 10,
                center: [114.02919, 30.58203],
            });
            const map03 = new Map({
                basemap,
            });
            const mapView03 = new MapView({
                container: 'buttom-left',
                map: map03,
                zoom: 10,
                center: [114.02919, 30.58203],
            });
            const map04 = new Map({
                basemap,
            });
            const mapView04 = new MapView({
                container: 'buttom-right',
                map: map04,
                zoom: 10,
                center: [114.02919, 30.58203],
            });
            mapView01.ui.components = [];
            mapView02.ui.components = [];
            mapView03.ui.components = [];
            mapView04.ui.components = [];
            //地图联动
            //以第一幅地图为主
            watchUtils.whenTrue(mapView01, 'stationary', function () {
                if (mapView01.center) {
                    /* console.log('1', mapView01.center.x, mapView01.center.y);
                    输出的是投影坐标。
                    //把投影坐标-->经纬度需要两部
                    1，投影坐标-->屏幕坐标  toScreen  ["esri/views/MapView"]
                    2.把屏幕坐标转为经纬度：toMap()  ["esri/views/MapView"]
                    // get the screen point for the specified map point.
                    const mapPoint = {
                        x: mapView01.center.x,
                        y: mapView01.center.y,
                        spatialReference: {
                            wkid: 3395,
                        }, */

                    //我们现在的返回数据有经纬度在上边转化半天
                    mapView02.goTo({
                        center: [mapView01.center.longitude, mapView01.center.latitude],
                        zoom: mapView01.zoom,
                    });
                    mapView03.goTo({
                        center: [mapView01.center.longitude, mapView01.center.latitude],
                        zoom: mapView01.zoom,
                    });
                    mapView04.goTo({
                        center: [mapView01.center.longitude, mapView01.center.latitude],
                        zoom: mapView01.zoom,
                    });

                    /*                const screenPoint = mapView01.toMap(mapPoint);
                    console.log(screenPoint);
                    if (screenPoint) {
                        mapView02.goTo({
                            center: [screenPoint.longitude, screenPoint.latitude],
                        });
                        mapView03.goTo({
                            center: [screenPoint.longitude, screenPoint.latitude],
                        });
                        mapView04.goTo({
                            center: [screenPoint.longitude, screenPoint.latitude],
                        });
                    } */

                    // console.log('1(控制两位小数)', mapView01.center.x.toFixed(2), mapView01.center.y.toFixed(2));
                }
                /*   //获得展示区域左上角、右下角点坐标，之后可以判断点坐标+禁用拖动==>控制拖动区域
                if (mapView01.extent) {
                    console.log(
                        '2',
                        mapView01.extent.xmin.toFixed(2),
                        mapView01.extent.xmax.toFixed(2),
                        mapView01.extent.ymin.toFixed(2),
                        mapView01.extent.ymax.toFixed(2),
                    );
                } */
            });
        },
    },
};
</script>
<style>
.morescreen-view {
    width: 100%;
    height: 100%;
}
.map-item {
    width: calc(50% - 2.5px);
    height: 100%;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
}
.morescreen-top-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5px;
}
.morescreen-bottom-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between;
    margin-top: 2.5px;
}
#top-left {
    margin-right: 2.5px;
}
#top-right {
    margin-left: 2.5px;
}
#buttom-left {
    margin-right: 2.5px;
}
#buttom-right {
    margin-left: 2.5px;
}
</style>
