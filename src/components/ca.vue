<template>
    <div class="XZQHComponent-pannel" v-show="this.$store.getters._getDefaultXZQHVisible">
        <div class="XZQHComponent-header">
            <span>行政区划导航</span>
            <i class="el-icon-close" @click="closeXZQHPannel"></i>
        </div>

        <div class="XZQH-select-pannel">
            <span class="XZQH-select-label">省份：</span>
            <el-select
                v-model="provinceValue"
                @change="handleProvinceValueChange"
                size="mini"
                clearable
                placeholder="请选择省份"
            >
                <el-option v-for="item in provinceOptions" :key="item.label" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>

        <div class="XZQH-content-pannel">
            <tbody>
                <tr v-for="item in cityAndCountyOptions" :key="item.label">
                    <td style="min-width: 50px">
                        <span class="city-item" :value="item.value" @click="handleItemClick(item.value)">
                            {{ item.label }}
                        </span>
                    </td>
                    <td>
                        <span
                            class="county-item"
                            v-for="item2 in item.children"
                            :key="item2.attributes.name"
                            :value="item2.attributes.code"
                            @click="handleItemClick2(item2.attributes.code)"
                            >{{ item2.attributes.name }}</span
                        >
                    </td>
                </tr>
            </tbody>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';

let graphic = '';

export default {
    name: 'XZQHComponent',
    components: {},
    data() {
        return {
            provinceOptions: [],
            provinceValue: '',
            cityAndCountyOptions: [],
        };
    },
    mounted: function () {
        this.getProvinceData();
    },
    methods: {
        //获取行政区划 省份数据  (使用属性查询API)
        async getProvinceData() {
            const _self = this;
            //web发布的服务，的ArcGIS查询接口
            const [QueryTask, Query] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query'],
                config.options,
            );
            const queryTask = new QueryTask({
                // url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHProvince_WebMokatuo/FeatureServer/0',
                // url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer/1',
                url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/2XZQH_Province_WebMokatuo/FeatureServer/10',
            });

            //实例化Query（不需要传参数），但是要指定以下三个属性的值
            let query = new Query();
            query.returnGeometry = false; //是否需要返回所查询信息的地理信息  ——行政区划查询面板不需要
            query.outFields = ['*']; //返回数据领域 ——返回所有
            query.where = '1=1'; //sql查询语句 ——返回所有

            //Promise then 链式调用
            // queryTask.execute()返回Promise对象
            // 这里还有另一种写法
            queryTask.execute(query).then(function (results) {
                let currentData = [];
                if (results.features.length > 0) {
                    results.features.map((item) => {
                        currentData.push({
                            value: item.attributes.ADM1_PCODE,
                            label: item.attributes.ADM1_ZH,
                        });
                    });
                    // console.log(currentData);
                    _self.provinceOptions = currentData;
                } else {
                    _self.$message({
                        message: '暂时没有省份数据',
                        type: 'warning',
                    });
                }
            });
        },
        //行政区划 省份数据变化事件
        async handleProvinceValueChange(value) {
            this.getCityAndCountyData(value);
        },
        async getCityAndCountyData(value) {
            const _self = this;
            const provinceCode = value;
            const [QueryTask, Query] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query'],
                config.options,
            );

            // 查找市级数据
            const queryTask = new QueryTask({
                url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/2XZQH_City_WebMokatuo/FeatureServer/11',
            });
            let query = new Query();
            query.returnGeometry = false;
            query.outFields = ['*'];
            query.where = "ADM1_PCODE like'" + provinceCode + "%'";
            // console.log(provinceCode);
            // ADM1_PCODE like 'CN061%'
            //async await用法  ————queryTask.execute()的另一种写法
            let results = await queryTask.execute(query);

            let currentCityData = [];
            if (results.features.length > 0) {
                results.features.map((item) => {
                    currentCityData.push({
                        value: item.attributes.ADM2_PCODE,
                        label: item.attributes.ADM2_ZH,
                    });
                });
                // console.log(currentCityData);
                //循环遍历 获取每一市级对应的区县数据
                Promise.all(
                    currentCityData.map(async (item2) => {
                        const cityCode = item2.value.toString().substring(3, 7);
                        const queryTask2 = new QueryTask({
                            // url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty_WebMokatuo/FeatureServer/0',
                            url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty4_WebMokatuo/FeatureServer/2',
                        });
                        // console.log(cityCode);
                        let query2 = new Query();
                        query2.returnGeometry = false;
                        query2.outFields = ['*'];
                        query2.where = "code like '" + cityCode + "%'";

                        const result2 = await queryTask2.execute(query2);
                        /*                         let currentCountyData = [];
                        if (result2.length > 0) {
                            result2.features.map((item2) => {
                                currentCountyData.push({
                                    value: item2.attributes.code,
                                    label: item2.attributes.name,
                                });
                            });
                        }

                        console.log(currentCountyData);
                        item2.children = currentCityData; */
                        item2.children = result2.features;
                        // console.log('item2 child:', item2.children);
                        return item2;
                    }),
                ).then((res) => {
                    this.cityAndCountyOptions = res;
                });
            } else {
                _self.$message({
                    message: '暂时没有市级数据',
                    type: 'warning',
                });
            }
        },
        //定位跳转并高亮
        async handleItemClick(val) {
            let serverUrl = '';
            let code = '';

            const view = this.$store.getters._getDefaultView;

            code = val.toString();
            serverUrl =
                'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/2XZQH_City_WebMokatuo/FeatureServer/11';

            const [QueryTask, Query, Graphic, Polyline] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/Graphic', 'esri/geometry/Polyline'],
                config.options,
            );
            const queryTask = new QueryTask({
                url: serverUrl,
            });
            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.where = "ADM2_PCODE = '" + code + "'";

            console.log(code, query.where);
            let results = await queryTask.execute(query);

            //渲染和定位
            const featuresResult = results.features[0]; //总以集合形式返回
            if (graphic) {
                view.graphics.remove(graphic);
            }
            const fillSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1],
                outline: {
                    color: '#00FFFF',
                    width: 2,
                },
            };
            //实例化和添加行政区划的边界（高亮）
            console.log('results.features[0].geometry', featuresResult.geometry);
            graphic = await new Graphic({
                geometry: featuresResult.geometry,
                symbol: fillSymbol,
            });
            console.log(graphic);
            /*  try {
                view.graphics.add(graphic);
                console.log('try graphic', graphic);
            } catch (err) {
                this.$message.error(err.message);
                console.log(err);
            } */

            /*             //（地图中心的）跳转
            view.goTo({
                center: [
                    featuresResult.geometry.extent.center.longitude,
                    featuresResult.geometry.extent.center.latitude,
                ],
                zoom: 8, //缩放程度设为8级
            }); */
            var polyline = new Polyline(featuresResult.geometry.rings);

            const lineSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1],
                outline: {
                    color: '#00FFFF',
                    width: 2,
                },
            };
            var graphic2 = await new Graphic({
                geometry: polyline,
                symbol: lineSymbol,
            });
            view.graphics.add(graphic2);
        },

        async handleItemClick2(val) {
            let serverUrl = '';
            let code = '';

            const view = this.$store.getters._getDefaultView;
            // 改这里，分市用截图那个服务，分县用原本分县的那个服务（不要过i分兴奋，第二个服务地理信息够用嘛？）

            code = val.toString().substring(0, 6);
            serverUrl =
                'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCounty4_WebMokatuo/FeatureServer/2';

            const [QueryTask, Query, Graphic, Polyline] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/Graphic', 'esri/geometry/Polyline'],
                config.options,
            );
            const queryTask = new QueryTask({
                url: serverUrl,
            });
            let query = new Query();
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.where = " code = '" + code + "'";

            console.log(code, query.where);
            let results = await queryTask.execute(query);

            //渲染和定位
            const featuresResult = results.features;
            if (graphic) {
                view.graphics.remove(graphic);
            }
            /*             const fillSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1], //0.1是透明度
                outline: {
                    color: '#00FFFF',
                    width: 2,
                }, //这是外边界
            }; */
            const fillSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1],
                outline: {
                    color: '#00FFFF',
                    width: 2,
                },
            };
            //实例化和添加行政区划的边界（高亮）
            console.log('results.features', results.features);
            console.log('results.features[0].geometry', featuresResult.geometry);
            graphic = await new Graphic({
                geometry: featuresResult.geometry,
                symbol: fillSymbol,
            });
            console.log(graphic);
            console.log(typeof graphic);
            try {
                view.graphics.add(graphic);
                console.log('try graphic', graphic);
            } catch (err) {
                this.$message.error(err.message);
                console.log(err);
            }

            /*             //（地图中心的）跳转
            view.goTo({
                center: [
                    featuresResult.geometry.extent.center.longitude,
                    featuresResult.geometry.extent.center.latitude,
                ],
                zoom: 8, //缩放程度设为8级
            }); */
            var polyline = new Polyline(featuresResult.geometry.rings);

            const lineSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1],
                outline: {
                    color: '#00FFFF',
                    width: 2,
                },
            };
            var graphic2 = await new Graphic({
                geometry: polyline,
                symbol: lineSymbol,
            });
            view.graphics.add(graphic2);
        },

        closeXZQHPannel() {
            const currentVisible = this.$store.getters._getDefaultXZQHVisible;
            this.$store.commit('_setDefaultXZQHVisible', !currentVisible);
        },
    },
};
</script>

<style>
.XZQHComponent-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 500px;
    height: 600px;
    background-color: #fff;
}
.XZQHComponent-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.XZQHComponent-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.XZQHComponent-header > i {
    line-height: 35px;
    cursor: pointer;
}
.XZQH-select-pannel {
    width: 100%;
    height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 5px 0;
}
.XZQH-select-label {
    font-size: 13px;
}
.XZQH-content-pannel {
    width: 100%;
    height: 525px;
    overflow: auto;
    padding: 0 5px;
    box-sizing: border-box;
}
.city-item {
    font-size: 12px;
    color: #5f6477;
    font-weight: 600;
    cursor: pointer;
}
.county-item {
    font-size: 12px;
    color: #999;
    margin: 0 10px 5px 0;
    cursor: pointer;
}
.county-item:hover {
    color: #409eff;
}

.XZQHComponent-pannel tr {
    display: block; /*将tr设置为块体元素*/
    margin-bottom: 15px; /*设置tr间距为15px*/
}
</style>
