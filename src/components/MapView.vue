<template>
    <div class="mapview-pannel">
        <div id="mapview"></div>
        <div id="basemapToggle"></div>
        <div id="scalebar"></div>
        <div id="zoom"></div>
        <!-- <div class="view-change" @click="handleViewChange"> -->
        <div id="viewChange" @click="handleViewChange">
            <span>{{ viewModel }}</span>
        </div>
        <!-- <div class="view-home" id="viewHome"></div> -->
        <div id="viewHome"></div>
        <div id="particleSwitch">
            <el-tooltip :content="'粒子动画'" placement="top">
                <el-switch
                    v-model="ParticleSwitch"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value="打开"
                    inactive-value="关闭"
                    @change='particleChange'
                >
                </el-switch>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';
// import ael from './../utils/animatedEnvironmentLayer'
export default {
    name: 'MapView',
    data() {
        return {
            viewModel: '3D',
            ParticleSwitch: false,
            environmentLayer:null,
            dataOptions:[]


        };
    },
    computed: {
        DateTime(){
            return  this.$store.getters._getTimeSelected;
        },
        DataType(){
            return  this.$store.getters._getParticleDataType;
        },

    },
    component: {},
    mounted: function () {
        // console.log(this.$store.state._defaultView);  取值
        this._createMapView();
    },

    methods: {
        particleChange(){
            console.log('this.DataType:',this.DataType,'this.DateTime:',this.DateTime)
            if(this.DataType && this.DateTime){
                //传递值给粒子动画  换句话说，这里应该传值给pageSet组件，但把这个传过去又传回来，略显奇怪
                //这里其实改变的就是数据源（url）就可以了
                var displayOptionsTemp={
                    maxVelocity: 4.5,//5.2
                    lineWidth: 5,
                    particleAge: 150,//30
                    // maxVelocity: 6,
                    velocityScale: 0.01,
                    frameRate: 10,
                    // lineWidth: 5,//为啥失效了
                    // particleDensity: [{ zoom: 2, density: 10 }, { zoom: 4, density: 9 }, { zoom: 8, density: 6 }, { zoom: 10, density: 4 }, { zoom: 12, density: 3 }],
                    customFadeFunction: this.customFadeFunction,
                    // customDrawFunction: this.customDrawFunction // a custom draw function
                }
                this.environmentLayer = new ael.AnimatedEnvironmentLayer({
                    id: "ael-layer",
                    url: "./data/wave/20210806_0010.json",//this.dataOptions[0].url,
                    displayOptions:displayOptionsTemp//this.dataOptions[0].displayOptions
                });
                this.map.add(this.environmentLayer);
                console.log('0429怎么产生子组件？其实这里也可以之间添加层，（就只需要引入js文件，照着setup整流程就可以了）')
            
            }
            console.log('但是你说的自定义样式组件，这个咋搞，要不把层和粒子动画分开，就说层+customFunctuion是各组件？？？')
            // 反正自定义组件也不可能完全不写代码，只是前端不可能传入代码。
            //就是这块功能单一应该就可以了
            console.log('或者想想办法，把前端加个样式控制控件（除了常见参数，还可以设置海浪前进后退比），但是那个线条宽度倒是可以选择：恒定、随测量值大小递增、递减，起点也可以选择，但是你说说这个总是提到的自定义函数怎么拆分？')
              
        },
        async _createMapView() {
            // 妈的获得的是div的id，因为scaleBar中的B搞了半天
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scalebar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom, Home] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                    'esri/widgets/Zoom',
                    'esri/widgets/Home'
                ],
                config.options
            );
            // let basemap = new Basemap({
            //     baseLayers: [
            //         new TileLayer({
            //             url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
            //             // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', //黑蓝配色
            //             title: 'Basemap',
            //         }),
            //     ],
            //     title: 'basemap',
            //     id: 'basemap',
            // });
            var darkgray = Basemap.fromId('dark-gray');
            // let basemap = new Basemap({
            //     darkgray
            //     /*0420  baseLayers: [
            //         new TileLayer({
            //             url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer',
            //             // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
            //             // url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', //黑蓝配色
            //             title: 'Basemap'
            //         })
            //     ],
            //     title: 'basemap',
            //     // thumbnailUrl: `static/basemap1.png`,
            //     thumbnailUrl: `static/darkGray.png`,
            //     id: 'basemap'
            // });
            // let basemap2 = new Basemap({
            //     baseLayers: [
            //         new TileLayer({
            //             url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
            //             title: 'Basemap2'
            //         })
            //     ],
            //     thumbnailUrl: `static/basemap2.png`,
            //     title: 'basemap',
            //     id: 'basemap' */
            // });
            const map = new Map({
                basemap: darkgray
                // basemap
                // basemap: 'topo-vector',
            });
            const mapView = new MapView({
                container: 'mapview',
                map: map,
                zoom: 8, //9, //8,
                center: [118.76, 23.4] // [119.5, 24] // [117.81813, 24.44658]
            });
            //实例化底图并实现两张底图的切换
            // this.basemapToggle = new BasemapToggle({
            //     view: mapView, // The view that provides access to the map's "streets-vector" basemap
            //     nextBasemap: 'hybrid', // Allows for toggling to the "hybrid" basemap
            //     container: 'basemapToggle', //id=basemapToggle的那个div
            // });
            // mapView.ui.add(this.basemapToggle); //与底部样式一起实现地图切换控件自定义位置
            /* 0420 this.basemapToggle = new BasemapToggle({
                view: mapView, // The view that provides access to the map's "streets-vector" basemap
                nextBasemap: basemap2, // 下一次底图
                // nextBasemap: a,
                container: 'basemapToggle', //id=basemapToggle的那个div
                visible: true
            });
 */
            // this.basemapToggle.visibleElements = {
            //     title: true,
            // };
            mapView.ui.add(this.basemapToggle); //与底部样式一起实现地图切换控件自定义位置
            /*             mapView.ui.add(basemapToggle, {
                position: 'bottom-right',
            }); */
            //添加比例尺
            this.scaleBar = new ScaleBar({
                view: mapView,
                unit: 'metric',
                container: 'scalebar'
            });
            mapView.ui.add(this.scaleBar);
            //添加缩放控件
            this.zoom = new Zoom({
                view: mapView,
                container: 'zoom'
            });
            mapView.ui.add(this.zoom);
            mapView.ui.add(
                new Home({
                    view: mapView,
                    container: 'viewHome'
                })
            );

            // console.log('before []', mapView.ui.components);
            mapView.ui.components = []; //去掉左上角的缩放图标(地图自带的，没办法设置格式和位置)
            this.$store.commit('_setDefaultView', mapView); //设置默认地图
        },
        async _createSceneView() {
            document.getElementById('basemapToggle').innerHTML = '';
            document.getElementById('scalebar').innerHTML = '';
            document.getElementById('zoom').innerHTML = '';
            const [Map, SceneView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom, Home] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/SceneView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                    'esri/widgets/Zoom',
                    'esri/widgets/Home'
                ],
                config.options
            );
            let basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer',
                        title: 'Basemap'
                    })
                ],
                title: 'basemap',
                id: 'basemap'
            });

            const map = new Map({
                basemap: basemap
            });
            const referenceScale = this.$store.getters._getReferenceScale;
            //_createSceneView和_createMapView的唯一区别： new SceneView(实例化三维) 和new MapView（实例化二维）

            const sceneView = new SceneView({
                container: 'mapview',
                map: map,
                scale: referenceScale * 4
            });
            sceneView.ui.components = []; //去掉左上角的缩放图标

            let basemap2 = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                        title: 'Basemap2'
                    })
                ],
                thumbnailUrl: `static/basemap2.png`,
                title: 'basemap',
                id: 'basemap'
            });
            this.basemapToggle = new BasemapToggle({
                view: sceneView, // The view that provides access to the map's "streets-vector" basemap
                nextBasemap: basemap2, // 下一次底图
                // nextBasemap: a,
                container: 'basemapToggle', //id=basemapToggle的那个div
                visible: true
            });
            sceneView.ui.add(this.basemapToggle);
            //添加比例尺
            this.scaleBar = new ScaleBar({
                view: sceneView,
                unit: 'metric',
                container: 'scalebar'
            });
            sceneView.ui.add(this.scaleBar);
            //添加缩放控件
            this.zoom = new Zoom({
                view: sceneView,
                container: 'zoom',
                zoomFactor: 1 // set the zoom factor to 1.5 0412控制缩小步伐
            });
            sceneView.ui.add(this.zoom);
            sceneView.ui.add(
                new Home({
                    view: sceneView,
                    container: 'viewHome'
                })
            );
            sceneView.ui.components = []; //去掉左上角的缩放图标(地图自带的，没办法设置格式和位置)
            setTimeout(() => {
                sceneView.goTo({
                    zoom: 6,
                    center: [117.81813, 24.44658]
                });
            }, 2000);

            this.$store.commit('_setDefaultView', sceneView); //设置默认地图
        },
        //二三维切换
        handleViewChange() {
            if (this.viewModel === '3D') {
                //viewModel中存着下一次的地图视角
                this._createSceneView();
                this.viewModel = '2D';
            } else {
                this._createMapView();
                this.viewModel = '3D';
            }
        }
    }
};
</script>

<style>
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
#viewChange {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 20px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
#viewChange span {
    line-height: 32px;
    /* line-height: 40px; */
}

#viewHome {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 20px;
    bottom: 220px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
#particleSwitch {
    position: absolute;
    right: 20px;
    bottom: 260px;
    width: 32px;

    cursor: pointer;
    text-align: center;
}

.el-switch {
    width: 32px;
}
.view-change {
    position: absolute;
    /*     width: 32px;
    height: 32px; */
    width: 40px;
    height: 40px;
    /* right: 15px; */
    right: 90px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-home {
    position: absolute;
    /* width: 32px;
    height: 32px; */
    width: 40px;
    height: 40px;
    right: 200px;
    /* 15px; */
    bottom: 220px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-change span {
    /* line-height: 32px; */
    line-height: 40px;
}
.particle-switch {
    position: absolute;
    right: 20px;
    bottom: 260px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    text-align: center;
}
</style>
