<template>
    <div class="maptree-pannel" v-show="this.$store.getters._getDefaultMapTreeVisible">
        <div class="maptree-header">
            <span>图层管理</span>
            <i class="el-icon-close" @click="closeMapTreePannel"></i>
        </div>
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>  
            这个defaultProps好像没有用处 试了一下确实可以删除，大约是进化途中的痕迹吧-->
        <el-tree :data="data" @node-click="handleNodeClick"></el-tree>
    </div>
</template>
<!-- <template>
    <div class="maptree-pannel" v-show="this.$store.getters._getdefaultMapTreeVisible">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
</template> -->

<script>
import { loadModules } from 'esri-loader';
import config from './config';
// const options = {
//     url: 'https://js.arcgis.com/4.23/',
//     css: 'https://js.arcgis.com/4.23/esri/themes/light/main.css',
// };
import axios from 'axios';
// import qs from 'qs';
export default {
    name: 'MapTree',
    data() {
        return {
            data: [
                {
                    label: '可选图层',
                    children: [
                        {
                            label: '中国地图',
                            layerid: 'layerid', //现实场景可能需要后端读取获得layerid
                            layurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
                            //'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                        },
                        {
                            label: '黑蓝色系图层',
                            layerid: 'layerid', //现实场景可能需要后端读取获得layerid
                            layurl: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
                        },
                    ],
                },
                {
                    label: '行政区划',
                    children: [
                        {
                            label: '省数据',
                            layerid: 'layerid',
                            // 我的数据：第一份编码格式有问题不是按照省级号码进行编码，第二份缺少县级数据
                            // 妈的，纠结这么久。直接用老师发布的服务不就好了
                            // 他的失效了。。。
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/XZQHProvince2_Project/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHProvince_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/2XZQH_Province_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/Province_2020/FeatureServer',
                            // layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Province_2020/FeatureServer',//尽自己可见会出问题
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Province_new/FeatureServer',
                        },
                        {
                            label: '市数据',
                            layerid: 'layerid',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/2XZQH_City_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/City_2020/FeatureServer',
                            // layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/City_2020/FeatureServer',
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/City_new/FeatureServer',
                        },
                        {
                            label: '县数据',
                            layerid: 'layerid',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty2_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty4_WebMokatuo/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/4XZQH_County/FeatureServer',
                            // layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/County/FeatureServer',
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/County_new/FeatureServer',
                        },
                    ],
                },
                {
                    label: '业务数据',
                    children: [
                        {
                            label: '火车站数据',
                            layerid: 'layerid',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/diandianGIS/FeatureServer',
                            // layurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/StationPoint/FeatureServer',
                            // layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/StationGIS/FeatureServer',
                            // layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Station_new/FeatureServer',
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/diandianGIS/FeatureServer',
                        },
                        {
                            label: '卷帘分析 top',
                            layerid: 'swipeLayerTop',
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Province_new/FeatureServer',
                        },
                        {
                            label: '卷帘分析 bottom',
                            layerid: 'swipeLayerBottom',
                            layurl: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/City_new/FeatureServer',
                        },
                        // {
                        //     label: 'GeoJSON:ResData2021-09-12-00-10',
                        //     layerid: 'GeoJSON',
                        //     layurl: 'http://localhost:80/vuegis/static/data/2021-09-12/GeoData2021-09-12-00-10.json',
                        // },
                    ],
                },
            ],
            /*             defaultProps: {
                children: 'children',
                label: 'label',
            }, */
        };
    },
    /*     computed: {
        IsShow() {
            return this.$store.getters._getdefaultMapTreeVisible;
        },
    }, */
    methods: {
        async handleNodeClick(data) {
            console.log(data);

            if (data.layurl) {
                const view = this.$store.getters._getDefaultView;
                // console.log('view', view);
                // console.log('this map', view.map);
                console.log('this map layer', view.map.layers);

                // console.log(view.map);
                // const currentLayer = view.map.findLayerById(data.layerid);
                const currentLayer = view.map.findLayerById('layerid');

                if (currentLayer) {
                    // console.log(currentLayer);
                    view.map.remove(currentLayer);
                }

                /* const [TileLayer] = await loadModules(['esri/layers/TileLayer'], options);
                const layer = new TileLayer({ url: data.layurl, id: data.layerid }); */
                if (data.layerid == 'GeoJSON') {
                    const _self = this;
                    const [GeoJSONLayer] = await loadModules(['esri/layers/GeoJSONLayer'], config.options);
                    // 如果GeoJSON文件与你的网站不在同一个域中，则需要启用CORS的服务器或代理。
                    //可以连接后台获得json数据
                    /*
                    axios
                        .get('http://localhost:3001/mapdata/get', {
                            params: {
                                jsonName: 'ResData2021-09-12-00-10',
                                // jsonName: 'test01',
                            },
                        })
                        .then(function (response) {
                            console.log('response.data', response.data.JSONData);

                            if (response.data.state === 'success') {
                                _self.$message({
                                    message: '读取json成功',
                                    type: 'success',
                                });
                                const blob = new Blob([JSON.stringify(response.data.JSONData)], {
                                    type: 'application/json',
                                });

                                // URL reference to the blob
                                const url = URL.createObjectURL(blob);
                                const geojsonLayer = new GeoJSONLayer({ url: url });
                                view.map.add(geojsonLayer);
                                geojsonLayer.on('update-end', function (e) {
                                    view.map.setExtent(e.target.extent.expand(1.2));
                                });
                            } else {
                                console.log(response.data.msg);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                            _self.$message({
                                message: '读取json失败',
                                type: 'warning',
                            });
                            csl;
                        });*/
                    // const url = 'http://localhost:80/vuegis/static/data/ResData2021-09-12-00-10.json'; //跨域
                    // // const file = './../assets/dataTest.json';
                    // // const file = "./../assets/test01.json";
                    // // 'D:\\code\\GIS\\js-api\\vue-jspapi\\dataProcess\\JSONData\\ResData2021-09-12-00-10.json';
                    // // const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';//为啥他就可以
                    //GeoJSON格式不对v
                    const renderer = {
                        type: 'simple',
                        field: 'mag',
                        symbol: {
                            type: 'simple-marker',
                            color: 'orange',
                            outline: {
                                color: 'white',
                            },
                        },
                        visualVariables: [
                            {
                                type: 'size',
                                field: 'mag',
                                stops: [
                                    {
                                        value: 2.5,
                                        size: '4px',
                                    },
                                    {
                                        value: 8,
                                        size: '40px',
                                    },
                                ],
                            },
                        ],
                    };
                    const url = 'http://localhost:80/vuegis/static/data/2021-09-12/GeoData2021-09-12-00-10.json';
                    const geojsonLayer = new GeoJSONLayer({
                        id: 'GeoJSON',
                        url: url,
                    });
                    view.map.add(geojsonLayer);
                    geojsonLayer.on('update-end', function (e) {
                        view.map.setExtent(e.target.extent.expand(1.2));
                    });
                } else {
                    const [TileLayer, FeatureLayer] = await loadModules(
                        ['esri/layers/TileLayer', 'esri/layers/FeatureLayer'],
                        config.options,
                    );
                    const c = data.layurl.split('/');
                    const serverType = c[c.length - 1];
                    // console.log(serverType);
                    let layer = '';
                    switch (serverType) {
                        case 'MapServer':
                            layer = new TileLayer({ url: data.layurl, id: data.layerid });
                            break;
                        case 'FeatureServer':
                            layer = new FeatureLayer({ url: data.layurl, id: data.layerid });
                            break;
                        default:
                            break;
                    }

                    view.map.add(layer);
                    /*                 // 以下只是为了调整缩放大小
                console.log(config.centerPoints[2]['HanZhong']);
                view.center = config.centerPoints[2]['HanZhong']; //[107.03194, 33.06784];
                view.zoom = 4; */
                    // console.log(typeof config);
                    // console.log(typeof config.centerPoints);
                    // console.log(typeof config.centerPoints[2]);
                    /*                 centerPoint = config.centerPoints.forEach((element) => {
                    console.log(element);
                    if (element.addrName == 'Wuhan') {
                        return element.address;
                    }
                }); */
                    // console.log(centerPoint);

                    // view.scale = 200;
                    // console.log(view.spatialReference);
                    /*                 let pt = new Point({
                    x: config.centerPoint.longitude,
                    y: config.centerPoint.longitude,
                    spatialReference: {
                        wkid: view.spatialReference,
                    },
                });
                console.log(pt); */

                    /*  view.goTo({
                    center: [
                        featuresResult.geometry.extent.center.longitude,
                        featuresResult.geometry.extent.center.latitude,
                    ],
                    zoom: 8, //缩放程度设为8级
                }); */
                }
            }
        },
        closeMapTreePannel() {
            const currentVisible = this.$store.getters._getDefaultMapTreeVisible;
            this.$store.commit('_setDefaultMapTreeVisible', !currentVisible);

            //恢复大小  不行的，怎么按需裁撤图层？？？这种API加载进来的
            // if (data.layer) {
            //     const view = this.$store.getters._getDefaultView;
            //     const currentLayer = view.map.findLayerById('layerid');

            //     if (currentLayer) {
            //         // console.log(currentLayer);
            //         view.map.remove(currentLayer);
            //         view.center = config.centerPoints[0]['LongHai']; //[117.81813, 24.44658]
            //         view.zoom = 10;
            //     }
            // }
        },
    },
    components: {},
    mounted: function () {},
};
</script>

<style>
.maptree-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 200px;
    height: 300px;
    background-color: white;
}
.maptree-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.maptree-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.maptree-header > i {
    line-height: 35px;
    cursor: pointer;
}
</style>
