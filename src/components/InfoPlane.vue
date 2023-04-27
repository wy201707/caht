<template>
    <div class="TimeInfoComponent-pannel" v-show="this.$store.getters._getDefaultTimeInfoVisible">
        <div class="TimeInfoComponent-header">
            <span>选择面板（做成三可以折叠比较好）</span>
            <i class="el-icon-close" @click="closeTimeInfoPannel"></i>
        </div>

        <div class="TimeInfo-content-pannel">
            <!-- 这种单选可以同时选择多个选项
            <el-radio v-model="windData" label="1">风速、风向（置信度、风区）</el-radio>
            <el-radio v-model="waveData" label="2">浪高、浪向（置信度）</el-radio>
            <el-radio v-model="currentData" label="3">流速、流向（置信度）</el-radio> -->
            加图例，
            颜色深浅显示大小（风浪流各一种颜色，eg红黄绿，但是感觉还是彩色好看，查查流向分几个级别），方向显示来向？（注意风向）
            <el-radio-group v-model="DataType" @change="getRadarData($event)">
                <el-radio :label="1">风速、风向（置信度、风区）</el-radio>
                <el-radio :label="2">浪高、浪向（置信度）</el-radio>
                <el-radio :label="3">流速、流向（置信度）</el-radio>
            </el-radio-group>
        </div>
        <!-- <div class="TimeInfo-content-pannel">
             ③这一层应该是表单 ，时间间隔，和刷新秒数，可以加一个computed
            <div class="block">
                <span class="demonstration">选择起始时间 【②不合适，搞成分开的，太站地方了】</span>
                <el-date-picker
                    v-model="value2"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </div>
            <el-input-number v-model="interval" @change="ChangeInterval" :min="5" :max="60" label="刷新时间间隔(s)">
                这里选择器有个step="5" 报错
            </el-input-number>
        </div> -->
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from './config';
export default {
    name: 'InfoPlane',
    components: {},
    /*     mounted: function () {
        this.getWindData();
    }, */
    data() {
        return {
            DataType: 1,
            // Data: [],
            // windData: [],
            // waveData: [],
            // currentData: [],
            FiledRatation: '',
            FiledColor: '',
            steps: [],
            interval: 5,
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
            value2: ''
        };
    },
    methods: {
        /*  async getWindData() {
            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [GeoJSONLayer] = await loadModules(['esri/layers/GeoJSONLayer'], config.options);

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
        choiceType(label) {
            // FiledRatation = '';
            // FiledColor = '';
            // steps = [];
            console.log('choiceType');
            this.DataType = label;
            switch (label) {
                case 1:
                    this.FiledRatation = 'WindDir';
                    this.FiledColor = 'WindVelocity';
                    this.steps = [
                        { value: 1.6, color: '#2b83ba' },
                        { value: 5.5, color: '#abdda4' },
                        { value: 8.0, color: '#ffffbf' },
                        { value: 13.9, color: '#fdae61' },
                        { value: 20.8, color: '#d7191c' },
                        { value: 30, color: '#ffffff' }
                    ];
                    break;
                case 2:
                    this.FiledRatation = 'WaveDir';
                    this.FiledColor = 'WavaHs';
                    this.steps = [
                        { value: 0.1, color: '#2b83ba' },
                        { value: 0.5, color: '#abdda4' },
                        { value: 1.0, color: '#ffffbf' },
                        { value: 1.5, color: '#fdae61' },
                        { value: 2, color: '#d7191c' },
                        { value: 4, color: '#ffffff' }
                    ];
                    break;
                case 3:
                    this.FiledRatation = 'CurDirection';
                    this.FiledColor = 'Currert';
                    this.steps = [
                        { value: 20, color: '#2b83ba' },
                        { value: 50, color: '#abdda4' },
                        { value: 65, color: '#ffffbf' },
                        { value: 80, color: '#fdae61' },
                        { value: 95, color: '#d7191c' },
                        { value: 110, color: '#ffffff' }
                    ];
                    break;
                default:
                    console.log('单选项返回值出错');
            }

            // var dir_ration = this.FiledRatation;
            // var mag_color = this.FiledColor;
            // var s = this.steps;
            // console.log('dir_ration', dir_ration);
            // console.log('mag_color', mag_color);
            // console.log('s', s);
            // console.log('FiledRatation, FiledColor, steps', this.FiledRatation, this.FiledColor, this.steps);
            // console.log(resArr);
            // return { dir_ration: this.FiledRatation, mag_color: this.FiledColor, s: this.steps };
            // return FiledRatation, FiledColor, steps;
            // var resArr = new Array(this.FiledRatation, this.FiledColor, this.steps);
            // return resArr;
        },
        async getRadarData(label) {
            // console.log(label);

            const _self = this;
            const view = this.$store.getters._getDefaultView;
            const [GeoJSONLayer] = await loadModules(['esri/layers/GeoJSONLayer'], config.options);

            const resultLayer = view.map.findLayerById('GeoJSON');
            if (resultLayer) {
                view.map.remove(resultLayer);
            }
            // ！！！诶，不对吧，这个“多层显示的选择显示”好像应该放在maptools里面，但是有个这个动画有关系。
            // ！！！先实现一层的动画，在实现多层动画，再实现多层的选择

            // //取数据
            const url = 'http://localhost:80/vuegis/static/data/2021-09-12/GeoData2021-09-12-00-10.json';

            // await this.choiceType(); //①估计要改为promise
            const referenceScale = 9244650;
            await this.choiceType(label);
            // var symbolType = await this.choiceType(label);
            // console.log('symbolType', symbolType);
            // console.log('FiledRatation', this.FiledRatation);
            // console.log('FiledColor', this.FiledColor);
            // console.log('steps', this.steps);
            // FiledRatation = symbolType[0];
            // FiledColor = symbolType[1];
            // steps = symbolType[2];
            // console.log(FiledRatation, FiledColor, steps);
            const renderer = {
                type: 'simple', // autocasts as new SimpleRenderer()
                symbol: {
                    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                    // Arrow marker
                    path: 'M14.5,29 23.5,0 14.5,9 5.5,0z', // The SVG path of the icon.
                    color: [250, 250, 250],
                    outline: {
                        color: [255, 255, 255, 0.5],
                        width: 0.5
                    },
                    angle: 180,
                    size: 15
                },
                visualVariables: [
                    {
                        type: 'rotation',
                        field: this.FiledRatation,
                        rotationType: 'geographic' //这估计要改
                    },
                    {
                        type: 'color',
                        field: this.FiledColor,
                        stops: this.steps
                    }
                ]
            };

            let template = {
                title: '{coordinates}详细信息',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'WaveHs',
                                label: '浪高'
                            },
                            {
                                fieldName: 'WaveDir',
                                label: '浪向'
                            },
                            {
                                fieldName: 'WaveCredit',
                                label: '置信度'
                            },
                            {
                                fieldName: 'WindVelocity',
                                label: '风速'
                            },
                            {
                                fieldName: 'WindDir',
                                label: '风向'
                            },
                            {
                                fieldName: 'WindFetch',
                                label: '风区'
                            },
                            {
                                fieldName: 'Current',
                                label: '流速'
                            },
                            {
                                fieldName: 'CurDirection',
                                label: '流向'
                            },
                            {
                                fieldName: 'CurCredit',
                                label: '置信度（流）'
                            }
                        ]
                    }
                ]
            };
            // 删除层的时候似乎没有比较区分是风浪流哪类数据的层
            // var NowType=[1,2,3].filter(function(l){
            //     return l==this.DataType
            // })

            // id: 'GeoJSON'+this.DataType,
            const geojsonLayer = new GeoJSONLayer({
                id: 'GeoJSON',
                url: url,
                popupTemplate: template,
                renderer: renderer
            });
            view.map.add(geojsonLayer);

            geojsonLayer.on('update-end', function (e) {
                view.map.setExtent(e.target.extent.expand(1.2));
            });
        },

        ChangeInterval() {},

        closeTimeInfoPannel() {
            const currentVisible = this.$store.getters._getDefaultTimeInfoVisible;
            this.$store.commit('_setDefaultTimeInfoVisible', !currentVisible);
        }
    }
};
</script>

<style>
.Type-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 250px;
    height: 280px;
    background-color: #fff;
}
.TimeInfoComponent-pannel {
    position: absolute;
    top: 20px;
    left: 15px;
    width: 250px;
    height: 280px;
    background-color: #fff;
}
.TimeInfoComponent-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.TimeInfoComponent-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.TimeInfoComponent-header > i {
    line-height: 35px;
    cursor: pointer;
}
.TimeInfo-select-pannel {
    width: 100%;
    height: 30px;
    padding: 0 5px;
    box-sizing: border-box;
    margin: 5px 0;
}
.TimeInfo-select-label {
    font-size: 13px;
}
.TimeInfo-content-pannel {
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

.TimeInfoComponent-pannel tr {
    display: block; /*将tr设置为块体元素*/
    margin-bottom: 15px; /*设置tr间距为15px*/
}
</style>
