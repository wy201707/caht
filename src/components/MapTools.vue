<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMapToolsitemClick" id="distance"
            >测距
            <i class="el-icon-ceju_0"></i>
            <!-- <i class="el-icon-location"></i> -->
        </span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="area"
            >测面积
            <!-- <i class="el-icon-files"></i> -->
            <!-- <i class="el-icon-my-area"></i> -->
            <i class="el-icon-shitucemianji"></i>
        </span>
        <!-- <span class="maptools-item" @click="handleMapToolsitemClick" id="latlon"
            >经纬度
            <i class="el-icon-coordinate"></i>
        </span> -->
        <span class="maptools-item" @click="handleMapToolsitemClick" id="print"
            >地图打印
            <i class="el-icon-reading"></i>
        </span>
        <!-- <span class="maptools-item" @click="handleMapToolsitemClick" id="xzqh"
        >行政区划
        </span>
        <span class="maptools-item" @click="handleMapToolsitemClick" id="maptree"
            >图层
            <i class="el-icon-files"></i>
        </span> -->
        <!-- <span class="maptools-item" @click="handleMapToolsitemClick" id="timeBar">动画展示</span> -->
        <!-- <span class="maptools-item" @click="handleMapToolsitemClick" id="timeInfo">动画展示</span> -->
        <!-- <el-dropdown trigger="click" class="maptools-item" @command="MyhandleCommand">
            <span class="el-dropdown-link">信息展示<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="showRardaData">单场</el-dropdown-item>
                <el-dropdown-item icon="el-icon-monitor" command="Animation">动画</el-dropdown-item>
                 <i class="el-icon-monitor"></i>
                <el-dropdown-item icon="el-icon-plus" command="XXXXX"></el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="XXXXX"></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
        <!-- 0416
            <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="area">面积测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-plus" command="MyDistance">自定义距离测量</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus" command="MyArea">自定义面积测量</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->

        <!-- <el-dropdown trigger="click" class="maptools-item" @command="handleCommand">
            <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-search" command="spacequery">空间查询</el-dropdown-item>
                <el-dropdown-item icon="el-icon-film" command="morescreen">多屏对比</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="swipanalyst">卷帘分析</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="printmap">地图打印</el-dropdown-item>
                <el-dropdown-item icon="el-icon-reading" command="openPonitPopup">打开所有点的弹窗</el-dropdown-item>①
                <el-dropdown-item icon="el-icon-reading" command="openPopup">打开自定义弹窗</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
        <span class="maptools-item" @click="handleClearMap" id="clear">清屏<i class="el-icon-delete"></i></span>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';
export default {
    name: 'MapTools',
    methods: {
        goMapTree() {
            const currentVisible = this.$store.getters._getDefaultMapTreeVisible;
            console.log('getMaptree=', currentVisible);
            this.$store.commit('_setDefaultMapTreeVisible', !currentVisible);
        },
        /*  goXZQH() {
            const curVisible = this.$store.getters._getDefaultXZQHVisible;
            console.log('goXZQH=', curVisible);
            this.$store.commit('_setDefaultXZQHVisible', !curVisible);
        }, */
        // goTimeBar() {
        //     const curVisible = this.$store.getters._getDefaultTimeBarVisible;
        //     console.log('goTimeBar', curVisible);
        //     this.$store.commit('_setDefaultTimeBarVisible', !curVisible);
        // },
        goTimeInfo() {
            const curVisible = this.$store.getters._getDefaultTimeInfoVisible;
            console.log('goTimeInfo', curVisible);
            this.$store.commit('_setDefaultTimeInfoVisible', !curVisible);
        },
        handleClearMap() {
            const view = this.$store.getters._getDefaultView;
            const resultLayer1 = view.map.findLayerById('swipeLayerTop');
            const resultLayer2 = view.map.findLayerById('swipeLayerBottom');
            const resultLayer3 = view.map.findLayerById('layerid');
            const resultLayer4 = view.map.findLayerById('polygonGraphicLayer');
            /*  const resultLayerXZQH = view.map.findLayerById('XZQHGraphicLayer'); //id: 'XZQHGraphicLayer', */
            const resultLayerDIY = view.map.findLayerById('measurementGraphicLayer');
            //GeoJSON
            const resultLayerRadarData = view.map.findLayerById('GeoJSON');
            /*            if (resultLayerXZQH) {
                view.graphics.remove(resultLayerXZQH);
            } */
            if (resultLayerRadarData) view.map.remove(resultLayerRadarData);

            if (this.measurementWidget) this.measurementWidget.destroy();
            if (resultLayer4) view.map.remove(resultLayer4);
            if (resultLayer1) view.map.remove(resultLayer1);
            if (resultLayer2) view.map.remove(resultLayer2);
            if (resultLayer3) view.map.remove(resultLayer3);
            if (resultLayerDIY) view.map.remove(resultLayerDIY);
            if (this.swipe) this.swipe.destroy();
            if (this.measurementWidget) this.measurementWidget.destroy();
        },
        async initLatLon() {
            const [webMercatorUtils] = await loadModules(['esri/geometry/support/webMercatorUtils'], config.options);

            const view = this.$store.getters._getDefaultView;
            const _self = this;
            // When user clicks on the map, show the coordinates in the console
            view.on('click', function (event) {
                var point = webMercatorUtils.webMercatorToGeographic(event.mapPoint);
                console.log('Longitude: ', point.x.toFixed(3), 'Latitude: ', point.y.toFixed(3));
                // _self.$message({
                //     message: '经度：' + point.x.toFixed(3) + '°，纬度：' + point.y.toFixed(3),
                //     type: 'success'
                // });
            });
            // });
        },
        handleMapToolsitemClick(e) {
            console.log('maptools:e=', e.target.id);
            switch (e.target.id) {
                /*   case 'xzqh':
                    // console.log('xzdh');
                    this.goXZQH();
                    break; */
                case 'maptree':
                    this.goMapTree();
                    break;
                // case 'timeBar':
                //     this.goTimeBar();
                //     break;
                // case 'timeInfo':
                //     this.goTimeInfo();
                //     break;
                case 'distance':
                    this.initDIYmeasure('distance');
                    break;
                case 'area':
                    this.initDIYmeasure('area');
                    break;
                case 'latlon':
                    //BUG 这里还没写
                    this.initLatLon();
                    break;
                case 'print':
                    this.PrintMap();
                    break;
                case 'clear':
                    this.handleClearMap();
                    break;
                default:
                    break;
            }
        },
        async initSwipe() {
            //卷帘分析
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            const [Swipe] = await loadModules(['esri/widgets/Swipe'], config.options);
            const topLayer = view.map.findLayerById('swipeLayerTop');
            const bottomLayer = view.map.findLayerById('swipeLayerBottom');
            if (topLayer && bottomLayer) {
                _self.swipe = new Swipe({
                    leadingLayers: [topLayer],
                    trailingLayers: [bottomLayer],
                    position: 35,
                    view: view
                });
                view.ui.add(_self.swipe);
            } else {
                _self.$message({
                    message: '请至少添加两层业务图层',
                    type: 'warning'
                });
            }
        },
        async PrintMap() {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            const [PrintTask, PrintParameters, PrintTemplate] = await loadModules(
                ['esri/tasks/PrintTask', 'esri/tasks/support/PrintParameters', 'esri/tasks/support/PrintTemplate'],
                config.options
            );
            let printTask = new PrintTask({
                url: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
                // url: 'https://services7.arcgis.com/BUin0xjr55RjybAu/arcgis/rest/services/Province_new/FeatureServer',
            });

            let template = new PrintTemplate({
                format: 'pdf',
                exportOptions: {
                    dpi: 300 //与渲染精度有关
                },
                layout: 'a4-portrait',
                layoutOptions: {
                    titleText: '打印地图',
                    authorText: 'wy',
                    customTextElements: [{ location: '湖北省 武汉' }, { date: '01/06/2022, 21:20:20 AM' }]
                }
            });

            let params = new PrintParameters({
                view: view,
                template: template
            });

            printTask.execute(params).then((printResult, printError) => {
                console.log(printResult, printError);
                if (printResult.url) window.open(printResult.url);
                if (printError) this.$message.error('地图打印失败');
            });
        },
        async initDistanceMap() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [DistanceMeasurement2D] = await loadModules(['esri/widgets/DistanceMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new DistanceMeasurement2D({
                view: view
            });
            view.ui.add(this.measurementWidget, 'bottom-left');
        },
        async initAreaMap() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [AreaMeasurement2D] = await loadModules(['esri/widgets/AreaMeasurement2D'], config.options);
            if (this.measurementWidget) this.measurementWidget.destroy();
            this.measurementWidget = new AreaMeasurement2D({
                view: view
            });
            view.ui.add(this.measurementWidget, 'top-left');
        },
        async initDIYmeasure(type) {
            // 分两步：画图形（不区分area面、distance线）、计算（判断type）
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('measurementGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);
            const [
                SketchViewModel,
                Graphic,
                GraphicsLayer,
                GeometryService,
                LengthsParameters,
                AreasAndLengthsParameters
            ] = await loadModules(
                [
                    'esri/widgets/Sketch/SketchViewModel',
                    'esri/Graphic',
                    'esri/layers/GraphicsLayer',
                    'esri/tasks/GeometryService',
                    'esri/tasks/support/LengthsParameters',
                    'esri/tasks/support/AreasAndLengthsParameters'
                ],
                config.options
            );
            // 1.画图形：一个空层
            const graphicsLayer = new GraphicsLayer({
                id: 'measurementGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground'
                }
            });
            view.map.add(graphicsLayer);

            //1.画自定义图形添加到图层 + 2.计算参数
            if (type === 'distance') {
                const polylineSymbol = {
                    type: 'simple-line',
                    color: '#d81e06',
                    width: '2',
                    style: 'solid'
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view: view,
                    layer: graphicsLayer,
                    polylineSymbol: polylineSymbol
                });
                sketchViewModel.create('polyline'); //绘制线

                // 绘制完成后将线添加到刚才建好的面layer上
                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol
                    });
                    graphicsLayer.add(graphic);
                });
                //计算绘制图形的参数
                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        // console.log('graphicsLayer:', graphicsLayer);
                        // console.log('event', event);
                        // 获取线段长度
                        const geometryService = new GeometryService({
                            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
                        });
                        const lengthsParameters = new LengthsParameters();
                        lengthsParameters.polylines = event.graphic.geometry; //要计算其长度的折线数组。
                        lengthsParameters.lengthUnit = 9036; //长度单位:km的代码，m：9001
                        lengthsParameters.geodesic = true;
                        //线段位于地理坐标系（三维情况按照椭球体距离计算，二维无所谓，就是平面上计算直线距离）：true
                        geometryService.lengths(lengthsParameters).then(function (result) {
                            console.log('长度', result); //BUG 0416这里加图层

                            _self.$message({
                                message: '测量距离为' + result.lengths[0].toFixed(3) + '千米',
                                type: 'success'
                            });
                        });
                    }
                });
            } else if (type === 'area') {
                const polygonSymbol = {
                    type: 'simple-fill',
                    color: 'rgba(216,30,6,0.4)',
                    style: 'solid',
                    outline: {
                        color: '#d81e06',
                        width: 1
                    }
                };
                const sketchViewModel = new SketchViewModel({
                    updateOnGraphicClick: false,
                    view,
                    layer: graphicsLayer,
                    polygonSymbol
                });
                sketchViewModel.create('polygon');

                sketchViewModel.on('create-complete', function (event) {
                    const graphic = new Graphic({
                        geometry: event.geometry,
                        symbol: sketchViewModel.graphic.symbol
                    });
                    graphicsLayer.add(graphic);
                });

                sketchViewModel.on('create', function (event) {
                    if (event.state === 'complete') {
                        // console.log(graphicsLayer);
                        // console.log(event);
                        const geometryService = new GeometryService({
                            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
                        });
                        const areasAndLengthsParameters = new AreasAndLengthsParameters();
                        areasAndLengthsParameters.polygons = event.graphic.geometry;
                        areasAndLengthsParameters.areaUnit = 'square-kilometers';
                        areasAndLengthsParameters.lengthUnit = 'kilometers';

                        geometryService.areasAndLengths(areasAndLengthsParameters).then(function (result) {
                            console.log('周长和面积', result);
                            _self.$message({
                                message: '面积为' + result.areas[0].toFixed(3) + '平方千米',
                                type: 'success'
                            });
                        });
                    }
                });
            }
        },
        openMapPopup() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;

            const resultLayer = view.map.findLayerById('layerid');
            if (resultLayer) {
                view.on('click', function (event) {
                    view.hitTest(event).then(function (response) {
                        console.log('1', response);
                        //所有添加在地图上的图层都会继承这个动作，所以需要选择图层
                        let graphic = [];
                        if (response.results.length) {
                            graphic = response.results.filter(function (result) {
                                return result.graphic.layer.id === 'layerid';
                                //实际项目中每个图层的layderid都是指定的/有命名规则的，不全是‘layerid:layerid’
                            })[0].graphic;
                        }
                        console.log(graphic.attributes); //筛选图层的属性数据信息
                        //之后的操作：
                        //queryTask进行查询得到该图层选定元素的全部信息:完整sql（where+属性信息）
                        //div+前端弹窗
                    });
                });
            } else {
                _self.$message({
                    message: '请添加业务图层',
                    type: 'warning'
                });
            }
        },
        /*①
        openPointJSONPopup() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;

            const resultLayer = view.map.findLayerById('GeoJSON');

            if (resultLayer) {
                const queryParams = resultLayer.createQuery();
                // queryParams.geometry = extentForRegionOfInterest;改  queryPoint.geometry = graphic.geometry; //赋值操作，query与业务图层绑定
                queryParams.where = queryParams.where;
                // + " AND TYPE = 'Extreme'";

                // query the layer with the modified params object
                resultLayer.queryFeatures(queryParams).then(function (results) {
                    // prints the array of result graphics to the console
                    console.log(results.features);
                });
                // ////view.on('click', function (event) {
                //     view.hitTest(event).then(function (response) {
                //         console.log('1', response);
                //         //所有添加在地图上的图层都会继承这个动作，所以需要选择图层
                //         let graphic = [];
                //         if (response.results.length) {
                //             graphic = response.results.filter(function (result) {
                //                 return result.graphic.layer.id === 'GeoJSON';
                //                 //实际项目中每个图层的layderid都是指定的/有命名规则的，不全是‘layerid:layerid’
                //             })[0].graphic;
                //         }
                //         console.log(graphic.attributes); //筛选图层的属性数据信息
                //         //之后的操作：
                //         //queryTask进行查询得到该图层选定元素的全部信息:完整sql（where+属性信息）
                //         //div+前端弹窗
                //     });
                // ////});
            } else {
                _self.$message({
                    message: '请添加业务图层',
                    type: 'warning',
                });
            }
        },
*/
        MyhandleCommand(command) {
            switch (command) {
                case 'showRardaData':
                    this.initRadarData();
                    break;
                case 'Animation':
                    this.goTimeInfo();
                    break;
                case 'area':
                    this.initAreaMap();
                    break;
                case 'MyArea':
                    this.initDIYmeasure('area');
                    break;
                case 'printmap':
                    this.PrintMap();
                    break;
                // case 'openPonitPopup':
                //     this.openPointJSONPopup();
                //     break;//①
                case 'openPopup':
                    this.openMapPopup(); //这里

                    break;
                default:
                    break;
            }
        },

        initRadarData() {
            // 其实这里应该用父子组件通信  10.06
            const curVisible = this.$store.getters._getDefaultOneRadarVisible;
            this.$store.commit('_setDefaultOneRadarVisible', !curVisible);
            console.log('one radar', curVisible);
        },
        //! 0904
        /*
        async initRadarData() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [GeoJSONLayer] = await loadModules(['esri/layers/GeoJSONLayer'], config.options);
            /////const renderer = {
                type: 'simple',
                field: 'WaveHs',
                symbol: {
                    type: 'simple-marker',
                    color: 'orange',
                    outline: {
                        color: 'white',
                    },
                },
                visualVariables: [
                    {
                        type: 'size', //color (浪高数值越大，颜色越红)
                        field: 'WaveHs',
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
            };////注释掉的

            const referenceScale = 9244650;

            const renderer = {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    // Arrow marker
                    path: 'M14.5,29 23.5,0 14.5,9 5.5,0z', // The SVG path of the icon.
                    color: [250, 250, 250],
                    outline: {
                        color: [255, 255, 255, 0.5],
                        width: 0.5,
                    },
                    angle: 180,
                    size: 15,
                },
                visualVariables: [
                    {
                        type: 'rotation',
                        field: 'WindDir',
                        rotationType: 'geographic', //这估计要改
                    },
                    /////  {
                        type: 'size',
                        field: 'WindVelocity',
                        minDataValue: 0,
                        // maxDataValue: 35,
                        minSize: {
                            type: 'size',
                            valueExpression: view.scale,
                            // adjust the min size by scale
                            stops: [
                                { value: referenceScale, size: 8 },
                                { value: referenceScale * 2, size: 6 },
                                { value: referenceScale * 4, size: 4 },
                                { value: referenceScale * 8, size: 2 },
                            ],
                        },
                        maxSize: {
                            type: 'size',
                            valueExpression: view.scale,
                            // adjust the max size by scale
                            stops: [
                                { value: referenceScale, size: 40 },
                                { value: referenceScale * 2, size: 30 },
                                { value: referenceScale * 4, size: 20 },
                                { value: referenceScale * 8, size: 10 },
                            ],
                        },
                    },/////
                    // {
                    //     type: 'color',
                    //     field:'WaveHs',
                    //     stops: [
                    //         { value: 0.1, color: '#2b83ba' },
                    //         { value: 0.5, color: '#abdda4' },
                    //         { value: 1.25, color: '#ffffbf' },
                    //         { value: 2.5, color: '#fdae61' },
                    //         { value: 4, color: '#d7191c' },
                    //         { value: 14, color: '#ffffff' },
                    //     ],
                    // },
                    {
                        type: 'color',
                        field: 'WindVelocity',
                        stops: [
                            { value: 1.6, color: '#2b83ba' },
                            { value: 5.5, color: '#abdda4' },
                            { value: 8.0, color: '#ffffbf' },
                            { value: 13.9, color: '#fdae61' },
                            { value: 20.8, color: '#d7191c' },
                            { value: 30, color: '#ffffff' },
                        ],
                    },
                ],
            };

            /////  const template = {
                title: 'Earthquake Info',
                content: 'Magnitude {mag} {type} hit {place} on {time}',
                // fieldInfos: [
                //     {
                //         fieldName: 'time',
                //         format: {
                //             dateFormat: 'short-date-short-time',
                //         },
                //     },
                // ],
            }; ////
            let template = {
                title: '{coordinates}详细信息',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'WaveHs',
                                label: '浪高',
                            },
                            {
                                fieldName: 'WaveDir',
                                label: '浪向',
                            },
                            {
                                fieldName: 'WaveCredit',
                                label: '置信度',
                            },
                            {
                                fieldName: 'WindVelocity',
                                label: '风速',
                            },
                            {
                                fieldName: 'WindDir',
                                label: '风向',
                            },
                            // {
                            //     fieldName: 'WindDir',
                            //     label: '风向',
                            // },
                            {
                                fieldName: 'WindFetch',
                                label: '风区',
                            },
                            {
                                fieldName: 'Current',
                                label: '流速',
                            },
                            {
                                fieldName: 'CurDirection',
                                label: '流向',
                            },
                            {
                                fieldName: 'CurCredit',
                                label: '置信度（流）',
                            },
                        ],
                    },
                ],
            };
            const url = 'http://localhost:80/vuegis/static/data/2021-09-12/GeoData2021-09-12-00-10.json';
            const geojsonLayer = new GeoJSONLayer({
                id: 'GeoJSON',
                url: url,
                popupTemplate: template,
                renderer: renderer,
            });
            view.map.add(geojsonLayer);
            geojsonLayer.on('update-end', function (e) {
                view.map.setExtent(e.target.extent.expand(1.2));
            });
        },
        */
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    this.initDistanceMap();
                    break;
                case 'area':
                    this.initAreaMap();
                    break;
                case 'MyArea':
                    this.initDIYmeasure('area');
                    break;
                case 'MyDistance':
                    this.initDIYmeasure('distance');
                    break;
                case 'spacequery':
                    this.initSpaceQuery();
                    break;
                case 'morescreen':
                    this.$router.push('/onemap/one');
                    break;
                case 'swipanalyst':
                    this.initSwipe();
                    break;
                case 'printmap':
                    this.PrintMap();
                    break;
                // case 'openPonitPopup':
                //     this.openPointJSONPopup();
                //     break;//①
                case 'openPopup':
                    this.openMapPopup(); //这里

                    break;
                default:
                    break;
            }
        },
        async initSpaceQuery() {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            // 1.绘制面状区域
            const [SketchViewModel, Graphic, GraphicsLayer] = await loadModules(
                ['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic', 'esri/layers/GraphicsLayer'],
                config.options
            );
            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);
            //1.1定义空的graphicsLayer，储存后续画出来的图形
            const graphicsLayer = new GraphicsLayer({
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground'
                }
            });
            view.map.add(graphicsLayer);
            // 1.2定义样式
            const polygonSymbol = {
                type: 'simple-fill',
                color: 'rgba(216,30,6, 0.4)',
                style: 'solid',
                outline: {
                    color: '#d81e06',
                    width: 1
                }
            };
            // 1.3定义sketchViewModel
            //widget中的sketch组件没办法改动工具栏控件，也没办法监听绘制完成的动作（这样绘制完成后无法取得绘制图形的graphic）。
            //所以采用sketchViewModel（sketch的底层），相当于亲自写底层以自定义sketch

            var sketchViewModel = new SketchViewModel({
                updateOnGraphicClick: false,
                view,
                layer: graphicsLayer,
                polygonSymbol //1.3将样式传入
            });
            // 1.4 sketchViewModel指定绘制图形类型
            sketchViewModel.create('polygon');

            //1.5监听
            //! create-complete方法监听到的事件中，只能调用API相关函数，无法书写自己的代码逻辑（自然无法调用自定义函数和console.log等调试代码）
            sketchViewModel.on('create-complete', function (event) {
                //1.6 graphic添加到graphicsLayer
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: sketchViewModel.graphic.symbol
                });
                graphicsLayer.add(graphic);
            });
            // ! 'create' 开发人员可以用
            sketchViewModel.on('create', function (event) {
                if (event.state === 'complete') {
                    // console.log('graphicsLayer', graphicsLayer);
                    // console.log('event', event);
                    //2、执行空间查询
                    _self.handleSpaceQuery(event.graphic);
                }
            });
        },
        handleSpaceQuery(graphic) {
            const _self = this;
            const view = _self.$store.getters._getDefaultView;
            const resultLayer = view.map.findLayerById('layerid');
            //空间查询功能需要和业务图层绑定。第一步查询有没有业务图层（不是还得检查以下是不是业务图层嘛？）
            if (!resultLayer) {
                _self.$message({
                    message: '尚未添加业务图层，不能进行空间查询',
                    type: 'warning'
                });
                return;
            }
            const queryPoint = resultLayer.createQuery(); //实例化query
            /***&*/ queryPoint.geometry = graphic.geometry; //赋值操作，query与业务图层绑定
            resultLayer
                .queryFeatures(queryPoint)
                .then(function (results) {
                    let currentData = [];
                    /***&*/ if (results.features.length > 0) {
                        // 符号化渲染、实例化弹窗
                        _self.renderResultLayer(results.features);
                        // 符号化渲染的同时，对查询结果使用表格进行展示
                        // console.log('renderResultLayer之后，_self=', _self); //不是什么promise中的this指针调用问题
                        /***&*/ results.features.map((item, index) => {
                            currentData.push({
                                name: item.attributes.name,
                                type: item.attributes.sType,
                                tieluju: item.attributes.tieluju,
                                address: item.attributes.address,
                                lon: item.attributes.lon,
                                lat: item.attributes.lat,
                                key: index
                            });
                        });
                        /***&*/
                    } else {
                        currentData.length = 0;
                    }

                    _self.$message({
                        message: `查询成功，共查到 ${results.features.length} 条数据`,
                        type: 'success'
                    });
                    _self.$store.commit('_setDefaultQueryResult', currentData);
                    /***&*/ _self.$store.commit('_setDefaultQueryResultVisible', true);
                })
                .catch(function (error) {
                    console.log(error);
                    _self.$message.error('空间查询失败，请联系管理员');
                });
            /* 补充：考点Promise的执行顺序，当前脚本调用了Promise.then()，是当前脚本全部执行完，才执行.then中的语句
            console.log(_self);
            console.log(this.$store.getters._getDefaultQueryResultVisible);
            console.log(this.$store.getters._getDefaultQueryResult); */
        },
        async renderResultLayer(resultFeatures) {
            const view = this.$store.getters._getDefaultView;
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], config.options);
            // 好家伙，竟然是这个卡住了：loadModules(['esri/layers/FeatureLayer'], config.options);第一项参数必须加[]！！！!!!
            const resultLayer = view.map.findLayerById('initResultLayer');
            if (resultLayer) {
                console.log('有过图层');
                view.map.remove(resultLayer);
            } else {
                console.log('没有图层');
            }

            /***&*/ const resultData = this._translateLonLat(resultFeatures); //转换函数，将查询返回的数据变成自己定义的数据格式           //拼接source所需字符串
            //实例化弹窗
            let template = {
                title: '{name}-{tieluju}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '名称'
                            },
                            {
                                fieldName: 'type',
                                label: '类型'
                            },
                            {
                                fieldName: 'tieluju',
                                label: '铁路局'
                            },
                            {
                                fieldName: 'address',
                                label: '地址'
                            }
                        ]
                    }
                ]
            };
            /***&*/ const queryResultLayer = new FeatureLayer({
                source: resultData,
                id: 'initResultLayer',
                objectIdField: 'ObjectID',
                renderer: {
                    type: 'simple', //内置
                    symbol: {
                        type: 'picture-marker', //使用图片渲染
                        url: `static/icon/train.jpg`,
                        // 原来static文件夹要放在public文件夹下
                        width: '32px',
                        height: '32px'
                    }
                },
                fields: [
                    {
                        name: 'OBJECTID',
                        type: 'oid'
                    },
                    {
                        name: 'name',
                        type: 'string'
                    },
                    {
                        name: 'type',
                        type: 'string'
                    },
                    {
                        name: 'tieluju',
                        type: 'string'
                    },
                    {
                        name: 'address',
                        type: 'string'
                    }
                ],
                popupTemplate: template
            });

            /***&*/ view.map.add(queryResultLayer);
            /***&*/ console.log('现在在renderResultLayer最后一行');
        },

        _translateLonLat(data) {
            // console.log('_translateLonLa,data', data);
            const _self = this;
            /***&*/ if (data.length > 0) {
                _self.geoData = [];
                data.map((value, key) => {
                    _self.geoData.push({
                        geometry: {
                            type: 'point',
                            x: Number(value.attributes.lon),
                            y: Number(value.attributes.lat)
                        },
                        //geometry至少有以上三项
                        attributes: {
                            ObjectID: key + 1,
                            name: value.attributes.name,
                            type: value.attributes.sType,
                            tieluju: value.attributes.tieluju,
                            address: value.attributes.address
                        }
                        //attributes里面数据可以扩展
                    });
                });
            }
            // console.log('trans返回的数据：', _self.geoData);
            /***&*/ return _self.geoData;
        }
    }
};
</script>

<style>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    /* width: 370px; */
    /* width: 346px; */
    width: 288px;
    height: 30px;
    /* background-color: #67c23a45; */
    background-color: #666e75;
    top: 20px;
    right: 15px;
}
.maptools-item {
    line-height: 30px;
    margin-left: 10px;
    color: white;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}

.el-icon-my-len {
    background: url('~@/assets/icon/909399/len.png') center no-repeat;
    background-size: contain;
}
.el-icon-my-len:before {
    content: '测距';
    font-size: 5px;
    visibility: hidden;
}
.el-icon-my-area {
    background: url('~@/assets/icon/909399/area3.png') center no-repeat;
    /* background-size: cover; */
    background-size: contain;
}
.el-icon-my-area:before {
    content: '测面积';
    font-size: 5px;
    visibility: hidden;
}
/* .el-icon-my-latlon {  BUG莫名其妙宽度为45，就是图标离字比较远
    background: url('~@/assets/icon/909399/latlon.png') center no-repeat; 
    background-size: contain;
}
.el-icon-my-latlon:before {
    content: '经纬度';
    font-size: 5px;
    visibility: hidden;
} */
</style>
